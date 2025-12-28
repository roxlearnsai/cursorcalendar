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

export const APP_YEAR = 2026;

export function toIsoDate(d: Date): IsoDate {
  return format(d, "yyyy-MM-dd") as IsoDate;
}

export function clampMonthIndex(monthIndex: number): number {
  return Math.max(0, Math.min(11, monthIndex));
}

export function monthDate(monthIndex: number): Date {
  return new Date(APP_YEAR, clampMonthIndex(monthIndex), 1);
}

export function monthLabel(monthIndex: number): string {
  return format(monthDate(monthIndex), "LLLL");
}

export function shiftMonth(monthIndex: number, delta: number): number {
  return clampMonthIndex(monthIndex + delta);
}

export type MonthCell = {
  date: Date;
  iso: IsoDate;
  inMonth: boolean;
};

// Monday-start week grid (common in SG)
export function buildMonthGrid(monthIndex: number): MonthCell[] {
  const monthStart = startOfMonth(monthDate(monthIndex));
  const monthEnd = endOfMonth(monthStart);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: gridStart, end: gridEnd }).map((date) => ({
    date,
    iso: toIsoDate(date),
    inMonth: isSameMonth(date, monthStart)
  }));
}

export function monthIndexFromDate(d: Date): number {
  if (d.getFullYear() !== APP_YEAR) return 0;
  return clampMonthIndex(d.getMonth());
}

export function monthIndexAfter(monthIndex: number, delta: number): number {
  const shifted = addMonths(monthDate(monthIndex), delta);
  if (shifted.getFullYear() !== APP_YEAR) return monthIndex;
  return clampMonthIndex(shifted.getMonth());
}

