import { readdir, readFile, rename, rm, cp, stat, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { basename, join } from "node:path";

export const name = "thread-trash";
export const inject = ["tools", "agents"];

const PACKAGE = "dsh-plugin-thread-trash";
const TOOL = "delete_thread";
const ROUTE_THREADS = "/api/plugins/thread-trash/threads";
const ROUTE_DELETE = "/api/plugins/thread-trash/delete";
const DIAG_PREFIX = "[dsh-plugin-thread-trash]";

const DEFAULT_CONFIG = {
	sessionsRoot: undefined,
	storagesRoot: undefined,
	trashRoot: undefined
};

function resolveConfig(raw) {
	const home = homedir();
	const config = {
		sessionsRoot: join(home, ".dsh", "sessions"),
		storagesRoot: join(home, ".dsh", "storages"),
		trashRoot: join(home, ".Trash"),
		...DEFAULT_CONFIG
	};
	if (raw === undefined || raw === null) return config;
	if (typeof raw !== "object" || Array.isArray(raw)) throw new Error("thread-trash config must be an object");
	for (const key of Object.keys(raw)) {
		if (!Object.hasOwn(DEFAULT_CONFIG, key)) throw new Error(`thread-trash config has an unknown key "${key}"`);
		if (typeof raw[key] !== "string" || raw[key].trim().length === 0) throw new Error(`thread-trash config ${key} must be a non-empty path`);
		config[key] = raw[key];
	}
	return config;
}

function createJournal(ctx) {
	const entries = new Map();
	let revision = 0;
	const write = (entry) => {
		const line = `${DIAG_PREFIX} ${entry.level.toUpperCase()} ${entry.code}: ${entry.message} | expected: ${entry.expected} | observed: ${entry.observed} | fix: ${entry.hint}`;
		try {
			if (entry.level === "error" && typeof ctx.logger?.error === "function") ctx.logger.error(line);
			else if (typeof ctx.logger?.warn === "function") ctx.logger.warn(line);
		} catch {}
		if (typeof console !== "undefined") {
			if (entry.level === "error") console.error(line);
			else console.warn(line);
		}
	};
	return {
		put(code, level, message, detail = {}) {
			const previous = entries.get(code);
			entries.set(code, {
				code,
				level,
				message,
				expected: detail.expected ?? "",
				observed: detail.observed ?? "",
				hint: detail.hint ?? "",
				count: (previous?.count ?? 0) + 1,
				at: Date.now()
			});
			revision += 1;
			if (previous === undefined || previous.level !== level) write(entries.get(code));
		},
		clear(code) {
			if (entries.delete(code)) revision += 1;
		},
		snapshot() {
			return { revision, entries: [...entries.values()] };
		}
	};
}

async function exists(path) {
	try {
		await stat(path);
		return true;
	} catch {
		return false;
	}
}

async function moveToTrash(config, path, label) {
	if (!(await exists(path))) return undefined;
	const stamp = new Date().toISOString().replace(/[:.]/g, "-");
	const target = join(config.trashRoot, `dsh-thread-${label}-${stamp}-${basename(path)}`);
	try {
		await rename(path, target);
		return target;
	} catch (error) {
		if (error?.code !== "EXDEV") throw error;
		await cp(path, target, { recursive: true });
		await rm(path, { recursive: true, force: true });
		return target;
	}
}

function descendantsOf(ctx, rootId) {
	const ids = [];
	for (const agent of ctx.agents?.list?.() ?? []) {
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
	const sessions = ctx.get("sessions");
	for (const entry of sessions?.list?.() ?? []) {
		let parent = entry?.header?.parentSession;
		let depth = 0;
		while (parent !== undefined && depth < 16) {
			if (parent === rootId) {
				if (!ids.includes(entry.id)) ids.push(entry.id);
				break;
			}
			parent = sessions.get(parent)?.header?.parentSession;
			depth += 1;
		}
	}
	return ids;
}

async function sessionDirectories(config, sessionId) {
	let slugs = [];
	try {
		slugs = await readdir(config.sessionsRoot, { withFileTypes: true });
	} catch {
		return [];
	}
	const found = [];
	for (const slug of slugs) {
		if (!slug.isDirectory()) continue;
		const slugPath = join(config.sessionsRoot, slug.name);
		let entries = [];
		try {
			entries = await readdir(slugPath, { withFileTypes: true });
		} catch {
			continue;
		}
		for (const entry of entries) {
			if (!entry.isDirectory()) continue;
			if (entry.name === sessionId || entry.name === `session-${sessionId}`) found.push(join(slugPath, entry.name));
		}
	}
	return found;
}

function stripDeletedIds(node, ids) {
	if (Array.isArray(node)) {
		const kept = node.filter((item) => !(typeof item === "string" && ids.includes(item))).map((item) => stripDeletedIds(item, ids));
		return kept;
	}
	if (node !== null && typeof node === "object") {
		const next = {};
		for (const [key, value] of Object.entries(node)) {
			if (ids.includes(key)) continue;
			next[key] = stripDeletedIds(value, ids);
		}
		return next;
	}
	return node;
}

async function cleanWorkspaceRegistry(config, ids, journal) {
	const path = join(config.storagesRoot, "workspace.json");
	if (!(await exists(path))) return false;
	try {
		const raw = JSON.parse(await readFile(path, "utf8"));
		await writeFile(path, `${JSON.stringify(stripDeletedIds(raw, ids), null, 2)}\n`, "utf8");
		return true;
	} catch (error) {
		journal.put("REGISTRY", "warn", "the workspace registry could not be cleaned", {
			expected: "removed session references in workspace.json",
			observed: String(error),
			hint: "the thread is already in the trash; remove the reference manually or report this"
		});
		return false;
	}
}

async function deleteThread(ctx, journal, services, config, caller, target) {
	const sessions = services.sessions;
	const header = sessions?.get?.(target)?.header;
	if (header === undefined) throw new Error(`thread "${target}" could not be found`);
	if (header.origin === "subagent") throw new Error("only root threads can be deleted");
	const cwd = caller?.session?.header?.cwd;
	if (cwd === undefined || header.cwd !== cwd) throw new Error("delete_thread is limited to threads of the same working directory");
	const live = ctx.agents?.get?.(target);
	if (live !== undefined) throw new Error(`thread "${target}" is running; stop it first with stop_thread, then delete it`);
	const ids = [target, ...descendantsOf(ctx, target)];
	const liveDescendant = ids.find((id) => ctx.agents?.get?.(id) !== undefined);
	if (liveDescendant !== undefined) throw new Error(`subagent "${liveDescendant}" is still running; stop the thread first`);
	const trashed = [];
	for (const id of ids) {
		for (const directory of await sessionDirectories(config, id)) {
			const moved = await moveToTrash(config, directory, id);
			if (moved !== undefined) trashed.push(moved);
		}
		const cache = join(config.storagesRoot, "session_projcache", "sessions", `${id}.json`);
		const movedCache = await moveToTrash(config, cache, id);
		if (movedCache !== undefined) trashed.push(movedCache);
	}
	await cleanWorkspaceRegistry(config, ids, journal);
	if (trashed.length === 0) {
		journal.put(`DELETE-empty-${target}`, "warn", "no files were found for this thread", {
			expected: "session directories under the configured sessions root",
			observed: config.sessionsRoot,
			hint: "check the thread-trash config sessionsRoot"
		});
	}
	journal.clear(`DELETE-${target}`);
	return { ids, trashed };
}

function roleOfAgent(ctx, agent) {
	const header = agent?.session?.header;
	if (header === undefined) return { kind: "unknown" };
	if (header.origin === "subagent") return { kind: "subagent", parentId: header.parentSession };
	if (header.parentSession !== undefined) {
		const parent = ctx.agents?.get?.(header.parentSession);
		if (parent !== undefined && ctx.agents?.isOwnedBy?.(agent.id, parent) === true) return { kind: "subagent", parentId: header.parentSession };
	}
	return { kind: "root" };
}

function applyRoleScope(ctx, journal) {
	const applyOne = (agent) => {
		const role = roleOfAgent(ctx, agent);
		if (role.kind !== "subagent") return;
		try {
			agent.ctx.tools.restrict({ deny: [TOOL] });
			journal.clear(`SCOPE-${agent.id}`);
		} catch (error) {
			journal.put(`SCOPE-${agent.id}`, "error", "the role tool restriction could not be applied", {
				expected: `tools.restrict({ deny: ["${TOOL}"] }) on the agent scope`,
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

function toolDescription() {
	return "Delete a root thread: its log, its subagent logs and its records are moved to the system Trash.\n\n"
		+ "Use it when the human asks to remove a thread, and only for a root thread of this workspace. "
		+ "The thread must not be running: stop it first with stop_thread, otherwise the call is refused. "
		+ "Deleting a root thread also moves the logs of all its subagents to the Trash. "
		+ "This is a recycle, not an erasure: the files stay recoverable in the Trash until the human empties it, and the thread disappears from the session list on the next refresh. "
		+ "Never delete a thread whose work the human may still need; prefer stop_thread when the goal is only to halt work.";
}

function defineTool(spec) {
	return {
		name: spec.name,
		description: spec.description,
		parameters: spec.parameters,
		output: {
			schema: spec.outputSchema,
			render: (args, value) => spec.render(args, value)
		},
		async execute(args, exec) {
			const violations = [];
			if (args === null || typeof args !== "object" || Array.isArray(args)) violations.push("arguments must be an object");
			else {
				if (typeof args.target !== "string" || args.target.trim().length === 0) violations.push('"target" is required and must be a non-empty string');
				for (const key of Object.keys(args)) if (key !== "target") violations.push(`"${key}" is not an accepted argument`);
			}
			if (violations.length > 0) throw new Error(`invalid arguments: ${violations.join("; ")}`);
			return spec.execute(args, exec);
		}
	};
}

function registerTool(ctx, journal, services, config) {
	const definition = defineTool({
		name: TOOL,
		description: toolDescription(),
		parameters: {
			type: "object",
			properties: {
				target: { type: "string", description: "Root thread id to delete, as listed by list_threads." }
			},
			required: ["target"]
		},
		outputSchema: {
			type: "object",
			properties: {
				deleted: { type: "array", items: { type: "string" } },
				trashed: { type: "array", items: { type: "string" } }
			},
			required: ["deleted", "trashed"]
		},
		render: (_args, value) => [{ type: "text", text: `moved ${String((value?.trashed ?? []).length)} file(s) to the Trash; deleted: ${(value?.deleted ?? []).join(", ")}` }],
		async execute(args, exec) {
			const caller = exec.agent;
			if (caller === undefined) throw new Error("delete_thread requires a calling agent");
			const role = roleOfAgent(ctx, caller);
			if (role.kind !== "root") throw new Error("only a root thread can delete another root thread");
			if (args.target === caller.id) throw new Error("delete_thread deletes another thread; a thread cannot delete itself");
			const result = await deleteThread(ctx, journal, services, config, caller, args.target);
			return { deleted: result.ids, trashed: result.trashed };
		}
	});
	try {
		ctx.tools.register(definition);
		journal.clear("TOOL-REGISTER");
	} catch (error) {
		journal.put("TOOL-REGISTER", "error", "the delete_thread tool was rejected by the registry", {
			expected: "tools.register accepts the definition",
			observed: String(error),
			hint: "@deepseek-ai/dsh-tools register(): output.render plus a supported output schema are required"
		});
	}
	if (ctx.tools.get(TOOL) === undefined) {
		journal.put("TOOL-VISIBLE", "error", "the delete_thread tool is not registered", {
			expected: "a global tool definition",
			observed: "absent",
			hint: "@deepseek-ai/dsh-tools register()"
		});
	}
}

async function rootThreads(ctx, services) {
	const published = [];
	for (const entry of services.sessions?.list?.() ?? []) {
		published.push({
			sessionId: entry.id,
			cwd: entry.header?.cwd,
			origin: entry.header?.origin,
			running: ctx.agents?.get?.(entry.id) !== undefined
		});
	}
	if (typeof services.sessionQuery?.readTitleSnapshots === "function" && published.length > 0) {
		try {
			const titles = await services.sessionQuery.readTitleSnapshots(published.map((thread) => thread.sessionId), new AbortController().signal);
			titles.forEach((result, index) => {
				if (result?.status === "fulfilled" && typeof result.value?.title?.title === "string") published[index].title = result.value.title.title;
			});
		} catch {}
	}
	return published;
}

function registerRoutes(connectionCtx, ctx, journal, services, config) {
	const connection = connectionCtx.connection;
	if (connection?.fetch?.register === undefined) {
		journal.put("SVC-connection", "error", "the panel channel is unavailable", {
			expected: "the dsh-client-connection fetch registry",
			observed: "undefined",
			hint: "@deepseek-ai/dsh-client-connection is not mounted; the delete_thread tool still works"
		});
		return;
	}
	journal.clear("SVC-connection");
	const guard = (request) => {
		const rejection = connection.requestRejection?.(request);
		return rejection === undefined ? undefined : new Response(rejection === 401 ? "unauthorized" : "forbidden", { status: rejection });
	};
	try {
		connection.fetch.register({
			path: ROUTE_THREADS,
			methods: ["GET"],
			requestBody: "buffered",
			fetch: async (request) => {
				const denied = guard(request);
				if (denied !== undefined) return denied;
				try {
				const items = await rootThreads(ctx, services);
				const threads = items
					.filter((item) => item.origin !== "subagent" && item.cwd !== undefined)
					.map((item) => ({ sessionId: item.sessionId, title: item.projections?.values?.title ?? item.title ?? undefined, cwd: item.cwd, running: item.running === true || ctx.agents?.get?.(item.sessionId) !== undefined }));
				const snapshot = journal.snapshot();
				return Response.json({ plugin: PACKAGE, revision: snapshot.revision, threads, entries: snapshot.entries });
				} catch (error) {
					return Response.json({ plugin: PACKAGE, error: String(error?.stack ?? error) }, { status: 500 });
				}
			}
		});
		connection.fetch.register({
			path: ROUTE_DELETE,
			methods: ["POST"],
			requestBody: "buffered",
			fetch: async (request) => {
				const denied = guard(request);
				if (denied !== undefined) return denied;
				let body;
				try {
					body = await request.json();
				} catch (error) {
					return Response.json({ ok: false, error: "the request body must be JSON" }, { status: 400 });
				}
				const target = typeof body?.target === "string" ? body.target : "";
				if (target.length === 0) return Response.json({ ok: false, error: "target is required" }, { status: 400 });
				const header = services.sessions?.get?.(target)?.header;
				if (header === undefined) return Response.json({ ok: false, error: `thread "${target}" was not found` }, { status: 404 });
				if (header.origin === "subagent") return Response.json({ ok: false, error: "only root threads can be deleted" }, { status: 400 });
				if (ctx.agents?.get?.(target) !== undefined) return Response.json({ ok: false, error: `thread "${target}" is running; stop it first` }, { status: 409 });
				try {
					const result = await deleteThread(ctx, journal, services, config, { session: { header } }, target);
					return Response.json({ ok: true, deleted: result.ids, trashed: result.trashed });
				} catch (error) {
					return Response.json({ ok: false, error: String(error?.message ?? error) }, { status: 500 });
				}
			}
		});
	} catch (error) {
		journal.put("ROUTE", "error", "the panel routes could not be registered", {
			expected: `connection.fetch.register(${ROUTE_THREADS})`,
			observed: String(error),
			hint: "@deepseek-ai/dsh-client-connection assertFetchRoute: path under /api, non-empty unique methods"
		});
	}
}

export function apply(ctx, rawConfig) {
	const journal = createJournal(ctx);
	const config = resolveConfig(rawConfig);
	const services = { sessions: ctx.get("sessions"), sessionController: undefined, sessionQuery: undefined };
	journal.put("SVC-sessionController", "warn", "waiting for the session controller", {
		expected: "the session controller service is mounted",
		observed: "not mounted yet",
		hint: "the panel lists threads only when it appears"
	});
	ctx.inject(["sessionController"], (controllerCtx) => {
		services.sessionController = controllerCtx.sessionController;
		journal.clear("SVC-sessionController");
	});
	ctx.inject(["sessionQuery"], (queryCtx) => {
		services.sessionQuery = queryCtx.sessionQuery;
	});
	registerTool(ctx, journal, services, config);
	applyRoleScope(ctx, journal);
	ctx.inject(["connection"], (connectionCtx) => registerRoutes(connectionCtx, ctx, journal, services, config));
	ctx.logger?.info?.(`[${PACKAGE}] thread deletion ready: ${TOOL}`);
}
