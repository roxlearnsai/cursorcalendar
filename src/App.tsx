import { useEffect, useMemo, useRef, useState } from "react";
import type { IsoDate, PhotoByDate } from "./types";
import { initialYearMonth, monthLabel, type SupportedYear } from "./lib/dates";
import { loadSingaporeHolidays } from "./lib/holidays";
import { loadPhotos, savePhotos } from "./lib/storage";
import { CalendarGrid } from "./components/CalendarGrid";
import { MonthPicker } from "./components/MonthPicker";
import { YearPicker } from "./components/YearPicker";

export function App() {
  const initial = initialYearMonth(new Date());
  const [year, setYear] = useState<SupportedYear>(initial.year);
  const [monthIndex, setMonthIndex] = useState<number>(initial.monthIndex);
  const [holidaysByDate, setHolidaysByDate] = useState<Record<string, string[]>>({});
  const [holidayStatus, setHolidayStatus] = useState<"loading" | "ready">("loading");
  const holidayCacheRef = useRef<Record<number, Record<string, string[]>>>({});

  const [photosByDate, setPhotosByDate] = useState<PhotoByDate>(() => {
    try {
      return loadPhotos();
    } catch {
      return {};
    }
  });

  useEffect(() => {
    // Persist photo changes
    savePhotos(photosByDate);
  }, [photosByDate]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setHolidayStatus("loading");
      const cached = holidayCacheRef.current[year];
      const map = cached ?? (await loadSingaporeHolidays(year));
      if (cancelled) return;
      holidayCacheRef.current[year] = map;
      setHolidaysByDate(map);
      setHolidayStatus("ready");
    })();
    return () => {
      cancelled = true;
    };
  }, [year]);

  const monthTitle = useMemo(() => `${monthLabel(year, monthIndex)} ${year}`, [year, monthIndex]);

  return (
    <div className="appShell">
      <header className="topBar">
        <div className="controls">
          <YearPicker
            year={year}
            onChangeYear={(y) => {
              setYear(y as SupportedYear);
            }}
          />

          <MonthPicker year={year} monthIndex={monthIndex} onChangeMonthIndex={setMonthIndex} />
        </div>
      </header>

      <main className="content">
        <div className="monthTitleSrOnly" aria-hidden>
          {monthTitle}
        </div>

        <CalendarGrid
          year={year}
          monthIndex={monthIndex}
          holidaysByDate={holidaysByDate}
          photosByDate={photosByDate}
          onAddPhotos={(iso, newPhotos) => {
            setPhotosByDate((prev) => {
              const existing = prev[iso] ?? [];
              const remaining = Math.max(0, 4 - existing.length);
              const merged = existing.concat(newPhotos.slice(0, remaining)).slice(0, 4);
              return { ...prev, [iso]: merged };
            });
          }}
          onRemovePhoto={(iso, photoId) => {
            setPhotosByDate((prev) => {
              const existing = prev[iso] ?? [];
              const next = existing.filter((p) => p.id !== photoId);
              if (next.length === 0) {
                const { [iso]: _removed, ...rest } = prev;
                return rest;
              }
              return { ...prev, [iso]: next };
            });
          }}
        />
      </main>
    </div>
  );
}

