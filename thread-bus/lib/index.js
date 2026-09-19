import { randomUUID } from "node:crypto";

export const name = "thread-bus";
export const inject = ["tools", "agents"];

const PLUGIN = "thread-bus";
const PACKAGE = "dsh-plugin-thread-bus";
const RPC_PREFIX = "thread-bus";
const FRAME = "[thread-bus]";
const AUDIT = "[thread-bus audit]";
const DIAG_PATH = "/api/plugins/thread-bus/diagnostics";
const DELIVER_SUBAGENT_PROMPT = Symbol.for("dsh.subagent.deliverPrompt");

const TOOL = {
	list: "list_threads",
	create: "create_thread",
	rename: "rename_thread",
	read: "read_thread",
	stop: "stop_thread",
	thread: "instruct_thread",
	subagent: "instruct_subagent",
	report: "report_to_parent",
	ask: "ask_parent"
};

const KIND_BY_TOOL = {
	[TOOL.thread]: "thread",
	[TOOL.subagent]: "instruction",
	[TOOL.report]: "report",
	[TOOL.ask]: "question"
};

const DEFAULT_CONFIG = {
	coldStart: "root",
	maxChars: 4000,
	maxSendsPerTurn: 20,
	maxSendsPerPair: 40
};

const CONFIG_KEYS = Object.keys(DEFAULT_CONFIG);
const COLD_START_VALUES = ["root", "refuse"];

function resolveConfig(raw) {
	const config = { ...DEFAULT_CONFIG };
	if (raw === undefined || raw === null) return config;
	if (typeof raw !== "object" || Array.isArray(raw)) throw new Error("thread-bus config must be an object");
	for (const key of Object.keys(raw)) if (!CONFIG_KEYS.includes(key)) throw new Error(`thread-bus config has an unknown key "${key}"`);
	if (raw.coldStart !== undefined) {
		if (!COLD_START_VALUES.includes(raw.coldStart)) throw new Error(`thread-bus config coldStart must be one of ${COLD_START_VALUES.join(", ")}`);
		config.coldStart = raw.coldStart;
	}
	for (const key of ["maxChars", "maxSendsPerTurn", "maxSendsPerPair"]) {
		if (raw[key] === undefined) continue;
		if (!Number.isSafeInteger(raw[key]) || raw[key] <= 0) throw new Error(`thread-bus config ${key} must be a positive safe integer`);
		config[key] = raw[key];
	}
	return config;
}

function createLimits() {
	const pairs = new Map();
	const turns = new Map();
	return {
		beginTurn(agentId, turn) {
			const current = turns.get(agentId);
			if (current === undefined || current.turn !== turn) turns.set(agentId, { turn, count: 0 });
		},
		claim(fromId, toId, kind, turn, config) {
			const pairKey = `${kind}|${fromId}|${toId}`;
			const pair = (pairs.get(pairKey) ?? 0) + 1;
			pairs.set(pairKey, pair);
			if (pair > config.maxSendsPerPair) return { ok: false, code: "pair", observed: `${pair} messages to the same target` };
			const turnKey = turns.get(fromId) ?? { turn, count: 0 };
			const count = turnKey.count + 1;
			turns.set(fromId, { turn, count });
			if (count > config.maxSendsPerTurn) return { ok: false, code: "turn", observed: `${count} messages in one turn` };
			return { ok: true };
		}
	};
}

const TOOL_DESCRIPTION = {
	[TOOL.list]:
		"List the root threads of this workspace that can receive a cross-thread instruction.\n\n"
		+ "Call it before instruct_thread when you do not know the exact target id, or when the human names another thread by its title. "
		+ "Returns current titles and stable IDs for root threads in your workspace, including closed threads. Titles are resolved by the host at call time. Match the requested title to this result and pass its ID to instruct_thread. Never search session files or archives to discover titles. If a title changes, call list_threads again; if multiple titles match, ask the human to disambiguate. Subagents are never listed.",
	[TOOL.thread]:
		"Send an instruction from this thread to the main agent of another root thread in the same workspace.\n\n"
		+ "Use it when the human asks you to tell or ask another thread something, when work in another thread already holds context you would otherwise duplicate, or when a decision belongs to that thread. "
		+ "The message is delivered to that thread's main agent as a user-role message: it reads as coming from a person and keeps your thread's name in its origin label. "
		+ "The mode argument decides how it lands, and the default is what you almost always want: mode=\"queue\" makes the instruction that thread's next turn, so it is read when the thread finishes what it is doing; mode=\"steer\" injects the instruction immediately, at the thread's nearest step (or as its next turn when it is idle). "
		+ "Use steer only when the human explicitly asked to interrupt that thread now, or when its current work has just become pointless (a changed requirement it must stop acting on). Never use steer merely to get a faster answer. "
		+ "Allowed target: a root thread id from list_threads, in the same working directory. "
		+ "Forbidden: a subagent of another thread, your own subagents (use instruct_subagent), and cross-thread messages initiated by a subagent. "
		+ "Kind: imperative — write a clear request or instruction, not a status note. "
		+ "No answer comes back automatically; ask for a report inside the message when you need one, and expect the answer as a separate message from that thread.",
	[TOOL.subagent]:
		"Send an instruction to one of your own subagents. This is a steer: it reaches the subagent at its nearest step, immediately.\n\n"
		+ "Use it to correct, redirect or extend work that the subagent is doing now, and to answer a question it asked with ask_parent. "
		+ "Allowed target: a direct subagent of this thread. Forbidden: a subagent of another thread, or a deeper subagent that is not yours. "
		+ "Kind: imperative — an instruction to act. The subagent answers with report_to_parent while it works, with ask_parent when it is blocked, and with its final result through the standard send_message; a subagent never commands you. "
		+ "The subagent receives it as a user-role message labelled Instruction. You are the one who manages subagents: they report and ask, you decide.",
	[TOOL.report]:
		"Send your parent an INTERMEDIATE status report while you are still working. No answer is expected. This is not the way to hand over your finished result.\n\n"
		+ "Use it for progress, findings and blockers the parent should know about while the task continues, and for facts the parent does not have to react to. "
		+ "Allowed target: your direct parent agent only. Forbidden: another thread's parent, a sibling agent, or a cross-thread message — a subagent never initiates cross-thread messaging. "
		+ "Kind: informative — state facts only, request nothing, and do not phrase it as an instruction to the parent. "
		+ "If you need a decision, an answer or unblocking, use ask_parent instead; report_to_parent never obliges the parent to reply. "
		+ "The division is by phase, not by preference: while the task is running use report_to_parent for status and ask_parent for questions; when the task is finished send your final result with the standard send_message, exactly as your task instructions require. "
		+ "Never send a status update with ask_parent (it pauses you and forces an answer), and never deliver your final result with report_to_parent (the parent treats it as work in progress, not as the answer).",
	[TOOL.ask]:
		"Ask your parent a question WHILE THE TASK IS STILL RUNNING. An answer is expected, and asking pauses you until it arrives. This is not the way to hand over your finished result.\n\n"
		+ "Use it when the current work cannot continue without the parent: you are blocked, a decision is the parent's to make, or only the parent has the information. "
		+ "Allowed target: your direct parent agent only. Forbidden: another thread's parent, a sibling agent, or a cross-thread message — a subagent never initiates cross-thread messaging. "
		+ "Kind: inquisitive — one clear question plus the context needed to answer it. "
		+ "The parent receives it as a user-role message labelled Question and answers with instruct_subagent; the answer arrives later as a separate message and does not block your current step, so state what you will do meanwhile."
		+ " This call pauses you: after asking, your current turn ends and you stay idle until the parent answers. Do not start other work while waiting, and put everything the parent needs into one question. "
		+ "Never use it to report status: a status update goes through report_to_parent and expects no answer, while asking pauses you and forces the parent to answer. "
		+ "When the task is finished, the final result goes through the standard send_message, not through ask_parent and not through report_to_parent. "
		+ "If you only need the parent to know something, that is a report; ask only when you genuinely cannot continue."
	,
	[TOOL.create]:
		"Create a new root thread in this workspace and give it its first instruction.\n\n"
		+ "Use it when work deserves its own thread: a long investigation, a separate deliverable, or anything the human will want to follow on its own. "
		+ "Only a root thread can create another root thread; a subagent never creates threads. "
		+ "You write the new thread's first message yourself, in full: the new agent does not see this conversation, so state the goal, the constraints and what done looks like. "
		+ "Pass model as \"provider/model\" to choose the new thread's model; by default, when you omit it, the new thread starts on the very same model you are running on. "
		+ "A model you pass must be one this deployment currently serves; the available models live in the harness model catalog and may change over time, so never assume a fixed list — an unknown model is refused with the current list. "
		+ "Pass title to name the thread up front. "
		+ "The call returns the new thread id; the first instruction is delivered as its opening turn.",
	[TOOL.rename]:
		"Rename a root thread.\n\n"
		+ "Use it when the human asks to rename a thread, or when a thread's title no longer matches what it is doing. "
		+ "Any root thread of this workspace can be renamed, including your own and a thread that is not running; only root threads can rename, and a subagent never renames anything. "
		+ "Renaming attaches the target thread's agent so the new title is committed, but it sends no message and starts no work there. "
		+ "Titles are what list_threads returns, so keep them short and specific.",
	[TOOL.read]:
		"Read the latest messages of another thread without waking it.\n\n"
		+ "Use it to check what another thread already found before you duplicate it, to summarise progress for the human, or to answer a question about that thread. "
		+ "Allowed targets: root threads of this workspace and, for a parent agent, its own subagents; a subagent may read only its direct parent. "
		+ "Messages come newest-last: the last entry is the most recent one. Each entry carries its durable seq, its position from the end (-1 is the newest message) and its text, truncated. "
		+ "When the result says hasMore, call again with beforeSeq set to nextBeforeSeq to page further back; never guess seq values. "
		+ "Reading never resumes the target agent and never changes the thread.",
	[TOOL.stop]:
		"Stop a root thread immediately: its current turn is cancelled and all of its subagents are released.\n\n"
		+ "Use it when the human asks to stop a thread, before deleting it, or when a root agent orchestrating several threads must halt one branch that is now pointless. "
		+ "Allowed target: a root thread of this workspace; only root threads can stop, and a subagent never stops anything. "
		+ "Pending messages of that thread are dropped, its subagent activations are released, and the thread stays on disk with its full log — stopping is not deleting, and the thread can be resumed later by an instruction. "
		+ "A thread that is not running is reported as already stopped.",
};

