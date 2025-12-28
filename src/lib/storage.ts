import type { PhotoByDate } from "../types";

const KEY = "sg-calendar-2026-photos-v1";

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadPhotos(): PhotoByDate {
  const parsed = safeJsonParse<PhotoByDate>(localStorage.getItem(KEY));
  if (!parsed || typeof parsed !== "object") return {};
  return parsed;
}

export function savePhotos(next: PhotoByDate): void {
  localStorage.setItem(KEY, JSON.stringify(next));
}

