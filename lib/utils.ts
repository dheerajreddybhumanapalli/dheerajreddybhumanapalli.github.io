import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Base path of the site ("" when served from the domain root).
// Honors Vite's `base` so a future sub-path deployment keeps working.
const viteBase: string =
  typeof import.meta !== "undefined" &&
  typeof import.meta.env?.BASE_URL === "string"
    ? import.meta.env.BASE_URL
    : "/";

export const basePath = viteBase === "/" ? "" : viteBase.replace(/\/$/, "");

export function assetPath(path: string) {
  return `${basePath}${path}`;
}