const PARAMETERS = {
	[TOOL.list]: { type: "object", properties: {} },
	[TOOL.thread]: {
		type: "object",
		properties: {
			target: { type: "string", description: "Root thread id to instruct, as listed by list_threads." },
			message: { type: "string", description: "The instruction itself, written in full; the other agent does not see this conversation." },
			mode: { type: "string", enum: ["queue", "steer"], description: "queue (default): the instruction becomes that thread's next turn. steer: it is injected at that thread's nearest step now, interrupting it; use it only for a human-requested interruption or work that must stop." }
		},
		required: ["target", "message"]
	},
	[TOOL.subagent]: {
		type: "object",
		properties: {
			target: { type: "string", description: "Agent id of your direct subagent." },
			message: { type: "string", description: "The instruction itself, written in full; the subagent does not see this conversation." }
		},
		required: ["target", "message"]
	},
	[TOOL.report]: {
		type: "object",
		properties: {
			message: { type: "string", description: "The status or finding, written in full; your parent does not see this conversation." }
		},
		required: ["message"]
	},
	[TOOL.create]: {
		type: "object",
		properties: {
			message: { type: "string", description: "The new thread's first instruction, written in full: goal, constraints and what done looks like. The new agent does not see this conversation." },
			model: { type: "string", description: "Model for the new thread as \"provider/model\" from the deployment's current catalog. Omit to inherit the model you are running on." },
			title: { type: "string", description: "Short name for the new thread. Omit to let the thread start untitled." }
		},
		required: ["message"]
	},
	[TOOL.rename]: {
		type: "object",
		properties: {
			target: { type: "string", description: "Root thread id to rename, as listed by list_threads." },
			title: { type: "string", description: "The new title: short and specific." }
		},
		required: ["target", "title"]
	},
	[TOOL.stop]: {
		type: "object",
		properties: {
			target: { type: "string", description: "Root thread id to stop." }
		},
		required: ["target"]
	},
	[TOOL.read]: {
		type: "object",
		properties: {
			target: { type: "string", description: "Thread to read: a root thread of this workspace, or your own subagent." },
			limit: { type: "number", description: "How many messages to return, 1-30 (default 8)." },
			beforeSeq: { type: "number", description: "Read messages older than this seq; pass nextBeforeSeq from a previous call to page back." },
			includeTools: { type: "boolean", description: "Include tool calls and results (default false, text messages only)." },
			maxChars: { type: "number", description: "Per-message text cap, 80-1000 (default 400)." }
		},
		required: ["target"]
	},
	[TOOL.ask]: {
		type: "object",
		properties: {
			message: { type: "string", description: "The question plus the context needed to answer it; your parent does not see this conversation." }
		},
		required: ["message"]
	}
};

const OUTPUT_SCHEMA = {
	type: "object",
	properties: {
		delivered: { type: "boolean" },
		target: { type: "string" },
		messageId: { type: "string" },
		transport: { type: "string" },
		text: { type: "string" }
	},
	required: ["delivered", "target", "messageId", "transport"]
};

function deepFreeze(value) {
	if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
	Object.freeze(value);
	for (const key of Object.keys(value)) deepFreeze(value[key]);
	return value;
}

function createUserMessage(input) {
	return deepFreeze(structuredClone({ ...input, role: "user", id: randomUUID() }));
}

