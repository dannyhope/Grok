import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Snippet } from "svelte";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export type WithElementRef<T> = T & {
	ref?: HTMLElement | null;
};

export type WithoutChild<T> = Omit<T, "child">;

export type WithoutChildrenOrChild<T> = Omit<T, "children" | "child">;

export type WithChild<T> = Omit<T, "children"> & {
	child?: Snippet<[T]>;
	children?: Snippet;
};
