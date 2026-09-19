export * from "shiki/core";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { bundledLanguages } from "./bundled-languages.js";

const SPECIAL_LANGUAGES = new Set(["text", "ansi", "plaintext", "txt"]);

export { bundledLanguages };
export { createJavaScriptRegexEngine };

export const bundledThemes = {};

export async function createHighlighter({ themes = [], langs = [], engine, ...rest } = {}) {
	return createHighlighterCore({
		themes: themes.map((theme) => (typeof theme === "string" ? bundledThemes[theme] : theme)),
		langs: langs.map((language) => {
			if (typeof language !== "string") return language;
			if (SPECIAL_LANGUAGES.has(language)) return language;
			return bundledLanguages[language];
		}),
		engine: engine ?? createJavaScriptRegexEngine(),
		...rest
	});
}

export function createOnigurumaEngine() {
	throw new Error("diff-preview: the oniguruma engine is not part of this bundle");
}
