window.__ModuleLoader__.load({
	id: "dsh-plugin-diff-preview",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		const h = (type, props, ...children) => react.createElement(type, props, ...children);

		const SELF_ID = "dsh-plugin-diff-preview";
		const NS = "diffPreview";
		const DIAG_PREFIX = "[dsh-plugin-diff-preview]";
		const TOOLVIEW_SLOT = "tool.call.toolview";
		const TOOL_KEYS = ["edit", "write"];
		const SHADOW_PRIORITY = -1;
		const PREVIEW_ROWS = 10;
		const FALLBACK_ROW_HEIGHT = 20;
		const HUGE_ROWS = 5000;
		const MAX_LCS_CELLS = 40000;
		const DARK_ATTRIBUTE = "data-ds-dark-theme";
		const BUNDLE_URL = "/api/plugins/diff-preview/vendor/pierre-diffs.js";

		const css = ".dshdpRow{box-sizing:border-box;margin:6px 0 6px 4px;color:var(--dsw-alias-label-primary);flex-direction:column;display:flex;min-width:0}"
			+ ".dshdpHead{align-items:center;gap:8px;min-width:0;display:flex;font-size:var(--dsh-content-font-size-secondary,13px);line-height:24px}"
			+ ".dshdpLeading{flex:none;color:var(--dsw-alias-label-secondary);justify-content:center;align-items:center;width:16px;display:inline-flex}"
			+ ".dshdpTitle{color:var(--dsw-alias-label-secondary);flex:none}"
			+ ".dshdpPath{text-overflow:ellipsis;white-space:nowrap;min-width:0;font:inherit;text-align:left;color:var(--dsw-alias-label-secondary);text-decoration:underline dotted;text-decoration-color:var(--dsw-alias-label-tertiary);text-underline-offset:3px;cursor:pointer;background:0 0;border:none;flex:0 1 auto;margin:0;padding:0;overflow:hidden}"
			+ ".dshdpPath:hover{color:var(--dsw-alias-label-primary);text-decoration-color:currentColor}"
			+ ".dshdpStat{font-family:var(--ds-font-family-code);font-size:calc(var(--dsh-content-font-size-secondary,13px) - 2px);flex:none;gap:6px;display:inline-flex;margin-left:2px}"
			+ ".dshdpAdd{color:var(--dsw-alias-state-success-primary)}"
			+ ".dshdpDel{color:var(--dsw-alias-state-error-primary)}"
			+ ".dshdpSpacer{flex:auto}"
			+ ".dshdpState{color:var(--dsw-alias-label-tertiary);flex:none;font-size:calc(var(--dsh-content-font-size-secondary,13px) - 2px)}"
			+ ".dshdpRow[data-state=error] .dshdpState{color:var(--dsw-alias-state-error-primary)}"
			+ ".dshdpInspect{border:.5px solid var(--dsw-alias-border-l3);corner-shape:round;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-secondary);cursor:pointer;border-radius:999px;align-items:center;gap:4px;padding:2px 8px;font-size:11px;line-height:16px;display:inline-flex;flex:none;opacity:0;transition:opacity .1s}"
			+ ".dshdpRow:hover .dshdpInspect,.dshdpInspect:focus-visible{opacity:1}"
			+ ".dshdpInspect:hover{background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-label-primary)}"
			+ ".dshdpCard{border:.5px solid var(--dsw-alias-border-l3);background:var(--dsw-alias-markdown-code-block);border-radius:12px;flex-direction:column;display:flex;margin-top:4px;overflow:hidden}"
			+ ".dshdpRow[data-state=running] .dshdpCard{border-color:var(--dsw-alias-border-l2)}"
			+ ".dshdpClip{position:relative;overflow:hidden}"
			+ ".dshdpClip[data-faded]:after{content:\"\";pointer-events:none;background:linear-gradient(to bottom,transparent,var(--dsw-alias-markdown-code-block));position:absolute;inset:auto 0 0}"
			+ ".dshdpClip:not([data-faded]):after{display:none}"
			+ ".dshdpStack{flex-direction:column;display:flex}"
			+ ".dshdpHunk{--dshdp-hunk-padding:0px}"
			+ ".dshdpGap{background:var(--dsw-alias-border-l3);flex:none;height:1px;margin:0 14px}"
			+ ".dshdpNative{padding:6px 0;font:var(--dsw-font-markdown-code-block)}"
			+ ".dshdpLine{white-space:pre-wrap;overflow-wrap:anywhere;min-height:20px;line-height:20px;display:block;padding:0 14px}"
			+ ".dshdpLine[data-kind=add]{background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 13%,transparent);color:var(--dsw-alias-state-success-primary)}"
			+ ".dshdpLine[data-kind=del]{background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 13%,transparent);color:var(--dsw-alias-state-error-primary)}"
			+ ".dshdpLine[data-kind=ctx]{color:var(--dsw-alias-label-tertiary)}"
			+ ".dshdpSign{user-select:none;width:14px;display:inline-block}"
			+ ".dshdpFoot{border-top:.5px solid var(--dsw-alias-border-l2);align-items:center;gap:8px;padding:3px 14px 4px;display:flex}"
			+ ".dshdpExpand{color:var(--dsw-alias-label-tertiary);cursor:pointer;font:inherit;background:0 0;border:none;padding:0;text-align:left}"
			+ ".dshdpExpand:hover{color:var(--dsw-alias-label-secondary)}"
			+ ".dshdpOutput{border-top:.5px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);white-space:pre-wrap;overflow-wrap:anywhere;max-height:140px;margin:0;padding:8px 14px;font:var(--dsw-font-markdown-code-block);overflow-y:auto}"
			+ ".dshdpOutput[data-error]{color:var(--dsw-alias-state-error-primary)}"
			+ ".dshdpNote{color:var(--dsw-alias-label-tertiary);padding:6px 14px;font:var(--dsw-font-markdown-code-block)}";

		const tagId = "dsh-plugin-diff-preview/DiffPreview.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = SELF_ID;
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		const STYLE = {
			row: "dshdpRow",
			head: "dshdpHead",
			leading: "dshdpLeading",
			title: "dshdpTitle",
			path: "dshdpPath",
			stat: "dshdpStat",
			add: "dshdpAdd",
			del: "dshdpDel",
			spacer: "dshdpSpacer",
			state: "dshdpState",
			inspect: "dshdpInspect",
			card: "dshdpCard",
			clip: "dshdpClip",
			stack: "dshdpStack",
			hunk: "dshdpHunk",
			gap: "dshdpGap",
			native: "dshdpNative",
			line: "dshdpLine",
			sign: "dshdpSign",
			foot: "dshdpFoot",
			expand: "dshdpExpand",
			output: "dshdpOutput",
			note: "dshdpNote"
		};

		const en = {
			"title.edit": "Edit",
			"title.write": "Write",
			"state.running": "Running",
			"state.failed": "Failed",
			"state.stopped": "Stopped",
			"inspect": "Inspect",
			"expand": "… {count} more lines",
			"collapse": "Collapse",
			"expandAria": "Expand {count} more diff lines",
			"collapseAria": "Collapse diff",
			"openFile": "Open {path}",
			"empty": "No line changes were recorded for this call",
			"partial": "The first {count} lines show a plain rendering while the highlighted view loads"
		};
		const ru = {
			"title.edit": "Правка",
			"title.write": "Запись",
			"state.running": "Выполняется",
			"state.failed": "Ошибка",
			"state.stopped": "Остановлено",
			"inspect": "Разбор",
			"expand": "… ещё {count} строк",
			"collapse": "Свернуть",
			"expandAria": "Показать ещё {count} строк диффа",
			"collapseAria": "Свернуть дифф",
			"openFile": "Открыть {path}",
			"empty": "Для этого вызова изменения строк не записаны",
			"partial": "Первые {count} строк показаны простым рендером, пока грузится подсветка"
		};
		const zh = {
			"title.edit": "编辑",
			"title.write": "写入",
			"state.running": "运行中",
			"state.failed": "失败",
			"state.stopped": "已停止",
			"inspect": "查看",
			"expand": "… 其余 {count} 行",
			"collapse": "收起",
			"expandAria": "展开其余 {count} 行差异",
			"collapseAria": "收起差异",
			"openFile": "打开 {path}",
			"empty": "此调用未记录行变更",
			"partial": "高亮加载中，前 {count} 行使用纯文本渲染"
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
		};

		let sharedAlerts;
		try {
			sharedAlerts = require("dsh-plugin-thread-bus")?.alerts;
		} catch (error) {
			sharedAlerts = undefined;
		}
		const alert = (code, level, scope, message, detail) => {
			diagnose(code, level, scope, message, detail);
			if (sharedAlerts !== undefined) {
				sharedAlerts.push({
					code: `${SELF_ID}:${code}`,
					level,
					scope,
					message,
					expected: detail?.expected ?? "",
					observed: detail?.observed ?? "",
					hint: detail?.hint ?? "",
					logs: ["browser console: filter " + DIAG_PREFIX]
				});
			}
		};
		const resolveAlert = (code) => {
			if (sharedAlerts !== undefined) sharedAlerts.resolve(`${SELF_ID}:${code}`);
		};

		const EditGlyph = () => react_jsx_runtime.jsx("svg", {
			width: 14,
			height: 14,
			viewBox: "0 0 16 16",
			fill: "none",
			"aria-hidden": "true",
			children: react_jsx_runtime.jsx("path", {
				d: "M11.5 1.9a1.6 1.6 0 0 1 2.3 0l.3.3a1.6 1.6 0 0 1 0 2.3l-7.2 7.2-3 .7.7-3 6.9-7.5Z",
				stroke: "currentColor",
				strokeWidth: 1.3,
				strokeLinejoin: "round"
			})
		});

		const InspectGlyph = () => react_jsx_runtime.jsx("svg", {
			width: 12,
			height: 12,
			viewBox: "0 0 16 16",
			fill: "none",
			"aria-hidden": "true",
			children: react_jsx_runtime.jsx("path", {
				d: "M2.5 4.5h11M2.5 8h11M2.5 11.5h7",
				stroke: "currentColor",
				strokeWidth: 1.3,
				strokeLinecap: "round"
			})
		});

		function parsedCall(block) {
			const call = "kind" in block ? block.call : block;
			if (call === null || call === undefined) return null;
			let value;
			try {
				value = JSON.parse(call.argsRaw);
			} catch (error) {
				return null;
			}
			if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
			return { name: call.name, args: value };
		}

		function validEscalationFields(args) {
			const permission = args.sandbox_permissions;
			const justification = args.justification;
			if (permission === undefined && justification === undefined) return true;
			if (permission !== "workspace-write" && permission !== "danger-full-access") return false;
			return typeof justification === "string" && justification.trim() !== "";
		}

		function intendedDiff(block) {
			const parsed = parsedCall(block);
			if (parsed === null) return null;
			const path = parsed.args.file_path;
			if (typeof path !== "string" || path.trim() === "") return null;
			if (!validEscalationFields(parsed.args)) return null;
			if (parsed.name === "write") {
				const content = parsed.args.content;
				if (typeof content !== "string") return null;
				return { tool: "write", diff: { path, oldText: null, newText: content } };
			}
			if (parsed.name !== "edit") return null;
			const oldText = parsed.args.old_string;
			const newText = parsed.args.new_string;
			if (typeof oldText !== "string" || typeof newText !== "string") return null;
			const replaceAll = parsed.args.replace_all;
			if (replaceAll !== undefined && typeof replaceAll !== "boolean") return null;
			return { tool: "edit", diff: { path, oldText: oldText === "" ? null : oldText, newText } };
		}

		function narrowHunks(diffs) {
			if (!Array.isArray(diffs) || diffs.length === 0) return null;
			const out = [];
			for (const hunk of diffs) {
				if (typeof hunk !== "object" || hunk === null) return null;
				const path = hunk.path;
				const oldText = hunk.oldText;
				const newText = hunk.newText;
				if (typeof path !== "string") return null;
				if (oldText !== null && typeof oldText !== "string") return null;
				if (typeof newText !== "string") return null;
				out.push({ path, oldText, newText });
			}
			return out;
		}

		function resultText(block) {
			if (!Array.isArray(block.content) || block.content.length === 0) return null;
			const parts = [];
			for (const part of block.content) {
				if (typeof part !== "object" || part === null) return null;
				if (part.type !== "text" || typeof part.text !== "string") return null;
				parts.push(part.text);
			}
			return parts.join("\n");
		}

		function stateOf(block) {
			if (!("kind" in block)) return "running";
			if (block.error?.code === "interrupted") return "stopped";
			return block.isError ? "error" : "ok";
		}

		function splitLines(text) {
			if (text === "" || text === null || text === undefined) return [];
			const body = text.endsWith("\n") ? text.slice(0, -1) : text;
			return body.split("\n");
		}

		function lcsRows(oldLines, newLines) {
			const rows = [];
			const rowsAppend = (kind, text) => rows.push({ kind, text });
			if (oldLines.length * newLines.length > MAX_LCS_CELLS) {
				for (const line of oldLines) rowsAppend("del", line);
				for (const line of newLines) rowsAppend("add", line);
				return rows;
			}
			const width = newLines.length + 1;
			const table = new Int32Array((oldLines.length + 1) * width);
			for (let i = oldLines.length - 1; i >= 0; i -= 1) {
				for (let j = newLines.length - 1; j >= 0; j -= 1) {
					table[i * width + j] = oldLines[i] === newLines[j]
						? table[(i + 1) * width + j + 1] + 1
						: Math.max(table[(i + 1) * width + j], table[i * width + j + 1]);
				}
			}
			let i = 0;
			let j = 0;
			while (i < oldLines.length && j < newLines.length) {
				if (oldLines[i] === newLines[j]) {
					rowsAppend("ctx", oldLines[i]);
					i += 1;
					j += 1;
				} else if (table[(i + 1) * width + j] >= table[i * width + j + 1]) {
					rowsAppend("del", oldLines[i]);
					i += 1;
				} else {
					rowsAppend("add", newLines[j]);
					j += 1;
				}
			}
			while (i < oldLines.length) {
				rowsAppend("del", oldLines[i]);
				i += 1;
			}
			while (j < newLines.length) {
				rowsAppend("add", newLines[j]);
				j += 1;
			}
			return rows;
		}

		function buildHunks(diffs) {
			let added = 0;
			let removed = 0;
			let total = 0;
			const hunks = diffs.map((diff) => {
				const rows = diff.oldText === null
					? splitLines(diff.newText).map((text) => ({ kind: "add", text }))
					: lcsRows(splitLines(diff.oldText), splitLines(diff.newText));
				for (const row of rows) {
					if (row.kind === "add") added += 1;
					else if (row.kind === "del") removed += 1;
				}
				total += rows.length;
				return { path: diff.path, oldText: diff.oldText, newText: diff.newText, rows };
			});
			return { hunks, added, removed, total };
		}

		function derive(block, toolName) {
			const intended = intendedDiff(block);
			const state = stateOf(block);
			if (intended === null) return { state, tool: toolName, path: null, hunks: [], added: 0, removed: 0, total: 0, output: "kind" in block ? resultText(block) : null, reason: "args" };
			if (block.parentCallId !== undefined) return { state, tool: intended.tool, path: intended.diff.path, hunks: [], added: 0, removed: 0, total: 0, output: "kind" in block ? resultText(block) : null, reason: "subcall" };
			if (!("kind" in block)) {
				const built = buildHunks([intended.diff]);
				return { state, tool: intended.tool, path: intended.diff.path, ...built, output: null, reason: "running" };
			}
			if (state === "error" || state === "stopped") {
				const built = buildHunks([intended.diff]);
				return { state, tool: intended.tool, path: intended.diff.path, ...built, output: resultText(block), reason: "failed" };
			}
			const applied = narrowHunks(block.meta?.diffs);
			if (applied === null) {
				const built = buildHunks([intended.diff]);
				return { state, tool: intended.tool, path: intended.diff.path, ...built, output: null, reason: "intended" };
			}
			const built = buildHunks(applied);
			return { state, tool: intended.tool, path: applied[0].path ?? intended.diff.path, ...built, output: null, reason: "applied" };
		}

		function displayPath(path, cwd, home) {
			if (typeof path !== "string") return "";
			if (typeof cwd === "string" && cwd.length > 0 && path.startsWith(cwd + "/")) return path.slice(cwd.length + 1);
			if (typeof home === "string" && home.length > 0 && path.startsWith(home + "/")) return "~/" + path.slice(home.length + 1);
			return path;
		}

		const UNSAFE_CSS = [
			":host{",
			"--diffs-font-family:var(--ds-font-family-code,ui-monospace,SFMono-Regular,Menlo,monospace)!important;",
			"--diffs-font-size:12px!important;",
			"--diffs-line-height:20px!important;",
			"--diffs-bg:var(--dsw-alias-markdown-code-block)!important;",
			"--diffs-bg-context:var(--dsw-alias-markdown-code-block)!important;",
			"--diffs-bg-context-gutter:transparent!important;",
			"--diffs-bg-buffer-override:transparent!important;",
			"--diffs-bg-separator-override:transparent!important;",
			"--diffs-bg-addition-override:var(--dsw-alias-state-success-primary)!important;",
			"--diffs-bg-deletion-override:var(--dsw-alias-state-error-primary)!important;",
			"--diffs-bg-addition-number-override:var(--dsw-alias-state-success-primary)!important;",
			"--diffs-bg-deletion-number-override:var(--dsw-alias-state-error-primary)!important;",
			"--diffs-bg-addition-emphasis-override:var(--dsw-alias-state-success-primary)!important;",
			"--diffs-bg-deletion-emphasis-override:var(--dsw-alias-state-error-primary)!important;",
			"--diffs-addition-color-override:var(--dsw-alias-state-success-primary)!important;",
			"--diffs-deletion-color-override:var(--dsw-alias-state-error-primary)!important;",
			"--diffs-modified-color-override:var(--dsw-alias-label-secondary)!important;",
			"--diffs-overflow-override:visible!important;",
			"--diffs-scrollbar-gutter-override:0px!important;",
			"}",
			":host pre{margin:0;padding:4px 0;background:transparent;}",
			":host [data-line]{border-radius:0;}"
		].join("");

		function optionsFor(dark) {
			return {
				theme: { dark: "pierre-dark", light: "pierre-light" },
				themeType: dark ? "dark" : "light",
				diffStyle: "unified",
				diffIndicators: "bars",
				disableLineNumbers: true,
				disableFileHeader: true,
				disableBackground: false,
				overflow: "wrap",
				hunkSeparators: "simple",
				lineDiffType: "word-alt",
				preferredHighlighter: "shiki-js",
				unsafeCSS: UNSAFE_CSS
			};
		}

		let bundlePromise;
		function loadBundle() {
			if (bundlePromise === undefined) {
				bundlePromise = import(BUNDLE_URL).catch((directError) => fetchBundle(directError));
			}
			return bundlePromise;
		}
		async function fetchBundle(directError) {
			try {
				const response = await fetch(BUNDLE_URL, { credentials: "include" });
				if (!response.ok) throw new Error(`HTTP ${response.status}`);
				const source = await response.text();
				const url = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
				return await import(url);
			} catch (error) {
				alert("VENDOR-load", "error", "renderer", "the pinned @pierre/diffs bundle could not be loaded", {
					expected: `a module at ${BUNDLE_URL}`,
					observed: `${String(directError?.message ?? directError)} then ${String(error?.message ?? error)}`,
					hint: "the card keeps rendering a plain diff; check the plugin diagnostics route"
				});
				throw error;
			}
		}

		function useDarkTheme() {
			const read = () => typeof document !== "undefined" && document.body?.hasAttribute(DARK_ATTRIBUTE) === true;
			const [dark, setDark] = react.useState(read);
			react.useEffect(() => {
				if (typeof MutationObserver === "undefined" || typeof document === "undefined") return undefined;
				const observer = new MutationObserver(() => setDark(read()));
				observer.observe(document.body, { attributes: true, attributeFilter: [DARK_ATTRIBUTE] });
				return () => observer.disconnect();
			}, []);
			return dark;
		}

		function useBundle() {
			const [loaded, setLoaded] = react.useState(undefined);
			react.useEffect(() => {
				let live = true;
				loadBundle()
					.then((mod) => {
						if (!live) return;
						resolveAlert("VENDOR-load");
						setLoaded(mod);
					})
					.catch(() => {
						if (live) setLoaded(null);
					});
				return () => {
					live = false;
				};
			}, []);
			return loaded;
		}

		function PierreHunks({ mod, hunks, dark, measure }) {
			const holders = react.useRef([]);
			react.useEffect(() => {
				const instances = [];
				for (let index = 0; index < hunks.length; index += 1) {
					const holder = holders.current[index];
					if (holder === undefined || holder === null) continue;
					try {
						const instance = new mod.FileDiff(optionsFor(dark));
						instance.render({
							containerWrapper: holder,
							oldFile: hunks[index].oldText === null ? null : { name: hunks[index].path, contents: hunks[index].oldText },
							newFile: { name: hunks[index].path, contents: hunks[index].newText }
						});
						instances.push(instance);
					} catch (error) {
						alert("RENDER-hunk", "error", "renderer", `hunk ${index} could not be rendered by @pierre/diffs`, {
							expected: "a rendered FileDiff instance",
							observed: String(error?.message ?? error),
							hint: "the card keeps rendering a plain diff"
						});
					}
				}
				measure();
				const observers = [];
				if (typeof ResizeObserver !== "undefined") {
					for (const holder of holders.current) {
						const container = holder?.querySelector?.("diffs-container");
						if (container === null || container === undefined) continue;
						const observer = new ResizeObserver(() => measure());
						observer.observe(container);
						observers.push(observer);
					}
				}
				const settle = typeof setTimeout === "function" ? [setTimeout(measure, 120), setTimeout(measure, 500)] : [];
				return () => {
					for (const timer of settle) clearTimeout(timer);
					for (const observer of observers) observer.disconnect();
					for (const instance of instances) {
						try {
							instance.cleanUp();
						} catch (error) {}
					}
					for (const holder of holders.current) {
						if (holder !== undefined && holder !== null) holder.replaceChildren();
					}
				};
			}, [mod, hunks, dark, measure]);
			return h("div", { className: STYLE.stack, "data-renderer": "pierre" },
				...hunks.flatMap((hunk, index) => [
					index === 0 ? null : h("div", { key: `gap-${index}`, className: STYLE.gap }),
					h("div", {
						key: index,
						className: STYLE.hunk,
						"data-hunk": index,
						ref: (node) => {
							holders.current[index] = node;
						}
					})
				].filter((node) => node !== null))
			);
		}

		function NativeHunks({ hunks, limit }) {
			const children = [];
			let used = 0;
			for (let index = 0; index < hunks.length && used < limit; index += 1) {
				if (index > 0) children.push(h("div", { key: `gap-${index}`, className: STYLE.gap }));
				const rows = hunks[index].rows;
				for (let rowIndex = 0; rowIndex < rows.length && used < limit; rowIndex += 1) {
					const row = rows[rowIndex];
					used += 1;
					children.push(h("div", {
						key: `${index}-${rowIndex}`,
						className: STYLE.line,
						"data-kind": row.kind
					}, h("span", { className: STYLE.sign }, row.kind === "add" ? "+" : row.kind === "del" ? "-" : " "), row.text));
				}
			}
			return h("div", { className: STYLE.native, "data-renderer": "native" }, ...children);
		}

		function rowsInOrder(root) {
			if (root === null || root === undefined) return [];
			const containers = [...root.querySelectorAll("diffs-container")];
			if (containers.length > 0) return containers.flatMap((container) => [...(container.shadowRoot?.querySelectorAll("[data-line]") ?? [])]);
			return [...root.querySelectorAll(`.${STYLE.line}`)];
		}

		const DiffPreviewRow = ({ toolName, block, cwd, home, openFile, inspect, t }) => {
			const model = react.useMemo(() => derive(block, toolName), [block, toolName]);
			const dark = useDarkTheme();
			const bundle = useBundle();
			const [expanded, setExpanded] = react.useState(false);
			const [clipHeight, setClipHeight] = react.useState(PREVIEW_ROWS * FALLBACK_ROW_HEIGHT);
			const [measuredRows, setMeasuredRows] = react.useState(0);
			const clipRef = react.useRef(null);
			const cardRef = react.useRef(null);
			const cappedRef = react.useRef(false);
			const measure = react.useCallback(() => {
				if (cappedRef.current) return;
				const clip = clipRef.current;
				if (clip === null) return;
				const rows = rowsInOrder(clip);
				if (rows.length === 0) return;
				setMeasuredRows((current) => (current === rows.length ? current : rows.length));
				if (rows.length <= PREVIEW_ROWS) return;
				const height = rows[PREVIEW_ROWS - 1].getBoundingClientRect().bottom - clip.getBoundingClientRect().top;
				if (height > 0) setClipHeight((current) => (Math.abs(current - height) < 0.5 ? current : height));
			}, []);
			const total = measuredRows > 0 ? measuredRows : model.total;
			const hidden = Math.max(0, total - PREVIEW_ROWS);
			const huge = total > HUGE_ROWS;
			const pierreActive = bundle !== null && bundle !== undefined && model.hunks.length > 0 && !(huge && !expanded);
			cappedRef.current = model.hunks.length > 0 && !pierreActive && model.total > HUGE_ROWS;
			const title = model.tool === "write" ? t("title.write") : t("title.edit");
			const stateLabel = model.state === "error" ? t("state.failed") : model.state === "stopped" ? t("state.stopped") : model.state === "running" ? t("state.running") : null;
			const path = displayPath(model.path, cwd, home);

			const head = h("div", { className: STYLE.head },
				h("span", { className: STYLE.leading, "data-tool": toolName }, h(EditGlyph)),
				h("span", { className: STYLE.title }, title),
				typeof model.path === "string" && model.path.length > 0 && typeof openFile === "function"
					? h("button", {
						type: "button",
						className: STYLE.path,
						title: model.path,
						"aria-label": t("openFile", { path }),
						onClick: () => openFile(model.path)
					}, path)
					: h("span", { className: STYLE.path, title: model.path ?? "" }, path),
				model.hunks.length === 0 ? null : h("span", { className: STYLE.stat },
					h("span", { className: STYLE.add }, `+${model.added}`),
					h("span", { className: STYLE.del }, `−${model.removed}`)
				),
				h("span", { className: STYLE.spacer }),
				stateLabel === null ? null : h("span", { className: STYLE.state, "data-state": model.state }, stateLabel),
				typeof inspect === "function"
					? h("button", { type: "button", className: STYLE.inspect, onClick: () => inspect() }, h(InspectGlyph), t("inspect"))
					: null
			);

			let body = null;
			if (model.hunks.length === 0) {
				body = h("p", { className: STYLE.note }, t("empty"));
			} else {
				const content = pierreActive
					? h(PierreHunks, { mod: bundle, hunks: model.hunks, dark, measure })
					: h(NativeHunks, { hunks: model.hunks, limit: cappedRef.current ? PREVIEW_ROWS : model.total });
				body = h("div", {
					className: STYLE.clip,
					ref: clipRef,
					"data-faded": hidden > 0 && !expanded ? "true" : undefined,
					style: { maxHeight: hidden > 0 && !expanded ? `${clipHeight}px` : "none" }
				}, content);
			}

			react.useEffect(() => {
				measure();
			});

			react.useEffect(() => {
				const card = cardRef.current;
				if (card === null || typeof ResizeObserver === "undefined") return undefined;
				const observer = new ResizeObserver(() => measure());
				observer.observe(card);
				return () => observer.disconnect();
			}, [measure]);

			const foot = hidden > 0
				? h("div", { className: STYLE.foot },
					h("button", {
						type: "button",
						className: STYLE.expand,
						"aria-expanded": expanded ? "true" : "false",
						"aria-label": expanded ? t("collapseAria") : t("expandAria", { count: hidden }),
						onClick: () => setExpanded((value) => !value)
					}, expanded ? t("collapse") : t("expand", { count: hidden })),
					pierreActive || bundle !== null ? null : h("span", { className: STYLE.state }, t("partial", { count: PREVIEW_ROWS }))
				)
				: null;

			const output = model.output !== null && model.output !== undefined && model.output !== ""
				? h("pre", { className: STYLE.output, "data-error": model.state === "error" ? "true" : undefined }, model.output)
				: null;

			return h("div", {
				className: STYLE.row,
				"data-state": model.state,
				"data-tool": toolName,
				"data-renderer": pierreActive ? "pierre" : "native",
				"data-call": model.path ?? undefined
			},
				head,
				model.hunks.length === 0 && output === null ? null : h("div", { className: STYLE.card, ref: cardRef }, body, foot, output)
			);
		};

		const inject = ["slots", "locale"];

		const apply = (ctx) => {
			if (typeof ctx.locale?.register === "function") ctx.effect(() => ctx.locale.register(NS, { en, ru, zh }), "diff-preview: dictionaries");
			if (typeof ctx.slots?.inject !== "function") {
				alert("SVC-slots", "error", "ui", "the slot registry is missing", {
					expected: "ctx.slots.inject/register from dsh-client-ui-renderer",
					observed: "undefined",
					hint: "the chat keeps the built-in diff card"
				});
				return;
			}
			resolveAlert("SVC-slots");
			try {
				ctx.slots.inject(TOOLVIEW_SLOT, function* () {
					for (const key of TOOL_KEYS) {
						yield ctx.slots.register({
							name: TOOLVIEW_SLOT,
							key,
							priority: SHADOW_PRIORITY,
							locale: NS,
							registrant: SELF_ID
						}, DiffPreviewRow);
					}
				});
				resolveAlert("UI-SLOT-shadow");
			} catch (error) {
				alert("UI-SLOT-shadow", "error", "ui", "the diff card could not shadow the built-in row", {
					expected: `slots.register({ name: "${TOOLVIEW_SLOT}", key: "edit"|"write", priority: ${SHADOW_PRIORITY} })`,
					observed: String(error?.message ?? error),
					hint: "@deepseek-ai/dsh-client-ui-tool registers the same keys at priority 0; a lower priority wins"
				});
			}
		};

		exports.apply = apply;
		exports.inject = inject;
		exports.previewRows = PREVIEW_ROWS;
		return module.exports;
	}
});
