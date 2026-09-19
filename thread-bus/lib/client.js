window.__ModuleLoader__.load({
	id: "dsh-plugin-thread-bus",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		let react = require("react");
		const h = react.createElement;

		const SELF_ID = "dsh-plugin-thread-bus";
		const NS = "threadBus";
		const HOST_DIAG_PATH = "/api/plugins/thread-bus/diagnostics";
		const AUDIT_PREFIX = "[thread-bus audit]";
		const FRAME_PREFIX = "[thread-bus]";
		const RPC_PREFIX = "thread-bus:";
		const KIND_IN = "thread-bus-in";
		const KIND_OUT = "thread-bus-out";
		const STOCK_KIND = "input-message";
		const DIAG_PREFIX = "[dsh-plugin-thread-bus]";
		const POLL_MS = 4000;

		const css = "[data-chat-flow-kind=thread-bus-in],[data-chat-flow-kind=thread-bus-out]{content-visibility:visible!important;margin-top:16px}.dshtbIncoming{margin:8px 0 8px auto;max-width:85%;padding:12px 16px;border-radius:16px;background:var(--dsw-specific-bubble,var(--dsw-alias-bg-module-platform));color:var(--dsw-alias-label-primary)}.dshtbMessage{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.6}.dshtbIncoming .dshtbPill{margin-bottom:8px}.dshtbPill{display:block;width:fit-content;margin:0 0 4px auto;padding:1px 8px;border-radius:8px;font-size:11px;line-height:18px;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary);border:.5px solid var(--dsw-alias-border-l3)}.dshtbIncoming{display:flex;flex-direction:column;align-items:flex-end;gap:4px;margin:6px 0}.dshtbMessage{max-width:100%;white-space:pre-wrap;overflow-wrap:anywhere;background:var(--dsw-specific-bubble);color:var(--dsw-alias-label-primary);border-radius:22px;padding:10px 16px;font-size:var(--dsh-content-font-size,14px);line-height:calc(22px + var(--dsh-content-font-delta,0px))}.dshtbCard{box-sizing:border-box;display:flex;flex-direction:column;gap:3px;margin:6px 0;padding:8px 10px;border:.5px solid var(--dsw-alias-border-l3);border-radius:10px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);font-size:12px;line-height:17px}.dshtbCardHead{display:flex;align-items:center;gap:6px;color:var(--dsw-alias-label-primary);font-weight:550}.dshtbCardRow{display:flex;gap:6px;min-width:0}.dshtbCardKey{flex:none;min-width:64px;color:var(--dsw-alias-label-caption)}.dshtbCardValue{min-width:0;overflow-wrap:anywhere;color:var(--dsw-alias-label-tertiary)}.dshtbProgress{position:absolute;top:0;left:0;height:2px;width:100%;animation:dshtbDrain var(--dshtb-life,10s) linear forwards}.dshtbToast[data-level=error] .dshtbProgress{background:var(--dsw-alias-state-error-primary)}.dshtbToast[data-level=warn] .dshtbProgress{background:var(--dsw-alias-state-warning-primary,#c8a04a)}@keyframes dshtbDrain{from{width:100%}to{width:0%}}.dshtbToasts{position:fixed;right:16px;bottom:16px;display:flex;flex-direction:column;gap:8px;max-width:min(420px,calc(100vw - 32px));z-index:30;pointer-events:auto}.dshtbToast{box-sizing:border-box;display:flex;flex-direction:column;gap:6px;position:relative;overflow:hidden;padding:10px 12px;border-radius:12px;border:.5px solid var(--dsw-alias-border-l3);background:var(--dsw-alias-bg-base,#fff);box-shadow:var(--dsw-elevation-panel);color:var(--dsw-alias-label-primary);font-size:12px;line-height:17px}.dshtbToast[data-level=warn]{border-color:var(--dsw-alias-state-warning-primary,#c8a04a)}.dshtbToast[data-level=error]{border-color:var(--dsw-alias-state-error-primary);background-image:linear-gradient(var(--dsw-alias-interactive-bg-hover-danger),var(--dsw-alias-interactive-bg-hover-danger))}.dshtbToastHead{display:flex;align-items:baseline;gap:6px}.dshtbToastLevel{flex:none;font-weight:600;text-transform:uppercase;font-size:10px;letter-spacing:.04em}.dshtbToast[data-level=error] .dshtbToastLevel{color:var(--dsw-alias-state-error-primary)}.dshtbToast[data-level=warn] .dshtbToastLevel{color:var(--dsw-alias-state-warning-primary,#c8a04a)}.dshtbToast[data-level=info] .dshtbToastLevel{color:var(--dsw-alias-label-tertiary)}.dshtbToastClose{flex:none;display:grid;place-items:center;width:28px;height:28px;padding:0;border:0;border-radius:6px;background:transparent;color:inherit;font-size:22px;line-height:1;cursor:pointer}.dshtbToastClose:hover{background:var(--dsw-alias-interactive-bg-hover)}.dshtbToastClose:focus-visible{outline:2px solid currentColor;outline-offset:2px}.dshtbToastCode{min-width:0;overflow-wrap:anywhere;color:var(--dsw-alias-label-caption);font-size:11px}.dshtbToastBody{overflow-wrap:anywhere}.dshtbToastMeta{display:flex;flex-direction:column;gap:2px;color:var(--dsw-alias-label-tertiary);font-size:11px}.dshtbToastActions{display:flex;gap:6px;justify-content:flex-end}.dshtbToastButton{appearance:none;border:.5px solid var(--dsw-alias-border-l3);background:0 0;color:var(--dsw-alias-label-secondary);border-radius:8px;padding:2px 8px;font:inherit;font-size:11px;cursor:pointer}.dshtbToastButton:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.dshtbToastLogs{display:flex;flex-direction:column;gap:2px;margin:0;padding-left:14px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px}";
		const tagId = "dsh-plugin-thread-bus/Alerts.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = SELF_ID;
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		const STYLE = {
			pill: "dshtbPill",
			card: "dshtbCard",
			cardHead: "dshtbCardHead",
			cardRow: "dshtbCardRow",
			cardKey: "dshtbCardKey",
			cardValue: "dshtbCardValue",
			toasts: "dshtbToasts",
			toast: "dshtbToast",
			toastHead: "dshtbToastHead",
			toastLevel: "dshtbToastLevel",
			toastCode: "dshtbToastCode",
			toastBody: "dshtbToastBody",
			toastMeta: "dshtbToastMeta",
			toastActions: "dshtbToastActions",
			toastButton: "dshtbToastButton",
			toastLogs: "dshtbToastLogs",
			progress: "dshtbProgress"
		};

		const zh = {
			"toast.details": "详情",
			"toast.hide": "收起",
			"toast.dismiss": "关闭",
			"toast.copy": "复制报告",
			"toast.recheck": "重新检查",
			"toast.expected": "期望",
			"toast.observed": "实际",
			"toast.fix": "修复",
			"toast.logs": "日志",
			"toast.copied": "已复制",
			"card.title": "已发送",
			"card.target": "目标",
			"card.kind": "类型",
			"card.mode": "投递",
			"card.status": "状态",
			"card.at": "时间"
		};
		const ru = {
			"toast.details": "Детали",
			"toast.hide": "Свернуть",
			"toast.dismiss": "Закрыть",
			"toast.copy": "Копировать отчёт",
			"toast.recheck": "Проверить снова",
			"toast.expected": "Ожидалось",
			"toast.observed": "Наблюдалось",
			"toast.fix": "Что править",
			"toast.logs": "Логи",
			"toast.copied": "Скопировано",
			"card.title": "Отправлено",
			"card.target": "Куда",
			"card.kind": "Тип",
			"card.mode": "Доставка",
			"card.status": "Статус",
			"card.at": "Время"
		};
		const en = {
			"toast.details": "Details",
			"toast.hide": "Hide",
			"toast.dismiss": "Dismiss",
			"toast.copy": "Copy report",
			"toast.recheck": "Check again",
			"toast.expected": "Expected",
			"toast.observed": "Observed",
			"toast.fix": "Fix",
			"toast.logs": "Logs",
			"toast.copied": "Copied",
			"card.title": "Sent",
			"card.target": "Target",
			"card.kind": "Kind",
			"card.mode": "Delivery",
			"card.status": "Status",
			"card.at": "Time"
		};

		const labels = {
			thread: "From another thread",
			instruction: "Instruction",
			report: "Status report",
			question: "Question"
		};
		const outgoing = {
			thread: "To another thread",
			instruction: "Instruction to subagent",
			report: "Status report to parent",
			question: "Question to parent"
		};

		const alerts = (() => {
			const entries = new Map();
			const dismissed = new Map();
			const fingerprint = (entry) => JSON.stringify([entry.level, entry.message, entry.expected, entry.observed, entry.hint]);
			const listeners = new Set();
			let snapshot = [];
			let queued = false;
			const publish = () => {
				snapshot = [...entries.values()].filter((entry) => dismissed.get(entry.code) !== fingerprint(entry)).sort((left, right) => {
					const rank = { error: 0, warn: 1, info: 2 };
					return (rank[left.level] ?? 3) - (rank[right.level] ?? 3) || right.at - left.at;
				});
				if (queued) return;
				queued = true;
				const flush = () => {
					queued = false;
					for (const listener of [...listeners]) {
						try {
							listener();
						} catch (error) {}
					}
				};
				if (typeof queueMicrotask === "function") queueMicrotask(flush);
				else setTimeout(flush, 0);
			};
			const log = (entry) => {
				const line = `${DIAG_PREFIX} ${String(entry.level).toUpperCase()} ${entry.code} (${entry.scope}): ${entry.message}`
					+ (entry.expected === "" ? "" : ` | expected: ${entry.expected}`)
					+ (entry.observed === "" ? "" : ` | observed: ${entry.observed}`)
					+ (entry.hint === "" ? "" : ` | fix: ${entry.hint}`)
					+ (entry.logs.length === 0 ? "" : ` | logs: ${entry.logs.join(" ; ")}`);
				if (typeof console === "undefined") return;
				if (entry.level === "error") console.error(line);
				else console.warn(line);
			};
			return {
				push(entry) {
					const previous = entries.get(entry.code);
					const next = {
						code: entry.code,
						level: entry.level,
						scope: entry.scope,
						message: entry.message,
						expected: entry.expected ?? "",
						observed: entry.observed ?? "",
						hint: entry.hint ?? "",
						logs: entry.logs ?? [],
						origin: entry.origin ?? "client",
						count: (previous?.count ?? 0) + 1,
						at: Date.now()
					};
					entries.set(next.code, next);
					if (previous === undefined || previous.level !== next.level) log(next);
					publish();
					return next;
				},
				dismiss(code) {
					const entry = entries.get(code);
					if (entry !== undefined) dismissed.set(code, fingerprint(entry));
					publish();
				},
				resolve(code) {
					dismissed.delete(code);
					if (entries.delete(code)) publish();
				},
				replaceOrigin(origin, list) {
					let changed = false;
					for (const [code, entry] of [...entries]) {
						if (entry.origin === origin) {
							if (!(list ?? []).some((next) => next.code === code)) dismissed.delete(code);
							entries.delete(code);
							changed = true;
						}
					}
					for (const entry of list ?? []) {
						entries.set(entry.code, {
							code: entry.code,
							level: entry.level,
							scope: entry.scope,
							message: entry.message,
							expected: entry.expected ?? "",
							observed: entry.observed ?? "",
							hint: entry.hint ?? "",
							logs: entry.logs ?? [],
							origin,
							count: entry.count ?? 1,
							at: entry.at ?? Date.now()
						});
						changed = true;
					}
					if (changed) publish();
				},
				snapshot() {
					return snapshot;
				},
				subscribe(listener) {
					listeners.add(listener);
					return () => listeners.delete(listener);
				},
				report() {
					return snapshot.map((entry) => [
						`${String(entry.level).toUpperCase()} ${entry.code} (${entry.scope})`,
						`  message: ${entry.message}`,
						entry.expected === "" ? undefined : `  expected: ${entry.expected}`,
						entry.observed === "" ? undefined : `  observed: ${entry.observed}`,
						entry.hint === "" ? undefined : `  fix: ${entry.hint}`,
						entry.logs.length === 0 ? undefined : `  logs: ${entry.logs.join(" ; ")}`
					].filter(Boolean).join("\n")).join("\n");
				}
			};
		})();

		const diagnose = (code, level, scope, message, detail) => alerts.push({ code, level, scope, message, expected: detail?.expected, observed: detail?.observed, hint: detail?.hint, logs: detail?.logs });
		const resolveDiagnostic = (code) => alerts.resolve(code);
		const checkContract = (code, level, scope, value, message, detail) => {
			if (typeof value === "function") {
				resolveDiagnostic(code);
				return true;
			}
			diagnose(code, level, scope, message, detail);
			return false;
		};

		const useAlerts = () => {
			const [, bump] = react.useState(0);
			react.useEffect(() => alerts.subscribe(() => bump((value) => value + 1)), []);
			return alerts.snapshot();
		};

		const conversationKey = (kind, id) => `${kind.length}:${kind}${id}`;

		const parseFrame = (text) => {
			if (typeof text !== "string" || !text.startsWith(FRAME_PREFIX)) return undefined;
			const kind = /kind=([a-z]+)/.exec(text)?.[1];
			const from = /from=([^\s]+)/.exec(text)?.[1];
			if (kind === undefined || from === undefined) return undefined;
			return { kind, fromSessionId: from };
		};

		const parseRpcId = (rpcId) => {
			if (typeof rpcId !== "string" || !rpcId.startsWith(RPC_PREFIX)) return undefined;
			const parts = rpcId.split(":");
			if (parts.length < 4) return undefined;
			return { kind: parts[1], fromSessionId: parts[2] };
		};

		const parseAudit = (text) => {
			if (typeof text !== "string" || !text.startsWith(AUDIT_PREFIX)) return undefined;
			const fields = {};
			for (const token of text.slice(AUDIT_PREFIX.length).trim().split(/\s+/)) {
				const at = token.indexOf("=");
				if (at > 0) fields[token.slice(0, at)] = token.slice(at + 1);
			}
			if (fields.kind === undefined || fields.to === undefined) return undefined;
			return { kind: fields.kind, toSessionId: fields.to, mode: fields.mode ?? "queue", status: fields.status ?? "delivered", at: fields.at ?? "" };
		};

		const MAP_LIMIT = 300;
		const remember = (map, key, value) => {
			map.set(key, value);
			while (map.size > MAP_LIMIT) map.delete(map.keys().next().value);
		};
		const inbound = new Map();
		const outbound = new Map();
		let renderHost;

		const titleOf = (sessionId) => {
			const list = renderHost?.sessions?.list?.getSnapshot?.();
			const found = list?.byId?.[sessionId] ?? list?.items?.find((item) => item.sessionId === sessionId);
			return found?.title ?? found?.displayTitle ?? undefined;
		};

		const useThreadTitle = (sessionId) => react.useSyncExternalStore(
			(listener) => renderHost.sessions.list.subscribe(listener),
			() => titleOf(sessionId) ?? sessionId
		);

		const IncomingCard = ({ node }) => {
			const { parsed, content } = node.data;
			useRenderedRow(node.data.id);
			const title = useThreadTitle(parsed.fromSessionId);
			const blocks = content.filter((block, index) => !(index === 0 && block.type === "text" && parseFrame(block.text) !== undefined));
			return h("div", { className: "dshtbIncoming", "data-thread-bus": "in", "data-kind": parsed.kind },
				h("div", { className: STYLE.pill, title: parsed.fromSessionId }, `${labels[parsed.kind] ?? parsed.kind} — ${title}`),
				...blocks.map((block, index) => h("div", { className: "dshtbMessage", key: index, style: { background: tintOf(parsed.kind) } }, block.type === "text" ? block.text : JSON.stringify(block)))
			);
		};

		const cssString = (value) => JSON.stringify(value);
		const dynamicTagId = "dsh-plugin-thread-bus/Dynamic.module.css";
		let dynamicTag;
		const dynamicStyle = () => {
			if (typeof document === "undefined") return undefined;
			if (dynamicTag === undefined) {
				dynamicTag = document.querySelector("style[data-plugin-css=" + JSON.stringify(dynamicTagId) + "]");
				if (dynamicTag === null) {
					dynamicTag = document.createElement("style");
					dynamicTag.dataset.plugin = SELF_ID;
					dynamicTag.dataset.pluginCss = dynamicTagId;
					document.head.appendChild(dynamicTag);
				}
			}
			return dynamicTag;
		};

		const tintOf = (kind) => kind === "instruction"
			? "color-mix(in oklab, var(--dsw-specific-bubble) 86%, var(--dsw-alias-state-business-primary))"
			: kind === "report"
				? "color-mix(in oklab, var(--dsw-specific-bubble) 90%, var(--dsw-alias-label-tertiary))"
				: kind === "question"
					? "color-mix(in oklab, var(--dsw-specific-bubble) 86%, var(--dsw-alias-state-warning-primary,#c8a04a))"
					: "color-mix(in oklab, var(--dsw-specific-bubble) 86%, var(--dsw-alias-state-business-primary))";

		const hiddenRows = new Set();
		const refreshDynamicStyle = () => {
			const tag = dynamicStyle();
			if (tag === undefined) return;
			const rules = [];
			for (const messageId of hiddenRows) rules.push(`[data-chat-flow-key=${cssString(conversationKey(STOCK_KIND, messageId))}]{display:none!important}`);
			tag.textContent = rules.join("\n");
		};
		const markRowRendered = (messageId) => {
			if (hiddenRows.has(messageId)) return;
			hiddenRows.add(messageId);
			refreshDynamicStyle();
		};
		const unmarkRowRendered = (messageId) => {
			if (hiddenRows.delete(messageId)) refreshDynamicStyle();
		};
		const useRenderedRow = (messageId) => {
			react.useEffect(() => {
				markRowRendered(messageId);
				return () => unmarkRowRendered(messageId);
			}, [messageId]);
		};

		const noteInbound = (messageId, parsed) => {
			if (inbound.has(messageId)) return;
			remember(inbound, messageId, parsed);
			refreshDynamicStyle();
			diagnoseCheckClassification(messageId);
		};

		const diagnoseCheckClassification = (messageId) => {
			if (typeof document === "undefined") return;
			const row = document.querySelector(`[data-chat-flow-key=${cssString(conversationKey(STOCK_KIND, messageId))}]`);
			if (row === null) return;
			const kind = row.getAttribute("data-chat-flow-kind");
			const code = `UI-CLASSIFY-${messageId}`;
			if (kind === "user" || kind === "steering") resolveDiagnostic(code);
			else diagnose(code, "warn", "ui", "the stock chat no longer renders this message as a user message", {
				expected: "data-chat-flow-kind = user or steering",
				observed: `data-chat-flow-kind = ${String(kind)}`,
				hint: "@deepseek-ai/dsh-client-ui-chat messageDefinition (input-message)"
			});
		};

		const outboundDescription = (audit) => {
			const title = titleOf(audit.toSessionId);
			return title === undefined ? audit.toSessionId : `${title} (${audit.toSessionId})`;
		};

		const AuditCard = ({ node, t }) => {
			useRenderedRow(node.data.id);
			const data = node.data;
			const audit = data.audit;
			const title = useThreadTitle(audit.toSessionId);
			const rows = [
				["card.target", title],
				["card.kind", outgoing[audit.kind] ?? audit.kind],
				["card.mode", audit.mode],
				["card.status", audit.status],
				...(audit.at === "" ? [] : [["card.at", audit.at]])
			];
			return h("div", { className: STYLE.card, "data-thread-bus": "out" },
				h("div", { className: STYLE.cardHead }, h("span", null, t("card.title")), h("span", { className: STYLE.cardValue }, outgoing[audit.kind] ?? audit.kind)),
				...rows.map(([key, value]) => h("div", { className: STYLE.cardRow, key }, h("span", { className: STYLE.cardKey }, t(key)), h("span", { className: STYLE.cardValue, title: String(value) }, String(value))))
			);
		};

		const TOAST_LIFE_MS = 10000;

		const Toast = ({ entry, t }) => {
			const [open, setOpen] = react.useState(entry.level === "error");
			const [copied, setCopied] = react.useState(false);
			react.useEffect(() => {
				const timer = setTimeout(() => alerts.resolve(entry.code), TOAST_LIFE_MS);
				return () => clearTimeout(timer);
			}, [entry.code]);
			return h("div", {
				className: STYLE.toast,
				"data-level": entry.level,
				"data-thread-bus-code": entry.code,
				role: entry.level === "error" ? "alert" : "status",
				"aria-live": entry.level === "error" ? "assertive" : "polite"
			},
				h("div", { className: STYLE.progress, key: entry.code, "data-progress": "drain" }),
				h("div", { className: STYLE.toastHead },
					h("span", { className: STYLE.toastLevel }, entry.level),
					h("span", { className: STYLE.toastCode }, entry.code),
					h("span", { style: { marginLeft: "auto" } }, entry.origin === "host" ? "host" : "ui"),
					h("button", { type: "button", className: "dshtbToastClose", "aria-label": t("toast.dismiss"), title: t("toast.dismiss"), onClick: () => alerts.dismiss(entry.code) }, "×")
				),
				h("div", { className: STYLE.toastBody }, entry.count > 1 ? `${entry.message} (×${String(entry.count)})` : entry.message),
				open && h("div", { className: STYLE.toastMeta },
					entry.expected === "" ? null : h("div", null, `${t("toast.expected")}: ${entry.expected}`),
					entry.observed === "" ? null : h("div", null, `${t("toast.observed")}: ${entry.observed}`),
					entry.hint === "" ? null : h("div", null, `${t("toast.fix")}: ${entry.hint}`),
					entry.logs.length === 0 ? null : h("ul", { className: STYLE.toastLogs }, ...entry.logs.map((line) => h("li", { key: line }, line)))
				),
				h("div", { className: STYLE.toastActions },
					h("button", { type: "button", className: STYLE.toastButton, onClick: () => setOpen((value) => !value) }, t(open ? "toast.hide" : "toast.details")),
					h("button", {
						type: "button",
						className: STYLE.toastButton,
						onClick: () => {
							try {
								Promise.resolve(navigator.clipboard?.writeText(alerts.report())).then(() => {
									setCopied(true);
									setTimeout(() => setCopied(false), 1500);
								}, () => {});
							} catch (error) {}
						}
					}, t(copied ? "toast.copied" : "toast.copy"))
				)
			);
		};

		const ToastStack = ({ t }) => {
			const list = useAlerts().filter((entry) => entry.level === "error" || entry.level === "warn");
			if (list.length === 0) return null;
			return h("div", { className: STYLE.toasts, "data-thread-bus": "toasts" }, ...list.slice(0, 4).map((entry) => h(Toast, { key: entry.code, entry, t })));
		};

		const inject = ["sessions", "slots", "locale", "uiConversation"];

		const apply = (ctx) => {
			renderHost = { sessions: ctx.sessions };
			const localeOk = checkContract("SVC-locale", "error", "locale", ctx.locale?.register, "the locale service is missing", {
				expected: "ctx.locale.register/bind from dsh-client-locale",
				observed: "undefined"
			});
			const slotsOk = checkContract("SVC-slots", "error", "slots", ctx.slots?.register, "the slot registry is missing", {
				expected: "ctx.slots.register/inject from dsh-client-ui-renderer",
				observed: "undefined"
			});
			if (localeOk) ctx.effect(() => ctx.locale.register(NS, { en, ru, zh }), "thread-bus: dictionaries");

			const stack = () => {
				try {
					const dispose = ctx.slots.register({ name: "shell.overlay", id: "thread-bus-alerts", order: 100, locale: NS }, ToastStack);
					resolveDiagnostic("UI-SLOT-shell");
					return dispose;
				} catch (error) {
					diagnose("UI-SLOT-shell", "error", "ui", "the alert stack could not register into the frame overlay", {
						expected: "ctx.slots.register({name:'shell.overlay', id:'thread-bus-alerts'})",
						observed: String(error),
						hint: "@deepseek-ai/dsh-client-ui-layout shell.overlay list slot"
					});
					return undefined;
				}
			};
			if (slotsOk) ctx.slots.inject("shell.overlay", stack);

			const conversation = ctx.uiConversation;
			if (!checkContract("SVC-uiConversation", "error", "uiConversation", conversation?.events?.register, "the conversation registry is missing, message labels are unavailable", {
				expected: "ctx.uiConversation.events.register from dsh-client-ui-conversation",
				observed: "undefined"
			})) return;

			const observer = {
				kind: KIND_IN,
				target: "chat",
				match: (event) => {
					if (event?.type !== "user/message") return null;
					const parsed = parseRpcId(event.data?.source?.rpcId);
					return parsed === undefined ? null : { id: String(event.data.id), role: "start" };
				},
				start: (context, match) => {
					const event = match.event;
					const parsed = parseRpcId(event.data.source.rpcId);
					const state = { id: String(event.data.id), seq: event.seq, parsed, content: event.data.content };
					if (parsed !== undefined) noteInbound(state.id, parsed);
					return state;
				},
				update: (context) => context.state,
				buildViewNode: (context) => context.state === undefined ? null : ({
					key: context.key, kind: KIND_IN, id: context.id, target: "chat", anchorSeq: context.state.seq,
					location: context.start?.location ?? context.matches?.[0]?.location ?? { kind: "unresolved" },
					visibility: "visible", data: context.state
				})
			};

			const auditDefinition = {
				kind: KIND_OUT,
				target: "chat",
				match: (event) => {
					if (event?.type !== "user/message") return null;
					const source = event.data?.source;
					if (source?.kind !== "plugin" || source?.plugin !== "thread-bus") return null;
					const first = event.data?.content?.[0];
					return typeof first?.text === "string" && first.text.startsWith(AUDIT_PREFIX) ? { id: String(event.data.id), role: "start" } : null;
				},
				start: (context, match) => {
					const event = match.event;
					const audit = parseAudit(event.data.content[0].text);
					const state = { id: String(event.data.id), seq: event.seq, time: event.time, audit };
					if (audit !== undefined) {
						remember(outbound, state.id, audit);
						refreshDynamicStyle();
					}
					return state;
				},
				update: (context) => context.state,
				buildViewNode: (context) => {
					const state = context.state;
					if (state === undefined || state.audit === undefined) return null;
					return {
						key: context.key,
						kind: KIND_OUT,
						id: state.id,
						target: "chat",
						anchorSeq: state.seq,
						location: context.start?.location ?? context.matches?.[0]?.location ?? { kind: "unresolved" },
						visibility: "visible",
						data: state
					};
				}
			};

			for (const [code, definition] of [["UI-EVENTS-observer", observer], ["UI-EVENTS-card", auditDefinition]]) {
				try {
					ctx.uiConversation.events.register(definition);
					resolveDiagnostic(code);
				} catch (error) {
					diagnose(code, "error", "ui", `the ${definition.kind} definition was rejected`, {
						expected: "a unique conversation definition kind",
						observed: String(error),
						hint: "@deepseek-ai/dsh-client-ui-conversation ConversationEventRegistry.register"
					});
				}
			}

			if (slotsOk) {
				try {
					ctx.slots.inject("conversation.chat.node", () => {
						const disposers = [
							ctx.slots.register({ name: "conversation.chat.node", key: KIND_OUT, locale: NS }, AuditCard),
							ctx.slots.register({ name: "conversation.chat.node", key: KIND_IN, locale: NS }, IncomingCard)
						];
						const dispose = () => disposers.forEach((release) => release());
						resolveDiagnostic("UI-SLOT-node");
						return dispose;
					});
				} catch (error) {
					diagnose("UI-SLOT-node", "error", "ui", "the audit card renderer could not register", {
						expected: "ctx.slots.register({name:'conversation.chat.node', key:'thread-bus-out'})",
						observed: String(error),
						hint: "@deepseek-ai/dsh-client-ui-chat keyed chat node seat"
					});
				}
			}

			let hostFailing = false;
			const poll = async () => {
				if (typeof fetch !== "function") return;
				try {
					const response = await fetch(HOST_DIAG_PATH, { credentials: "same-origin", headers: { accept: "application/json" } });
					if (!response.ok) throw new Error(`HTTP ${response.status}`);
					const payload = await response.json();
					alerts.replaceOrigin("host", (payload?.entries ?? []).map((entry) => ({ ...entry, origin: "host" })));
					resolveDiagnostic("HOST-UNREACHABLE");
					if (hostFailing) hostFailing = false;
				} catch (error) {
					if (hostFailing) return;
					hostFailing = true;
					diagnose("HOST-UNREACHABLE", "error", "host", "the host half of the plugin is not answering", {
						expected: `GET ${HOST_DIAG_PATH} returns the diagnostics payload`,
						observed: String(error),
						hint: "the host half may not be loaded in this profile; check the dsh web terminal for [dsh-plugin-thread-bus]",
						logs: ["host terminal of the running `dsh web`", "browser console: filter [dsh-plugin-thread-bus]"]
					});
				}
			};

			const uiProbe = () => {
				if (typeof document === "undefined") return;
				const rows = document.querySelectorAll("[data-chat-flow-key]");
				const code = "UI-DOM";
				if (rows.length === 0) return;
				if (rows[0].getAttribute("data-chat-flow-kind") === undefined) {
					diagnose(code, "warn", "ui", "chat rows lost the stable data attributes", {
						expected: "data-chat-flow-key and data-chat-flow-kind on every chat row",
						observed: "data-chat-flow-kind missing",
						hint: "@deepseek-ai/dsh-client-ui-chat ChatView flow item wrapper"
					});
					return;
				}
				resolveDiagnostic(code);
				for (const messageId of inbound.keys()) diagnoseCheckClassification(messageId);
			};

			const timer = setInterval(() => {
				void poll();
				uiProbe();
				refreshDynamicStyle();
			}, POLL_MS);
			void poll();
			ctx.effect(() => () => clearInterval(timer), "thread-bus: diagnostics poll");
		};

		exports.apply = apply;
		exports.inject = inject;
		exports.alerts = alerts;
		return module.exports;
	}
});
