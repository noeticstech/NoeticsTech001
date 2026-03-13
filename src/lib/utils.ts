import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function damp(
  current: number,
  target: number,
  smoothing: number,
  delta: number,
) {
  return current + (target - current) * (1 - Math.exp(-smoothing * delta));
}
