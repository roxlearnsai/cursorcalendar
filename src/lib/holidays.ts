import type { Holiday, IsoDate } from "../types";

type NagerHoliday = {
  date: string; // YYYY-MM-DD
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
};

function normalizeIso(d: string): IsoDate | null {
  // Very small guard; the API already returns YYYY-MM-DD.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return null;
  return d as IsoDate;
}

function toMap(holidays: Holiday[]): Record<IsoDate, string[]> {
  const map: Record<IsoDate, string[]> = {};
  for (const h of holidays) {
    (map[h.date] ??= []).push(h.name);
  }
  return map;
}

// Fallback list (used only if network/API fails).
// Source: common SG public holiday set; dates are best-effort.
const FALLBACK_2026: Holiday[] = [
  { date: "2026-01-01", name: "New Year's Day" },
  { date: "2026-02-17", name: "Chinese New Year" },
  { date: "2026-02-18", name: "Chinese New Year (2nd day)" },
  { date: "2026-03-20", name: "Hari Raya Puasa" },
  { date: "2026-04-03", name: "Good Friday" },
  { date: "2026-05-01", name: "Labour Day" },
  { date: "2026-05-27", name: "Hari Raya Haji" },
  { date: "2026-05-31", name: "Vesak Day" },
  { date: "2026-08-09", name: "National Day" },
  { date: "2026-11-08", name: "Deepavali" },
  { date: "2026-12-25", name: "Christmas Day" }
];

export async function loadSingaporeHolidays2026(): Promise<Record<IsoDate, string[]>> {
  // Nager.Date API (no key, CORS enabled). If it fails, fall back to bundled list.
  try {
    const res = await fetch("https://date.nager.at/api/v3/PublicHolidays/2026/SG", {
      method: "GET",
      headers: { Accept: "application/json" }
    });
    if (!res.ok) throw new Error(`Holiday API failed: ${res.status}`);
    const json = (await res.json()) as NagerHoliday[];
    const holidays: Holiday[] = [];
    for (const h of json) {
      const iso = normalizeIso(h.date);
      if (!iso) continue;
      holidays.push({ date: iso, name: h.localName || h.name });
    }
    return toMap(holidays);
  } catch {
    return toMap(FALLBACK_2026);
  }
}

