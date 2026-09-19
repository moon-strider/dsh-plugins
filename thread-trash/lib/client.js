window.__ModuleLoader__.load({
	id: "dsh-plugin-thread-trash",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		const h = (type, props, ...children) => react.createElement(type, props, ...children);

		const SELF_ID = "dsh-plugin-thread-trash";
		const NS = "threadTrash";
		const TAB_KIND = "trash";
		const TAB_ORDER = 30;
		const THREADS_URL = "/api/plugins/thread-trash/threads";
		const DELETE_URL = "/api/plugins/thread-trash/delete";
		const DIAG_PREFIX = "[dsh-plugin-thread-trash]";

		let sharedAlerts;
		try {
			sharedAlerts = require("dsh-plugin-thread-bus")?.alerts;
		} catch (error) {
			sharedAlerts = undefined;
		}

		const css = ".dshttRoot{box-sizing:border-box;height:100%;min-height:0;color:var(--dsw-alias-label-primary);font-size:13px;flex-direction:column;flex:auto;display:flex}.dshttHeader{box-sizing:border-box;flex:none;align-items:center;gap:6px;padding:8px 8px 8px 12px;border-bottom:.5px solid var(--dsw-alias-border-l3);display:flex}.dshttHeaderTitle{font-weight:550;flex:auto;min-width:0}.dshttIcon{cursor:pointer;color:var(--dsw-alias-label-secondary);background:0 0;border:0;border-radius:10px;width:26px;height:26px;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.dshttIcon:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.dshttBody{flex:auto;min-height:0;overflow-y:auto;padding:8px}.dshttRow{border:.5px solid var(--dsw-alias-border-l3);border-radius:10px;flex-direction:column;gap:6px;margin-bottom:6px;padding:8px 10px;display:flex}.dshttRow[data-running]{border-color:var(--dsw-alias-border-l4)}.dshttRowTop{align-items:baseline;gap:6px;display:flex}.dshttTitle{min-width:0;font-weight:500;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.dshttState{color:var(--dsw-alias-label-tertiary);flex:none;font-size:11px}.dshttId{color:var(--dsw-alias-label-caption);overflow-wrap:anywhere;font-size:11px}.dshttActions{align-items:center;gap:6px;justify-content:flex-end;display:flex}.dshttButton{appearance:none;border:.5px solid var(--dsw-alias-border-l3);background:0 0;color:var(--dsw-alias-label-secondary);border-radius:8px;padding:2px 10px;font:inherit;font-size:12px;cursor:pointer}.dshttButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.dshttButton:disabled{opacity:.5;cursor:default}.dshttDanger{border-color:var(--dsw-alias-state-error-primary);color:var(--dsw-alias-state-error-primary)}.dshttDanger:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover-danger);color:var(--dsw-alias-state-error-primary)}.dshttConfirm{color:var(--dsw-alias-label-secondary);flex:auto;min-width:0;font-size:12px}.dshttNote{color:var(--dsw-alias-label-secondary);margin:4px 2px;padding:6px 2px;font-size:12px;line-height:17px}";
		const tagId = "dsh-plugin-thread-trash/ThreadTrash.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = SELF_ID;
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		const STYLE = {
			root: "dshttRoot",
			header: "dshttHeader",
			headerTitle: "dshttHeaderTitle",
			icon: "dshttIcon",
			body: "dshttBody",
			row: "dshttRow",
			rowTop: "dshttRowTop",
			title: "dshttTitle",
			state: "dshttState",
			id: "dshttId",
			actions: "dshttActions",
			button: "dshttButton",
			danger: "dshttDanger",
			confirm: "dshttConfirm",
			note: "dshttNote"
		};

		const en = {
			"type.label": "Threads",
			"guide.title": "Threads",
			"guide.description": "Stop or delete root threads of this workspace",
			"title": "Threads",
			"refresh": "Refresh",
			"empty": "No root threads in this workspace.",
			"loading": "Loading threads…",
			"failed": "The thread list could not be loaded",
			"running": "running",
			"idle": "stopped",
			"open": "open",
			"delete": "Move to Trash",
			"confirm": "Delete this thread and its subagents?",
			"confirmYes": "Yes, to Trash",
			"confirmNo": "Cancel",
			"stopFirst": "Stop it first",
			"closeFirst": "Stop it and close it first",
			"deleted": "Moved to the Trash",
			"note": "Deleting moves the thread log to the system Trash; it stays recoverable."
		};
		const ru = {
			"type.label": "Треды",
			"guide.title": "Треды",
			"guide.description": "Остановить или удалить корневые треды этого workspace",
			"title": "Треды",
			"refresh": "Обновить",
			"empty": "В этом workspace нет корневых тредов.",
			"loading": "Загружаю треды…",
			"failed": "Не удалось загрузить список тредов",
			"running": "работает",
			"idle": "остановлен",
			"open": "открыт",
			"delete": "В корзину",
			"confirm": "Удалить этот тред вместе с его субагентами?",
			"confirmYes": "Да, в корзину",
			"confirmNo": "Отмена",
			"stopFirst": "Сначала остановите",
			"closeFirst": "Сначала остановите и закройте",
			"deleted": "Перемещено в корзину",
			"note": "Удаление переносит лог треда в системную корзину; его можно восстановить."
		};
		const zh = {
			"type.label": "线程",
			"guide.title": "线程",
			"guide.description": "停止或删除此工作区的根线程",
			"title": "线程",
			"refresh": "刷新",
			"empty": "此工作区没有根线程。",
			"loading": "正在加载线程…",
			"failed": "无法加载线程列表",
			"running": "运行中",
			"idle": "已停止",
			"open": "已打开",
			"delete": "移到废纸篓",
			"confirm": "删除此线程及其子代理？",
			"confirmYes": "是，移到废纸篓",
			"confirmNo": "取消",
			"stopFirst": "请先停止",
			"closeFirst": "请先停止并关闭",
			"deleted": "已移到废纸篓",
			"note": "删除会将线程日志移到系统废纸篓，仍可恢复。"
		};

		const diagnose = (code, level, scope, message, detail) => {
			const line = `${DIAG_PREFIX} ${level.toUpperCase()} ${code} (${scope}): ${message}`
				+ (detail?.expected === undefined ? "" : ` | expected: ${detail.expected}`)
				+ (detail?.observed === undefined ? "" : ` | observed: ${detail.observed}`)
				+ (detail?.hint === undefined ? "" : ` | fix: ${detail.hint}`);
			if (typeof console !== "undefined") {
				if (level === "error") console.error(line);
				else console.warn(line);
			}
			if (sharedAlerts !== undefined) {
				sharedAlerts.push({ code, level, scope, message, expected: detail?.expected ?? "", observed: detail?.observed ?? "", hint: detail?.hint ?? "", logs: ["host terminal of the running `dsh web`", `browser console: filter ${DIAG_PREFIX}`] });
			}
		};
		const resolveDiagnostic = (code) => {
			if (sharedAlerts !== undefined) sharedAlerts.resolve(code);
		};

		const TrashGlyph = () => react_jsx_runtime.jsx("svg", {
			width: 14,
			height: 14,
			viewBox: "0 0 16 16",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: 1.4,
			strokeLinecap: "round",
			children: [
				react_jsx_runtime.jsx("path", { d: "M2.5 4h11" }),
				react_jsx_runtime.jsx("path", { d: "M6.5 4V2.5h3V4" }),
				react_jsx_runtime.jsx("path", { d: "M4 4l.7 9.2h6.6L12 4" })
			]
		});

		const definition = (t) => ({
			id: SELF_ID,
			kind: TAB_KIND,
			title: () => t("type.label"),
			guide: [{
				order: TAB_ORDER,
				title: () => t("guide.title"),
				description: () => t("guide.description"),
				icon: TrashGlyph
			}]
		});

		const ThreadTrashBody = ({ t, sessions }) => {
			const [state, setState] = react.useState({ phase: "loading", threads: [], error: undefined });
			const [confirming, setConfirming] = react.useState(undefined);
			const [busy, setBusy] = react.useState(false);
			const [revision, setRevision] = react.useState(0);

			react.useEffect(() => {
				let cancelled = false;
				const load = async () => {
					try {
						const response = await fetch(THREADS_URL, { credentials: "same-origin", headers: { accept: "application/json" } });
						if (!response.ok) throw new Error(`HTTP ${response.status}`);
						const payload = await response.json();
						if (cancelled) return;
						const threads = payload?.threads ?? [];
						setState({ phase: "ready", threads, error: undefined });
						resolveDiagnostic("PANEL-FETCH");
					} catch (error) {
						if (cancelled) return;
						setState({ phase: "ready", threads: [], error: String(error?.message ?? error) });
						diagnose("PANEL-FETCH", "error", "panel", "the thread list could not be loaded from the host half", {
							expected: `GET ${THREADS_URL} returns the thread list`,
							observed: String(error?.message ?? error),
							hint: "the host half may not be loaded in this profile; check the dsh web terminal"
						});
					}
				};
				void load();
				return () => {
					cancelled = true;
				};
			}, [revision, sessions]);

			const remove = async (target) => {
				setBusy(true);
				try {
					const response = await fetch(DELETE_URL, {
						method: "POST",
						credentials: "same-origin",
						headers: { "content-type": "application/json", accept: "application/json" },
						body: JSON.stringify({ target })
					});
					const payload = await response.json().catch(() => ({}));
					if (!response.ok || payload?.ok !== true) throw new Error(payload?.error ?? `HTTP ${response.status}`);
					resolveDiagnostic("PANEL-DELETE");
					if (sharedAlerts !== undefined) sharedAlerts.push({ code: `TRASH-${target}`, level: "info", scope: "panel", message: t("deleted"), expected: "", observed: "", hint: "", logs: [] });
				} catch (error) {
					diagnose("PANEL-DELETE", "error", "panel", "the thread could not be deleted", {
						expected: `POST ${DELETE_URL} moves the thread to the Trash`,
						observed: String(error?.message ?? error),
						hint: "stop the thread first with stop_thread; check the dsh web terminal"
					});
				} finally {
					setBusy(false);
					setConfirming(undefined);
					setRevision((value) => value + 1);
				}
			};

			return h("div", { className: STYLE.root, "data-plugin": SELF_ID },
				h("div", { className: STYLE.header },
					h("span", { className: STYLE.headerTitle }, t("title")),
					h("button", { type: "button", className: STYLE.icon, title: t("refresh"), onClick: () => setRevision((value) => value + 1) }, "⟳")
				),
				h("div", { className: STYLE.body, "data-thread-trash": "body" },
					state.phase === "loading" ? h("p", { className: STYLE.note }, t("loading")) : null,
					state.error === undefined ? null : h("p", { className: STYLE.note }, `${t("failed")}: ${state.error}`),
					state.phase === "ready" && state.threads.length === 0 ? h("p", { className: STYLE.note }, t("empty")) : null,
					...state.threads.map((thread) => h("div", { className: STYLE.row, key: thread.sessionId, "data-thread": thread.sessionId, "data-running": thread.running ? "true" : undefined },
						h("div", { className: STYLE.rowTop },
							h("span", { className: STYLE.title, title: thread.sessionId }, thread.title ?? thread.sessionId),
							h("span", { className: STYLE.state }, thread.running === true ? t("running") : thread.live === true ? t("open") : t("idle"))
						),
						h("span", { className: STYLE.id }, thread.sessionId),
						h("div", { className: STYLE.actions },
							confirming === thread.sessionId
								? [
									h("span", { className: STYLE.confirm, key: "confirm" }, t("confirm")),
									h("button", { type: "button", className: `${STYLE.button} ${STYLE.danger}`, disabled: busy, key: "yes", onClick: () => void remove(thread.sessionId) }, t("confirmYes")),
									h("button", { type: "button", className: STYLE.button, disabled: busy, key: "no", onClick: () => setConfirming(undefined) }, t("confirmNo"))
								]
								: h("button", {
									type: "button",
									className: `${STYLE.button} ${STYLE.danger}`,
									disabled: thread.live === true,
									title: thread.live === true ? t("closeFirst") : t("delete"),
									onClick: () => setConfirming(thread.sessionId)
								}, t("delete"))
						)
					)),
					h("p", { className: STYLE.note }, t("note"))
				)
			);
		};

		const ThreadTrashTitle = ({ t }) => h("span", null, t("title"));

		const inject = ["slots", "locale", "sidebarRightTabs", "sessions"];

		const apply = (ctx) => {
			if (typeof ctx.locale?.register === "function") ctx.effect(() => ctx.locale.register(NS, { en, ru, zh }), "thread-trash: dictionaries");
			if (typeof ctx.sidebarRightTabs?.register !== "function") {
				diagnose("SVC-sidebarRightTabs", "error", "sidebarRightTabs", "the right sidebar tab registry is missing", {
					expected: "ctx.sidebarRightTabs.register from dsh-client-ui-sidebar-right",
					observed: "undefined"
				});
				return;
			}
			resolveDiagnostic("SVC-sidebarRightTabs");
			if (typeof ctx.slots?.inject !== "function") {
				diagnose("SVC-slots", "error", "slots", "the slot registry is missing", {
					expected: "ctx.slots.inject/register from dsh-client-ui-renderer",
					observed: "undefined"
				});
				return;
			}
			resolveDiagnostic("SVC-slots");
			const t = ctx.locale.bind(NS);
			ctx.effect(() => ctx.sidebarRightTabs.register(definition(t)), "thread-trash: tab type");
			try {
				ctx.slots.inject("sidebar.right.pane.tab", () => ctx.slots.register({
					name: "sidebar.right.pane.tab",
					key: SELF_ID,
					locale: NS,
					inject: () => ({ sessions: ctx.sessions })
				}, ThreadTrashBody));
				ctx.slots.inject("sidebar.right.pane.tab.title", () => ctx.slots.register({
					name: "sidebar.right.pane.tab.title",
					key: SELF_ID,
					locale: NS
				}, ThreadTrashTitle));
				resolveDiagnostic("UI-SLOT-tab");
			} catch (error) {
				diagnose("UI-SLOT-tab", "error", "ui", "the panel could not register into the right sidebar", {
					expected: "sidebar.right.pane.tab and sidebar.right.pane.tab.title seats",
					observed: String(error),
					hint: "@deepseek-ai/dsh-client-ui-sidebar-right pane slots"
				});
			}
		};

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
