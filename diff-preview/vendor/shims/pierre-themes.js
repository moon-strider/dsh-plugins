import { normalizeTheme } from "shiki/core";

const unwrapDefault = (value) => (value !== null && typeof value === "object" && "default" in value ? value.default : value);

export function createTheme({ name, load, colorScheme, collection, displayName }) {
	return {
		name,
		colorScheme,
		collection,
		displayName,
		load: async () => normalizeTheme(unwrapDefault(await load()))
	};
}

const descriptor = (name) => createTheme({
	name,
	collection: "pierre",
	colorScheme: name.endsWith("light") ? "light" : "dark",
	displayName: name === "pierre-dark" ? "Pierre Dark" : "Pierre Light",
	load: name === "pierre-dark" ? () => import("@pierre/theme/pierre-dark") : () => import("@pierre/theme/pierre-light")
});

export const pierreThemes = {
	getThemes: () => [descriptor("pierre-dark"), descriptor("pierre-light")],
	getTheme: (name) => (name === "pierre-dark" || name === "pierre-light" ? descriptor(name) : undefined)
};

export const shikiThemes = { getThemes: () => [], getTheme: () => undefined };
export const themes = pierreThemes;