function normalizeText(value) {
	return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function descendantsOf(ctx, rootId) {
	const all = ctx.agents?.list?.() ?? [];
	const ids = [];
	for (const agent of all) {
		let parent = agent?.session?.header?.parentSession;
		let depth = 0;
		while (parent !== undefined && depth < 16) {
			if (parent === rootId) {
				ids.push(agent.id);
				break;
			}
			parent = ctx.agents?.get?.(parent)?.session?.header?.parentSession;
			depth += 1;
		}
	}
	return ids;
}

function createJournal(ctx) {
	const entries = new Map();
	let revision = 0;
	const write = (entry) => {
		const line = `[${PACKAGE}] ${entry.level.toUpperCase()} ${entry.code} (${entry.scope}): ${entry.message}`
			+ ` | expected: ${entry.expected} | observed: ${entry.observed} | fix: ${entry.hint}`
			+ (entry.logs.length > 0 ? ` | logs: ${entry.logs.join(" ; ")}` : "");
		try {
			const logger = ctx.logger;
			if (entry.level === "error" && typeof logger?.error === "function") logger.error(line);
			else if (typeof logger?.warn === "function") logger.warn(line);
		} catch {}
		if (typeof console !== "undefined") {
			if (entry.level === "error") console.error(line);
			else console.warn(line);
		}
	};
	const api = {
		put(code, level, scope, message, detail = {}) {
			const existing = entries.get(code);
			const entry = {
				code,
				level,
				scope,
				message,
				expected: detail.expected ?? "",
				observed: detail.observed ?? "",
				hint: detail.hint ?? "",
				logs: detail.logs ?? [],
				count: (existing?.count ?? 0) + 1,
				at: Date.now()
			};
			entries.set(code, entry);
			revision += 1;
			if (existing === undefined || existing.level !== level) write(entry);
			return entry;
		},
		clear(code) {
			if (entries.delete(code)) revision += 1;
		},
		snapshot() {
			return { revision, entries: [...entries.values()] };
		}
	};
	return api;
}

function sessionLogPath(sessionId) {
	return `~/.dsh/sessions/<cwd-slug>/${sessionId}/session.v3.jsonl.zstd`;
}

function readLogs(sessionId) {
	return [
		`zstdcat ${sessionLogPath(sessionId)} | jq -c 'select(.type=="user/message")'`,
		"browser console: filter [dsh-plugin-thread-bus]",
		"host terminal of the running `dsh web`"
	];
}

async function observe(services, journal, sessionId) {
	const query = services.sessionQuery;
	if (query === undefined) {
		journal.put("SVC-sessionQuery", "error", "sessionQuery", "the session query service is missing, sessions cannot be inspected", {
			expected: "the dsh-session-query service",
			observed: "not mounted yet",
			hint: "@deepseek-ai/dsh-session-query is not mounted in this deployment"
		});
		return undefined;
	}
	journal.clear("SVC-sessionQuery");
	try {
		const observation = await query.observeSession?.(sessionId);
		if (observation === undefined || observation === null) {
			journal.put("API-observeSession", "error", "sessionQuery", "observeSession returned no observation", {
				expected: "a caller-owned observation lease",
				observed: String(observation),
				hint: "@deepseek-ai/dsh-session-query observeSession"
			});
			return undefined;
		}
		journal.clear("API-observeSession");
		return observation;
	} catch (error) {
		journal.put(`CLASSIFY-${sessionId}`, "warn", "classify", "a session could not be observed", {
			expected: "a readable session lease",
			observed: String(error),
			hint: "@deepseek-ai/dsh-session-query observeSession",
			logs: readLogs(sessionId)
		});
		return undefined;
	}
}

function releaseObservation(observation) {
	try {
		if (typeof observation?.[Symbol.dispose] === "function") observation[Symbol.dispose]();
		else if (typeof observation?.dispose === "function") observation.dispose();
	} catch {}
}

async function headerOf(services, journal, sessionId) {
	const published = services.sessions?.get?.(sessionId);
	if (published?.header !== undefined) return published.header;
	const observation = await observe(services, journal, sessionId);
	if (observation === undefined) return undefined;
	try {
		return observation.header;
	} finally {
		releaseObservation(observation);
	}
}

function roleOfHeader(header) {
	if (header === undefined) return { kind: "unknown" };
	if (header.origin === "subagent") return { kind: "subagent", parentId: header.parentSession };
	return { kind: "root" };
}

function roleOfAgent(ctx, agent) {
	const header = agent?.session?.header;
	if (header === undefined) return { kind: "unknown" };
	const base = roleOfHeader(header);
	if (base.kind !== "root") return base;
	if (header.parentSession !== undefined) {
		const parent = ctx.agents?.get?.(header.parentSession);
		if (parent !== undefined && ctx.agents?.isOwnedBy?.(agent.id, parent) === true) return { kind: "subagent", parentId: header.parentSession };
	}
	return { kind: "root" };
}

function deniedFor(role) {
	return role === "subagent" ? [TOOL.thread, TOOL.list, TOOL.create, TOOL.rename, TOOL.stop] : [TOOL.report, TOOL.ask];
}

function expectedFor(role) {
	return role === "subagent"
		? [TOOL.subagent, TOOL.report, TOOL.ask, TOOL.read]
		: [TOOL.list, TOOL.create, TOOL.rename, TOOL.read, TOOL.stop, TOOL.thread, TOOL.subagent];
}

function frameText(kind, fromId) {
	const lead = kind === "thread"
		? "Cross-thread instruction from another root thread"
		: kind === "instruction"
			? "Instruction from your parent agent"
			: kind === "report"
				? "Status report from your subagent (no answer needed)"
				: "Question from your subagent (an answer is expected)";
	const reply = kind === "report" || kind === "question"
		? `Answer with instruct_subagent({ target: "${fromId}", message: "..." }).`
		: kind === "instruction"
			? "While working, use report_to_parent for status and ask_parent for a question; when you finish, send your final result with send_message as your task instructions say."
			: `Answer with instruct_thread({ target: "${fromId}", message: "..." }) when the other thread needs to know.`;
	return `${FRAME} kind=${kind} from=${fromId} — ${lead}. This message is not from the human user. ${reply}`;
}

function buildBlocks(kind, fromId, text) {
	return [{ type: "text", text: frameText(kind, fromId) }, { type: "text", text }];
}

function buildSource(kind, fromId) {
	return { kind: "user", rpcId: `${RPC_PREFIX}:${kind}:${fromId}:${randomUUID()}` };
}

function buildAudit(kind, toId, mode) {
	return createUserMessage({
		content: [{
			type: "text",
			text: `${AUDIT} kind=${kind} to=${toId} mode=${mode} status=delivered at=${new Date().toISOString()}`
		}],
		source: { kind: "plugin", plugin: PLUGIN }
	});
}

function validateArguments(parameters, args) {
	const violations = [];
	if (args === null || typeof args !== "object" || Array.isArray(args)) return ["arguments must be an object"];
	for (const key of parameters.required ?? []) if (!Object.hasOwn(args, key)) violations.push(`"${key}" is required`);
	for (const [key, schema] of Object.entries(parameters.properties ?? {})) {
		if (!Object.hasOwn(args, key) || args[key] === undefined) continue;
		const value = args[key];
		if (schema.type === "string" && typeof value !== "string") violations.push(`"${key}" must be a string`);
		else if (schema.type === "string" && value.trim().length === 0) violations.push(`"${key}" must not be empty`);
		else if (schema.enum !== undefined && !schema.enum.includes(value)) violations.push(`"${key}" must be one of ${schema.enum.join(", ")}`);
	}
	for (const key of Object.keys(args)) if (!Object.hasOwn(parameters.properties ?? {}, key)) violations.push(`"${key}" is not an accepted argument`);
	return violations;
}

function defineTool(spec) {
	return {
		name: spec.name,
		description: spec.description,
		parameters: spec.parameters,
		output: {
			schema: OUTPUT_SCHEMA,
			render: (args, value) => spec.render(args, value)
		},
		async execute(args, exec) {
			const violations = validateArguments(spec.parameters, args);
			if (violations.length > 0) throw new Error(`invalid arguments: ${violations.join("; ")}`);
			return spec.execute(args, exec);
		}
	};
}

function findRpcId(events, rpcId) {
	for (const event of events ?? []) {
		if (event?.type === "user/message") {
			if (event.data?.source?.rpcId === rpcId || event.data?.message?.source?.rpcId === rpcId) return true;
			continue;
		}
		if (event?.type === "agent/inbox/spliced") {
			for (const message of event.data?.inserted ?? []) if (message?.source?.rpcId === rpcId) return true;
		}
	}
	return false;
}

async function readback(services, journal, sessionId, rpcId) {
	if (rpcId === undefined) return undefined;
	const observation = await observe(services, journal, sessionId);
	if (observation === undefined) return undefined;
	try {
		return findRpcId(observation.events, rpcId);
	} finally {
		releaseObservation(observation);
	}
}

function agentInboxHas(agent, messageId) {
	const inbox = agent?.inbox;
	if (inbox === undefined) return undefined;
	const buckets = [inbox.nextStep, inbox.nextTurn];
	for (const bucket of buckets) {
		if (!Array.isArray(bucket)) continue;
		for (const message of bucket) if (message?.id === messageId) return true;
	}
	return false;
}

function clampInteger(value, minimum, maximum, fallback) {
	if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
	const rounded = Math.trunc(value);
	if (rounded < minimum) return minimum;
	if (rounded > maximum) return maximum;
	return rounded;
}

function textOfContent(content) {
	return (content ?? [])
		.filter((block) => block?.type === "text" && typeof block.text === "string")
		.map((block) => block.text)
		.join("\n")
		.trim();
}

function messageLines(events, options) {
	const { includeTools, maxChars } = options;
	const rows = [];
	for (const event of events ?? []) {
		if (event?.type === "user/message") {
			const text = textOfContent(event.data?.content);
			if (text.length > 0) rows.push({ seq: event.seq, index: rows.length, role: "user", time: event.time, text });
			continue;
		}
		if (event?.type === "assistant/message") {
			const text = textOfContent(event.data?.message?.content);
			if (text.length > 0) rows.push({ seq: event.seq, index: rows.length, role: "assistant", time: event.time, text });
			continue;
		}
		if (!includeTools) continue;
		if (event?.type === "tool/call") {
			rows.push({ seq: event.seq, index: rows.length, role: "tool", time: event.time, text: `${String(event.data?.name)} ${String(event.data?.arguments ?? "").slice(0, maxChars)}`.trim() });
			continue;
		}
		if (event?.type === "tool/result") {
			const text = textOfContent(event.data?.message?.content);
			if (text.length > 0) rows.push({ seq: event.seq, index: rows.length, role: "tool-result", time: event.time, text });
		}
	}
	return rows;
}

async function readThread(ctx, services, journal, agent, args, signal) {
	const target = typeof args.target === "string" ? args.target : "";
	if (target.length === 0) throw new Error("read_thread needs a target thread id; call list_threads to find it");
	const callerRole = roleOfAgent(ctx, agent);
	const targetHeader = await headerOf(services, journal, target);
	if (targetHeader === undefined) throw new Error(`thread "${target}" could not be read`);
	const targetRole = roleOfHeader(targetHeader);
	if (targetRole.kind === "subagent") {
		if (targetHeader.parentSession !== agent?.id) throw new Error(`"${target}" is not your own subagent`);
	} else {
		if (callerRole.kind !== "root") throw new Error("a subagent may read only its direct parent, not other root threads");
		const cwd = agent?.session?.header?.cwd;
		if (cwd === undefined || targetHeader.cwd !== cwd) throw new Error("read_thread is limited to threads of the same working directory");
	}
	const observation = await observe(services, journal, target);
	if (observation === undefined) throw new Error(`thread "${target}" could not be read`);
	const limit = clampInteger(args.limit, 1, 30, 8);
	const maxChars = clampInteger(args.maxChars, 80, 1000, 400);
	const beforeSeq = typeof args.beforeSeq === "number" && Number.isFinite(args.beforeSeq) ? Math.trunc(args.beforeSeq) : undefined;
	try {
		const all = messageLines(observation.events, { includeTools: args.includeTools === true, maxChars });
		const older = beforeSeq === undefined ? all : all.filter((row) => row.seq < beforeSeq);
		const window = older.slice(Math.max(0, older.length - limit));
		const messages = window.map((row) => ({
			seq: row.seq,
			fromEnd: row.index - all.length,
			role: row.role,
			time: row.time,
			text: row.text.length > maxChars ? `${row.text.slice(0, maxChars)}…` : row.text
		}));
		const hasMore = older.length > window.length;
		return {
			thread: target,
			messages,
			firstSeq: window.length === 0 ? undefined : window[0].seq,
			lastSeq: window.length === 0 ? undefined : window[window.length - 1].seq,
			hasMore,
			nextBeforeSeq: hasMore ? window[0].seq : undefined
		};
	} finally {
		releaseObservation(observation);
	}
}

async function catalogModels(ctx) {
	const llm = ctx.get("llm");
	if (llm === undefined) return undefined;
	const entries = new Set();
	try {
		for (const provider of llm.listProviders?.() ?? []) {
			for (const model of await (llm.listModels?.(provider.id) ?? [])) {
				const id = typeof model === "string" ? model : model?.id ?? model?.model;
				if (typeof id === "string" && id.length > 0) entries.add(`${provider.id}/${id}`);
			}
		}
	} catch (error) {
		return undefined;
	}
	return entries.size === 0 ? undefined : entries;
}

function resolveRequestedModel(catalog, requested, callerProvider) {
	if (catalog === undefined) return undefined;
	if (catalog.has(requested)) return requested;
	if (requested.includes("/")) return undefined;
	const matches = [...catalog].filter((entry) => entry.slice(entry.indexOf("/") + 1) === requested);
	if (matches.length === 1) return matches[0];
	if (matches.length > 1 && callerProvider !== undefined) {
		const preferred = matches.find((entry) => entry.startsWith(`${callerProvider}/`));
		if (preferred !== undefined) return preferred;
	}
	return matches.length > 0 ? matches[0] : undefined;
}

async function assertModelAvailable(ctx, requested, parsed) {
	if (requested === undefined) return parsed;
	const catalog = await catalogModels(ctx);
	if (catalog === undefined) return parsed;
	const resolved = resolveRequestedModel(catalog, requested, parsed.provider);
	if (resolved !== undefined) {
		const at = resolved.indexOf("/");
		return { provider: resolved.slice(0, at), model: resolved.slice(at + 1) };
	}
	throw new Error(`model "${requested}" is not served by this deployment; the available models are: ${[...catalog].sort().join(", ")}`);
}

async function createThread(ctx, journal, services, config, agent, args, signal) {
	const cwd = agent?.session?.header?.cwd;
	if (cwd === undefined) throw new Error("create_thread needs the caller's working directory");
	const controller = services.sessionController;
	if (typeof controller?.create !== "function") throw new Error("creating threads needs @deepseek-ai/dsh-api-session-controller");
	const created = await controller.create({ cwd });
	const sessionId = created?.sessionId;
	if (typeof sessionId !== "string" || sessionId.length === 0) throw new Error("the new thread id was not returned");
	const inherited = [agent?.options?.provider, agent?.options?.model].filter(Boolean).join("/");
	const requested = typeof args.model === "string" && args.model.trim().length > 0 ? args.model.trim() : undefined;
	const selected = requested ?? inherited;
	if (selected.length > 0 && typeof controller.selectModel === "function") {
		const at = selected.indexOf("/");
		const provider = at > 0 ? selected.slice(0, at) : agent?.options?.provider;
		const name = at > 0 ? selected.slice(at + 1) : selected;
		if (provider !== undefined && name.length > 0) {
			const resolved = await assertModelAvailable(ctx, requested, { provider, model: name });
			await controller.selectModel({ sessionId, provider: resolved.provider, model: resolved.model });
		}
	}
	if (typeof args.title === "string" && args.title.trim().length > 0 && typeof controller.rename === "function") {
		await controller.rename({ sessionId, title: args.title.trim() });
	}
	return sessionId;
}

async function renameThread(services, journal, agent, args) {
	const target = typeof args.target === "string" ? args.target : "";
	const title = typeof args.title === "string" ? args.title.trim() : "";
	if (target.length === 0 || title.length === 0) throw new Error("rename_thread needs both a target id and a title");
	const targetHeader = await headerOf(services, journal, target);
	if (targetHeader === undefined) throw new Error(`thread "${target}" could not be found`);
	if (roleOfHeader(targetHeader).kind !== "root") throw new Error("only root threads can be renamed");
	const cwd = agent?.session?.header?.cwd;
	if (cwd === undefined || targetHeader.cwd !== cwd) throw new Error("rename_thread is limited to threads of the same working directory");
	const controller = services.sessionController;
	if (typeof controller?.rename !== "function") throw new Error("renaming needs @deepseek-ai/dsh-api-session-controller");
	const renamed = await controller.rename({ sessionId: target, title });
	return { title: renamed?.title ?? title, seq: renamed?.seq };
}

function createDelivery(ctx, journal, services, config, waiting) {
	const attempt = async (input) => {
		const { kind, fromId, toId, text, mode, signal } = input;
		const source = buildSource(kind, fromId);
		const content = buildBlocks(kind, fromId, text);
		const message = createUserMessage({ content, source });
		if (kind === "thread") {
			const agent = ctx.agents?.get?.(toId);
			if (agent !== undefined) {
				if (mode === "steer") agent.steer(message);
				else agent.followup(message);
				return { messageId: message.id, rpcId: source.rpcId, transport: "root-live", agent };
			}
			if (config.coldStart === "refuse") {
				journal.put(`POLICY-cold-${toId}`, "warn", "policy", "cross-thread delivery refused: the target thread is not running", {
					expected: "a live target thread",
					observed: "no live agent",
					hint: "coldStart is configured as refuse; ask the human to open the target thread first"
				});
				throw new Error(`thread "${toId}" is not running and coldStart is configured as refuse`);
			}
			const controller = services.sessionController;
			if (controller === undefined) {
				journal.put("SVC-sessionController", "error", "sessionController", "a cold root thread cannot be resumed", {
					expected: "the dsh-api-session-controller service",
					observed: "not mounted yet",
					hint: "@deepseek-ai/dsh-api-session-controller is not mounted",
					logs: readLogs(toId)
				});
				throw new Error("cross-thread delivery needs @deepseek-ai/dsh-api-session-controller to resume a cold thread");
			}
			journal.clear("SVC-sessionController");
			const resumed = await controller.resolveAgent(toId);
			const target = resumed?.agent ?? resumed;
			if (target === undefined || typeof target.followup !== "function") {
				journal.put(`DELIVER-resume-${toId}`, "error", "deliver", "the target thread could not be resumed", {
					expected: "an Agent with followup/steer",
					observed: JSON.stringify(resumed)?.slice(0, 200),
					hint: "@deepseek-ai/dsh-api-session-controller resolveAgent",
					logs: readLogs(toId)
				});
				throw new Error(`thread "${toId}" could not be resumed`);
			}
			journal.clear(`DELIVER-resume-${toId}`);
			target.followup(message);
			return { messageId: message.id, rpcId: source.rpcId, transport: "root-resumed", agent: target };
		}
		if (kind === "instruction") {
			const subagents = services.subagents;
			const deliver = subagents?.[DELIVER_SUBAGENT_PROMPT];
			if (typeof deliver !== "function") {
				journal.put("API-deliverPrompt", "error", "subagents", "subagent instruction delivery is unavailable", {
					expected: "the symbol-keyed host delivery on the dsh-subagent service",
					observed: typeof deliver,
					hint: "@deepseek-ai/dsh-subagent internal.js deliverSubagentPrompt = Symbol.for('dsh.subagent.deliverPrompt')",
					logs: readLogs(toId)
				});
				throw new Error("subagent delivery needs the dsh-subagent host delivery seam");
			}
			journal.clear("API-deliverPrompt");
			const parent = ctx.agents?.get?.(fromId);
			const messageId = await deliver.call(subagents, parent, toId, content, source, signal ?? new AbortController().signal, "steer");
			waiting.delete(toId);
			return { messageId: messageId ?? message.id, rpcId: source.rpcId, transport: "subagent-steer", agent: ctx.agents?.get?.(toId) };
		}
		const parent = ctx.agents?.get?.(toId);
		if (parent === undefined) {
			journal.put(`DELIVER-parent-${toId}`, "error", "deliver", "your parent agent is not live, the message was not delivered", {
				expected: "a live parent agent",
				observed: "no live agent",
				hint: "the parent thread is closed; report/ask only works while your parent is live",
				logs: readLogs(toId)
			});
			throw new Error(`parent agent "${toId}" is not live`);
		}
		journal.clear(`DELIVER-parent-${toId}`);
		parent.steer(message);
		return { messageId: message.id, rpcId: source.rpcId, transport: kind === "ask" ? "parent-ask" : "parent-report", agent: parent };
	};

	const verify = async (input, result) => {
		const { kind, fromId, toId } = input;
		const rpcPrefix = `${RPC_PREFIX}:${kind}:${fromId}:`;
		const source = result.rpcId;
		if (source !== undefined && !source.startsWith(rpcPrefix)) {
			journal.put(`READBACK-source-${toId}`, "error", "readback", "the delivered message carries an unexpected attribution", {
				expected: `rpcId starting with ${rpcPrefix}`,
				observed: source,
				hint: "@deepseek-ai/dsh-subagent submitAdmitted / dsh-agent inbox",
				logs: readLogs(toId)
			});
		}
		const seen = await readback(services, journal, toId, source);
		if (seen === undefined) return;
		if (seen === true) journal.clear(`READBACK-${toId}`);
		else {
			journal.put(`READBACK-${toId}`, "error", "readback", "the delivered message is not in the target thread log", {
				expected: "a user/message (or inbox splice) carrying our rpcId",
				observed: "no matching event",
				hint: "@deepseek-ai/dsh-subagent continuation.js / dsh-agent inbox splice",
				logs: readLogs(toId)
			});
		}
		if (seen !== true && result.agent !== undefined && agentInboxHas(result.agent, result.messageId) === false) {
			journal.put(`WAKE-${toId}`, "warn", "wake", "the message was accepted but the target inbox does not hold it", {
				expected: "the delivered message id present in nextStep or nextTurn",
				observed: "absent",
				hint: "@deepseek-ai/dsh-agent-loop inbox splice/wake",
				logs: readLogs(toId)
			});
		} else journal.clear(`WAKE-${toId}`);
	};

	return { attempt, verify, buildSource, buildBlocks, buildAudit };
}

function registerTools(ctx, journal, delivery, services, config, limits, waiting) {
	const disposers = [];
	const register = (spec) => {
		try {
			const disposer = ctx.tools.register(defineTool(spec));
			disposers.push(disposer);
			journal.clear(`TOOL-REGISTER-${spec.name}`);
			return true;
		} catch (error) {
			journal.put(`TOOL-REGISTER-${spec.name}`, "error", "tools", `the ${spec.name} tool was rejected by the registry`, {
				expected: "tools.register accepts the definition",
				observed: String(error),
				hint: "@deepseek-ai/dsh-tools register(): output.render plus a supported output schema are required"
			});
			return false;
		}
	};

	register({
		name: TOOL.list,
		description: TOOL_DESCRIPTION[TOOL.list],
		parameters: PARAMETERS[TOOL.list],
		render: (_args, value) => [{ type: "text", text: value?.text ?? "no root threads" }],
		async execute(_args, exec) {
			const cwd = exec.agent?.session?.header?.cwd;
			if (cwd === undefined) throw new Error("list_threads requires the caller's workspace");
			const query = services.sessionQuery;
			if (query === undefined) throw new Error("the session query service is unavailable");
			const records = (await query.listSessions(exec.signal)).filter(({ header }) => header.cwd === cwd && header.origin !== "subagent");
			const titles = await query.readTitleSnapshots(records.map(({ header }) => header.id), exec.signal);
			const threads = records.map(({ header }, index) => {
				const result = titles[index];
				if (result.status !== "fulfilled") throw new Error(`cannot resolve the current title for ${header.id}: ${String(result.reason)}`);
				const agent = ctx.agents.get(header.id);
				return { id: header.id, title: result.value.title?.title ?? "Untitled", current: header.id === exec.agent.id, state: agent?.status ?? "closed" };
			});
			return { delivered: true, target: String(threads.length), messageId: "-", transport: "list", text: JSON.stringify({ threads }) };
		}
	});

	register({
		name: TOOL.thread,
		description: TOOL_DESCRIPTION[TOOL.thread],
		parameters: PARAMETERS[TOOL.thread],
		render: (args) => [{ type: "text", text: `instruction delivered to thread ${String(args.target)}` }],
		async execute(args, exec) {
			const caller = exec.agent;
			const role = roleOfAgent(ctx, caller);
			const mode = args.mode === "steer" ? "steer" : "queue";
			const result = await runDelivery(ctx, journal, delivery, services, config, limits, waiting, {
				kind: "thread",
				caller,
				role,
				toId: args.target,
				text: args.message,
				mode,
				signal: exec.signal
			});
			return { delivered: true, target: args.target, messageId: result.messageId, transport: result.transport };
		}
	});

	register({
		name: TOOL.subagent,
		description: TOOL_DESCRIPTION[TOOL.subagent],
		parameters: PARAMETERS[TOOL.subagent],
		render: (args) => [{ type: "text", text: `instruction delivered to subagent ${String(args.target)}` }],
		async execute(args, exec) {
			const caller = exec.agent;
			const role = roleOfAgent(ctx, caller);
			const result = await runDelivery(ctx, journal, delivery, services, config, limits, waiting, {
				kind: "instruction",
				caller,
				role,
				toId: args.target,
				text: args.message,
				mode: "steer",
				signal: exec.signal
			});
			return { delivered: true, target: args.target, messageId: result.messageId, transport: result.transport };
		}
	});

	for (const [toolName, kind] of [[TOOL.report, "report"], [TOOL.ask, "question"]]) {
		register({
			name: toolName,
			description: TOOL_DESCRIPTION[toolName],
			parameters: PARAMETERS[toolName],
			render: kind === "question"
				? () => [{ type: "text", text: "question delivered to your parent; you are paused until the parent answers with an instruction" }]
				: () => [{ type: "text", text: "status report delivered to your parent; no answer is expected, continue your work" }],
			async execute(args, exec) {
				const caller = exec.agent;
				const role = roleOfAgent(ctx, caller);
				const result = await runDelivery(ctx, journal, delivery, services, config, limits, waiting, {
					kind,
					caller,
					role,
					toId: role.parentId,
					text: args.message,
					mode: "steer",
					signal: exec.signal
				});
				if (kind === "question") waiting.add(caller.id);
				return { delivered: true, target: String(role.parentId ?? ""), messageId: result.messageId, transport: result.transport };
			}
		});
	}

	register({
		name: TOOL.create,
		description: TOOL_DESCRIPTION[TOOL.create],
		parameters: PARAMETERS[TOOL.create],
		render: (_args, value) => [{ type: "text", text: `created thread ${String(value?.target ?? "")}` }],
		async execute(args, exec) {
			const caller = exec.agent;
			const role = roleOfAgent(ctx, caller);
			if (role.kind !== "root") throw new Error("only a root thread can create another root thread");
			const sessionId = await createThread(ctx, journal, services, config, caller, args, exec.signal);
			const delivered = await runDelivery(ctx, journal, delivery, services, config, limits, waiting, {
				kind: "thread",
				caller,
				role,
				toId: sessionId,
				text: args.message,
				mode: "queue",
				signal: exec.signal
			});
			return { delivered: true, target: sessionId, messageId: delivered.messageId, transport: "created" };
		}
	});

	register({
		name: TOOL.rename,
		description: TOOL_DESCRIPTION[TOOL.rename],
		parameters: PARAMETERS[TOOL.rename],
		render: (args, value) => [{ type: "text", text: `renamed ${String(args.target)} to "${String(value?.transport ?? "")}"` }],
		async execute(args, exec) {
			const role = roleOfAgent(ctx, exec.agent);
			if (role.kind !== "root") throw new Error("only a root thread can rename a thread");
			const renamed = await renameThread(services, journal, exec.agent, args);
			return { delivered: true, target: args.target, messageId: "-", transport: renamed.title };
		}
	});

	register({
		name: TOOL.stop,
		description: TOOL_DESCRIPTION[TOOL.stop],
		parameters: PARAMETERS[TOOL.stop],
		render: (_args, value) => [{ type: "text", text: value?.text ?? "thread stopped" }],
		async execute(args, exec) {
			const role = roleOfAgent(ctx, exec.agent);
			if (role.kind !== "root") throw new Error("only a root thread can stop another root thread");
			const target = typeof args.target === "string" ? args.target : "";
			if (target.length === 0) throw new Error("stop_thread needs a target thread id; call list_threads to find it");
			if (target === exec.agent?.id) throw new Error("stop_thread stops another thread; stopping yourself would only end your own turn");
			const targetHeader = await headerOf(services, journal, target);
			if (targetHeader === undefined) throw new Error(`thread "${target}" could not be found`);
			if (roleOfHeader(targetHeader).kind !== "root") throw new Error("only root threads can be stopped");
			const cwd = exec.agent?.session?.header?.cwd;
			if (cwd === undefined || targetHeader.cwd !== cwd) throw new Error("stop_thread is limited to threads of the same working directory");
			const live = ctx.agents?.get?.(target);
			if (live === undefined) return { delivered: true, target, messageId: "-", transport: "stopped", text: `thread ${target} is not running; nothing to stop` };
			const descendants = descendantsOf(ctx, target);
			if (descendants.length > 0 && typeof services.subagents?.drainDescendants === "function") {
				await services.subagents.drainDescendants([live]);
			}
			live.cancel({ kind: "user" });
			journal.put(`STOP-${target}`, "info", "stop", "thread stopped on request", {
				expected: "the thread and its subagents stop immediately",
				observed: `${descendants.length} subagent(s) released`,
				hint: "stop_thread keeps the log; deleting is a separate action"
			});
			return { delivered: true, target, messageId: "-", transport: "stopped", text: `stopped thread ${target}; ${descendants.length} subagent(s) released` };
		}
	});

	register({
		name: TOOL.read,
		description: TOOL_DESCRIPTION[TOOL.read],
		parameters: PARAMETERS[TOOL.read],
		render: (_args, value) => [{ type: "text", text: value?.text ?? "no messages" }],
		async execute(args, exec) {
			const result = await readThread(ctx, services, journal, exec.agent, args, exec.signal);
			return { delivered: true, target: args.target, messageId: "-", transport: "read", text: JSON.stringify(result) };
		}
	});

	return disposers;
}

async function runDelivery(ctx, journal, delivery, services, config, limits, waiting, input) {
	const { kind, caller, role, toId, text, mode } = input;
	const fromId = caller?.id;
	if (caller === undefined || fromId === undefined) throw new Error("this tool requires a calling agent");
	if (typeof toId !== "string" || toId.length === 0) throw new Error("the target agent id is required");
	if (toId === fromId) throw new Error("a message cannot be sent to the same session");
	if (kind === "thread") {
		if (role.kind !== "root") throw new Error("only a root thread can send a cross-thread instruction; subagents report or ask their parent instead");
		const targetHeader = await headerOf(services, journal, toId);
		const targetRole = roleOfHeader(targetHeader);
		if (targetRole.kind !== "root") throw new Error("the target is a subagent: cross-thread delivery reaches root threads only, never another thread's subagents");
		const fromCwd = caller.session?.header?.cwd;
		const toCwd = targetHeader?.cwd;
		if (fromCwd === undefined || toCwd === undefined || fromCwd !== toCwd) {
			journal.put(`POLICY-cwd-${toId}`, "warn", "policy", "cross-thread delivery refused: different working directory", {
				expected: `both threads in ${String(fromCwd)}`,
				observed: `target in ${String(toCwd)}`,
				hint: "cross-thread messaging is limited to the same workspace"
			});
			throw new Error("cross-thread delivery needs both threads in the same working directory");
		}
		journal.clear(`POLICY-cwd-${toId}`);
	} else if (kind === "instruction") {
		const childHeader = await headerOf(services, journal, toId);
		if (childHeader === undefined) throw new Error(`the subagent "${toId}" could not be identified`);
		if (childHeader.parentSession !== fromId) throw new Error(`"${toId}" is not a direct subagent of this thread`);
	} else {
		if (role.kind !== "subagent" || role.parentId === undefined) throw new Error("this tool is only available to a subagent with a parent agent");
		if (toId !== role.parentId) throw new Error("this tool delivers to your direct parent only");
	}
	if (typeof text !== "string" || text.trim().length === 0) throw new Error("the message body must not be empty");
	if (text.length > config.maxChars) {
		journal.put(`POLICY-length-${fromId}`, "warn", "policy", "message refused: it is longer than the configured maximum", {
			expected: `at most ${config.maxChars} characters`,
			observed: `${text.length} characters`,
			hint: "thread-bus config maxChars"
		});
		throw new Error(`the message body exceeds ${config.maxChars} characters`);
	}
	journal.clear(`POLICY-length-${fromId}`);
	const claim = limits.claim(fromId, toId, kind, 0, config);
	if (claim.ok !== true) {
		journal.put(`POLICY-rate-${fromId}`, "warn", "policy", "message refused: the sending rate limit was reached", {
			expected: claim.code === "pair" ? `at most ${config.maxSendsPerPair} messages per target` : `at most ${config.maxSendsPerTurn} messages per turn`,
			observed: claim.observed,
			hint: "thread-bus config maxSendsPerPair / maxSendsPerTurn"
		});
		throw new Error("the sending rate limit was reached; wait for the target to answer instead of repeating the message");
	}
	journal.clear(`POLICY-rate-${fromId}`);
	const result = await delivery.attempt({ kind, fromId, toId, text, mode, signal: input.signal });
	try {
		caller.inject?.(delivery.buildAudit(kind, toId, mode));
	} catch (error) {
		journal.put("AUDIT", "warn", "audit", "the sender audit record could not be injected", {
			expected: "agent.inject accepts a plugin message",
			observed: String(error),
			hint: "@deepseek-ai/dsh-agent-loop Agent.inject"
		});
	}
	await delivery.verify({ kind, fromId, toId }, result);
	return { messageId: result.messageId, transport: result.transport, agent: result.agent };
}

function applyRoleScopes(ctx, journal) {
	const applyOne = (agent) => {
		const role = roleOfAgent(ctx, agent);
		if (role.kind === "unknown") return;
		const deny = deniedFor(role.kind);
		try {
			agent.ctx.tools.restrict({ deny });
			journal.clear(`SCOPE-${agent.id}`);
		} catch (error) {
			journal.put(`SCOPE-${agent.id}`, "error", "tools", "the role tool restriction could not be applied", {
				expected: `tools.restrict(${JSON.stringify({ deny })}) on the agent scope`,
				observed: String(error),
				hint: "@deepseek-ai/dsh-tools restrict(): scoped context plus known global tool names"
			});
		}
	};
	for (const agent of ctx.agents.list?.() ?? []) applyOne(agent);
	ctx.on("agent/created", (payload) => {
		const agent = payload?.agent ?? payload;
		if (agent?.id !== undefined) applyOne(agent);
	});
}

function verifyToolDelivery(ctx, journal, registered, baselineHeaders) {
	const live = ctx.agents.list?.() ?? [];
	for (const agent of live) {
		const role = roleOfAgent(ctx, agent);
		if (role.kind === "unknown") continue;
		for (const toolName of expectedFor(role.kind)) {
			const code = `INJECT-${agent.id}-${toolName}`;
			const visible = ctx.tools.get(toolName, agent);
			const expected = registered.get(toolName);
			if (visible === undefined) {
				journal.put(code, "error", "injection", `the ${toolName} tool is not visible to this agent`, {
					expected: "the tool definition is present on this agent scope",
					observed: "absent",
					hint: "@deepseek-ai/dsh-tools layers/restrict, or a preset/delegation toolFilter that denies it"
				});
				continue;
			}
			if (expected !== undefined && normalizeText(visible.description) !== normalizeText(expected.description)) {
				journal.put(code, "error", "injection", `the ${toolName} description differs from the registered one`, {
					expected: normalizeText(expected.description).slice(0, 160),
					observed: normalizeText(visible.description).slice(0, 160),
					hint: "@deepseek-ai/dsh-tools register(): another registration shadows this name"
				});
				continue;
			}
			journal.clear(code);
		}
		for (const toolName of deniedFor(role.kind)) {
			const code = `SCOPE-VISIBLE-${agent.id}-${toolName}`;
			if (ctx.tools.get(toolName, agent) === undefined) journal.clear(code);
			else journal.put(code, "warn", "injection", `the ${toolName} tool is visible to an agent whose role forbids it`, {
				expected: `absent for role ${role.kind}`,
				observed: "visible",
				hint: "the agent/created role restriction did not apply"
			});
		}
		const header = agent.session?.requestHeader?.();
		if (!baselineHeaders.has(agent)) baselineHeaders.set(agent, header);
		if (header === baselineHeaders.get(agent)) continue;
		const tools = header?.tools;
		if (Array.isArray(tools) && tools.length > 0) {
			const names = new Set(tools.map((tool) => tool?.name));
			const ptcOnly = names.size === 1 && names.has("run_code");
			if (!ptcOnly) {
				for (const toolName of expectedFor(role.kind)) {
					const code = `HEADER-${agent.id}-${toolName}`;
					const delivered = tools.find((tool) => tool?.name === toolName);
					const expected = registered.get(toolName);
					if (delivered === undefined) {
						journal.put(code, "warn", "injection", `the ${toolName} schema is missing from the last logged request`, {
							expected: "the tool schema in request/header.tools",
							observed: "absent",
							hint: "@deepseek-ai/dsh-tools wireSchemas / systemPrompt.tools provider"
						});
						continue;
					}
					if (expected !== undefined && normalizeText(delivered.description) !== normalizeText(expected.description)) {
						journal.put(code, "warn", "injection", `the delivered ${toolName} description differs`, {
							expected: normalizeText(expected.description).slice(0, 160),
							observed: normalizeText(delivered.description ?? "").slice(0, 160),
							hint: "@deepseek-ai/dsh-tools schemaOf / request header canonicalization"
						});
						continue;
					}
					journal.clear(code);
				}
			}
		}
	}
}

function registerDiagnosticsRoute(connectionCtx, ctx, journal, registered, config, baselineHeaders, services, waiting) {
	const connection = connectionCtx.connection;
	if (connection?.fetch?.register === undefined) {
		journal.put("SVC-connection", "error", "connection", "the UI diagnostics channel is unavailable", {
			expected: "the dsh-client-connection service fetch registry",
			observed: "undefined",
			hint: "@deepseek-ai/dsh-client-connection is not mounted; host-side findings stay in the terminal log"
		});
		return;
	}
	journal.clear("SVC-connection");
	try {
		connection.fetch.register({
			path: DIAG_PATH,
			methods: ["GET"],
			requestBody: "buffered",
			fetch: (request) => {
				const rejection = connection.requestRejection?.(request);
				if (rejection !== undefined) return new Response(rejection === 401 ? "unauthorized" : "forbidden", { status: rejection });
				verifyToolDelivery(ctx, journal, registered, baselineHeaders);
				const snapshot = journal.snapshot();
				const tools = {};
				for (const toolName of Object.values(TOOL)) tools[toolName] = ctx.tools.get(toolName) !== undefined;
				const seams = {
					subagentDelivery: typeof services.subagents?.[DELIVER_SUBAGENT_PROMPT],
					subagentChildren: typeof services.subagents?.listChildren,
					sessionList: typeof services.sessionController?.list,
					sessionQuery: typeof services.sessionQuery?.observeSession,
					sessionCreate: typeof services.sessionController?.create,
					sessionRename: typeof services.sessionController?.rename
				};
				return Response.json({ plugin: PACKAGE, revision: snapshot.revision, config, tools, seams, waiting: [...waiting], entries: snapshot.entries });
			}
		});
	} catch (error) {
		journal.put("ROUTE-diagnostics", "error", "connection", "the UI diagnostics route could not be registered", {
			expected: `connection.fetch.register(${DIAG_PATH})`,
			observed: String(error),
			hint: "@deepseek-ai/dsh-client-connection assertFetchRoute: path under /api, non-empty unique methods"
		});
	}
}

export function apply(ctx, rawConfig) {
	const journal = createJournal(ctx);
	const services = {
		sessions: ctx.get("sessions"),
		sessionQuery: undefined,
		subagents: undefined,
		sessionController: undefined
	};
	for (const [name, code] of [["sessionQuery", "SVC-sessionQuery"], ["subagents", "SVC-subagents"], ["sessionController", "SVC-sessionController"], ["connection", "SVC-connection"]]) {
		journal.put(code, "warn", name, `waiting for the ${name} service`, {
			expected: `the ${name} service is mounted`,
			observed: "not mounted yet",
			hint: `the plugin keeps working, this capability activates when the service appears`
		});
	}
	ctx.inject(["sessionQuery"], (queryCtx) => {
		services.sessionQuery = queryCtx.sessionQuery;
		journal.clear("SVC-sessionQuery");
	});
	ctx.inject(["subagents"], (subagentsCtx) => {
		services.subagents = subagentsCtx.subagents;
		journal.clear("SVC-subagents");
	});
	ctx.inject(["sessionController"], (controllerCtx) => {
		services.sessionController = controllerCtx.sessionController;
		journal.clear("SVC-sessionController");
	});
	const config = resolveConfig(rawConfig);
	const limits = createLimits();
	const waiting = new Set();
	const delivery = createDelivery(ctx, journal, services, config, waiting);
	const registered = new Map();
	const baselineHeaders = new WeakMap((ctx.agents.list?.() ?? []).map((agent) => [agent, agent.session?.requestHeader?.()]));
	ctx.on("agent/created", ({ agent }) => {
		baselineHeaders.set(agent, agent.session?.requestHeader?.());
	});
	for (const toolName of Object.values(TOOL)) {
		registered.set(toolName, { name: toolName, description: TOOL_DESCRIPTION[toolName], parameters: PARAMETERS[toolName] });
	}
	registerTools(ctx, journal, delivery, services, config, limits, waiting);
	for (const toolName of Object.values(TOOL)) {
		if (ctx.tools.get(toolName) === undefined) {
			journal.put(`TOOL-VISIBLE-${toolName}`, "error", "tools", `the ${toolName} tool is not registered`, {
				expected: "a global tool definition",
				observed: "absent",
				hint: "@deepseek-ai/dsh-tools register()"
			});
		}
	}
	applyRoleScopes(ctx, journal);
	ctx.on("agent/pre-step", (payload, next) => {
		const agent = payload?.agent;
		if (agent?.id !== undefined) limits.beginTurn(agent.id, payload?.turn ?? 0);
		if (agent?.id !== undefined && waiting.has(agent.id)) {
			const claimed = Array.isArray(payload?.messages) ? payload.messages : [];
			if (claimed.length > 0) {
				waiting.delete(agent.id);
				journal.clear(`WAIT-${agent.id}`);
				return next();
			}
			journal.put(`WAIT-${agent.id}`, "info", "wait", "this subagent is paused until its parent answers", {
				expected: "an answer from the parent, whatever channel it arrives on",
				observed: "waiting",
				hint: "ask_parent pauses the caller; any inbound message from the parent resumes it"
			});
			return { kind: "reject" };
		}
		return next();
	});
	ctx.inject(["connection"], (connectionCtx) => {
		registerDiagnosticsRoute(connectionCtx, ctx, journal, registered, config, baselineHeaders, services, waiting);
		verifyToolDelivery(ctx, journal, registered, baselineHeaders);
	});
	verifyToolDelivery(ctx, journal, registered, baselineHeaders);
	ctx.logger?.info?.(`[${PACKAGE}] thread messaging ready: ${Object.values(TOOL).join(", ")}`);
}
