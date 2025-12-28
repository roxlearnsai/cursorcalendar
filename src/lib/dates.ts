import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek
} from "date-fns";
import type { IsoDate } from "../types";

export const SUPPORTED_YEARS = [2025, 2026] as const;
export type SupportedYear = (typeof SUPPORTED_YEARS)[number];
export const MIN_YEAR: SupportedYear = SUPPORTED_YEARS[0];
export const MAX_YEAR: SupportedYear = SUPPORTED_YEARS[SUPPORTED_YEARS.length - 1];
export const DEFAULT_YEAR: SupportedYear = 2026;

export function toIsoDate(d: Date): IsoDate {
  return format(d, "yyyy-MM-dd") as IsoDate;
}

export function clampMonthIndex(monthIndex: number): number {
  return Math.max(0, Math.min(11, monthIndex));
}

export function monthDate(year: number, monthIndex: number): Date {
  return new Date(year, clampMonthIndex(monthIndex), 1);
}

export function monthLabel(year: number, monthIndex: number): string {
  return format(monthDate(year, monthIndex), "LLLL");
}

export function isSupportedYear(year: number): year is SupportedYear {
  return (SUPPORTED_YEARS as readonly number[]).includes(year);
}

export type MonthCell = {
  date: Date;
  iso: IsoDate;
  inMonth: boolean;
};

// Monday-start week grid (common in SG)
export function buildMonthGrid(year: number, monthIndex: number): MonthCell[] {
  const monthStart = startOfMonth(monthDate(year, monthIndex));
  const monthEnd = endOfMonth(monthStart);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: gridStart, end: gridEnd }).map((date) => ({
    date,
    iso: toIsoDate(date),
    inMonth: isSameMonth(date, monthStart)
  }));
}

export function initialYearMonth(d: Date = new Date()): { year: SupportedYear; monthIndex: number } {
  const y = d.getFullYear();
  const year: SupportedYear = isSupportedYear(y) ? y : DEFAULT_YEAR;
  return { year, monthIndex: clampMonthIndex(d.getMonth()) };
}

export function shiftYearMonth(
  current: { year: SupportedYear; monthIndex: number },
  deltaMonths: number
): { year: SupportedYear; monthIndex: number } {
  const shifted = addMonths(monthDate(current.year, current.monthIndex), deltaMonths);

  const y = shifted.getFullYear();
  const m = clampMonthIndex(shifted.getMonth());

  if (!isSupportedYear(y)) {
    if (y < MIN_YEAR) return { year: MIN_YEAR, monthIndex: 0 };
    return { year: MAX_YEAR, monthIndex: 11 };
  }

  return { year: y, monthIndex: m };
}

