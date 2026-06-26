import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names, resolving conflicts predictably. */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
