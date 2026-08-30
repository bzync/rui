import { twMerge } from "tailwind-merge";

/**
 * Accepted by {@link cn} — strings, numbers, nested arrays, or
 * `{ "class": boolean }` maps. Mirrors clsx's `ClassValue`.
 */
export type ClassValue =
  | string
  | number
  | bigint
  | null
  | boolean
  | undefined
  | ClassValue[]
  | { [key: string]: unknown };

function toClass(value: ClassValue): string {
  if (typeof value === "string" || typeof value === "number" || typeof value === "bigint") {
    return String(value);
  }
  if (Array.isArray(value)) {
    let out = "";
    for (const item of value) {
      const part = toClass(item);
      if (part) out += (out && " ") + part;
    }
    return out;
  }
  if (value && typeof value === "object") {
    let out = "";
    for (const key in value) {
      if (value[key]) out += (out && " ") + key;
    }
    return out;
  }
  return "";
}

/**
 * Join conditional class values and resolve conflicting Tailwind utilities so a
 * caller's `className` reliably wins over a component's defaults
 * (`cn("px-2", "px-4")` → `"px-4"`). `tailwind-merge` is bundled into the
 * published package — @bzync/rui ships with no runtime dependencies.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(toClass(inputs));
}
