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
		const ARCHIVE_URL = "/api/plugins/thread-trash/archive";
		const DIAG_PREFIX = "[dsh-plugin-thread-trash]";

		let sharedAlerts;
		try {
			sharedAlerts = require("dsh-plugin-thread-bus")?.alerts;
		} catch (error) {
			sharedAlerts = undefined;
		}

		const css = ".dshttRoot{box-sizing:border-box;height:100%;min-height:0;color:var(--dsw-alias-label-primary);font-size:13px;flex-direction:column;flex:auto;display:flex}.dshttHeader{box-sizing:border-box;flex:none;align-items:center;gap:6px;padding:8px 8px 8px 12px;border-bottom:.5px solid var(--dsw-alias-border-l3);display:flex}.dshttHeaderTitle{font-weight:550;flex:auto;min-width:0}.dshttIcon{cursor:pointer;color:var(--dsw-alias-label-secondary);background:0 0;border:0;border-radius:10px;width:26px;height:26px;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.dshttIcon:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.dshttBody{flex:auto;min-height:0;overflow-y:auto;padding:8px}.dshttRow{border:.5px solid var(--dsw-alias-border-l3);border-radius:10px;align-items:stretch;min-height:58px;margin-bottom:6px;display:flex;overflow:hidden}.dshttRow[data-running]{border-color:var(--dsw-alias-border-l4)}.dshttRow[data-archived]{opacity:.72}.dshttMain{flex-direction:column;gap:4px;flex:auto;min-width:0;justify-content:center;padding:9px 10px;display:flex}.dshttRowTop{align-items:baseline;gap:6px;display:flex}.dshttTitle{min-width:0;font-weight:500;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.dshttState{color:var(--dsw-alias-label-tertiary);flex:none;font-size:11px}.dshttId{color:var(--dsw-alias-label-caption);overflow-wrap:anywhere;font-size:11px}.dshttActions{flex:none;align-items:stretch;display:flex}.dshttAction{color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:0;border-left:.5px solid var(--dsw-alias-border-l3);width:56px;flex-direction:column;justify-content:center;align-items:center;gap:4px;padding:6px 2px;font:inherit;display:flex}.dshttAction:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}.dshttAction:disabled{opacity:.45;cursor:default}.dshttIconGreen{color:var(--dsw-alias-state-success-primary,#3fa66a)}.dshttIconYellow{color:var(--dsw-alias-state-warning-primary,#c8a04a)}.dshttIconRed{color:var(--dsw-alias-state-error-primary)}.dshttActionLabel{color:inherit;font-size:10px;line-height:12px}.dshttAction svg{width:22px;height:22px;flex:none}.dshttConfirmPanel{border-left:.5px solid var(--dsw-alias-border-l3);flex-direction:column;justify-content:center;gap:6px;max-width:190px;padding:8px 10px;display:flex}.dshttConfirm{color:var(--dsw-alias-label-secondary);flex:auto;min-width:0;font-size:12px}.dshttNote{color:var(--dsw-alias-label-secondary);margin:4px 2px;padding:6px 2px;font-size:12px;line-height:17px}";
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
			main: "dshttMain",
			rowTop: "dshttRowTop",
			title: "dshttTitle",
			state: "dshttState",
			id: "dshttId",
			actions: "dshttActions",
			button: "dshttButton",
			danger: "dshttDanger",
			confirm: "dshttConfirm",
			action: "dshttAction",
			iconGreen: "dshttIconGreen",
			iconYellow: "dshttIconYellow",
			iconRed: "dshttIconRed",
			actionLabel: "dshttActionLabel",
			confirmPanel: "dshttConfirmPanel",
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

		const ArchiveGlyph = () => react_jsx_runtime.jsxs("svg", {
			width: 13,
			height: 13,
			viewBox: "0 0 16 16",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: 1.4,
			strokeLinecap: "round",
			children: [
				react_jsx_runtime.jsx("path", { d: "M2 3.5h12v3H2z" }),
				react_jsx_runtime.jsx("path", { d: "M3 6.5v6h10v-6" }),
				react_jsx_runtime.jsx("path", { d: "M6.5 9.5h3" })
			]
		});

		const UnarchiveGlyph = () => react_jsx_runtime.jsxs("svg", {
			width: 13,
			height: 13,
			viewBox: "0 0 16 16",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: 1.4,
			strokeLinecap: "round",
			children: [
				react_jsx_runtime.jsx("path", { d: "M2.8 6.1 12.6 4" }),
				react_jsx_runtime.jsx("path", { d: "M3.4 7.3v5.5h9.2V7.3" }),
				react_jsx_runtime.jsx("path", { d: "M6.8 10h2.4" })
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
						const cwd = currentCwd();
						const threads = (payload?.threads ?? []).filter((thread) => thread.blank !== true && (cwd === undefined || thread.cwd === undefined || thread.cwd === cwd));
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

			const currentCwd = () => {
				try {
					const snapshot = sessions?.list?.getSnapshot?.();
					const current = snapshot?.current;
					const found = snapshot?.byId?.[current] ?? snapshot?.items?.find((item) => item.sessionId === current);
					return found?.cwd;
				} catch (error) {
					return undefined;
				}
			};

			const toggleArchive = async (thread) => {
				setBusy(true);
				try {
					const response = await fetch(ARCHIVE_URL, {
						method: "POST",
						credentials: "same-origin",
						headers: { "content-type": "application/json", accept: "application/json" },
						body: JSON.stringify({ target: thread.sessionId, archived: thread.archived !== true })
					});
					const payload = await response.json().catch(() => ({}));
					if (!response.ok || payload?.ok !== true) throw new Error(payload?.error ?? `HTTP ${response.status}`);
					resolveDiagnostic("PANEL-ARCHIVE");
				} catch (error) {
					diagnose("PANEL-ARCHIVE", "error", "panel", "the archive state could not be changed", {
						expected: `POST ${ARCHIVE_URL} toggles the archived flag`,
						observed: String(error?.message ?? error),
						hint: "the workspace registry must be mounted, or workspace.json must be writable"
					});
				} finally {
					setBusy(false);
					setRevision((value) => value + 1);
				}
			};

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
					try {
						sessions?.drop?.(target);
					} catch (error) {}
					try {
						await sessions?.refresh?.();
					} catch (error) {}
				} catch (error) {
					diagnose("PANEL-DELETE", "error", "panel", "the thread could not be deleted", {
						expected: `POST ${DELETE_URL} moves the thread to the Trash`,
						observed: String(error?.message ?? error),
						hint: "stop the thread first with stop_thread; check the dsh web terminal"
					});
				} finally {
					setBusy(false);
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
					...state.threads.map((thread) => h("div", { className: STYLE.row, key: thread.sessionId, "data-thread": thread.sessionId, "data-running": thread.running ? "true" : undefined, "data-archived": thread.archived === true ? "true" : undefined },
						h("div", { className: STYLE.main },
							h("div", { className: STYLE.rowTop },
								h("span", { className: STYLE.title, title: thread.sessionId }, thread.title ?? thread.sessionId),
								h("span", { className: STYLE.state }, thread.running === true ? t("running") : t("idle"))
							),
							h("span", { className: STYLE.id }, thread.sessionId)
						),
						h("div", { className: STYLE.actions },
								h("button", {
									type: "button",
									className: `${STYLE.action} ${thread.archived === true ? STYLE.iconGreen : STYLE.iconYellow}`,
									disabled: busy,
									title: thread.archived === true ? "Unarchive" : "Archive",
									"data-action": thread.archived === true ? "unarchive" : "archive",
									onClick: () => void toggleArchive(thread)
								}, thread.archived === true ? h(UnarchiveGlyph) : h(ArchiveGlyph), h("span", { className: STYLE.actionLabel }, thread.archived === true ? "Unarchive" : "Archive")),
								h("button", {
									type: "button",
									className: `${STYLE.action} ${STYLE.iconRed}`,
									disabled: thread.running === true || busy,
									title: thread.running === true ? t("stopFirst") : "Delete",
									"data-action": "delete",
									onClick: () => void remove(thread.sessionId)
								}, h(TrashGlyph), h("span", { className: STYLE.actionLabel }, "Delete"))
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
