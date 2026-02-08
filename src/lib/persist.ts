import type { GrokPersisted } from "./types.js";

const STORAGE_KEY = "grok-state";

export function loadState(): GrokPersisted | null {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		return JSON.parse(raw) as GrokPersisted;
	} catch {
		return null;
	}
}

export function saveState(state: GrokPersisted): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {
		console.warn("Failed to save state to localStorage");
	}
}

export function clearState(): void {
	localStorage.removeItem(STORAGE_KEY);
}
