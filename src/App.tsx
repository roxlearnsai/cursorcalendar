import { useEffect, useMemo, useState } from "react";
import type { IsoDate, PhotoByDate } from "./types";
import { APP_YEAR, monthIndexAfter, monthIndexFromDate, monthLabel } from "./lib/dates";
import { loadSingaporeHolidays2026 } from "./lib/holidays";
import { loadPhotos, savePhotos } from "./lib/storage";
import { CalendarGrid } from "./components/CalendarGrid";
import { MonthPicker } from "./components/MonthPicker";

export function App() {
  const [monthIndex, setMonthIndex] = useState<number>(() => monthIndexFromDate(new Date()));
  const [holidaysByDate, setHolidaysByDate] = useState<Record<string, string[]>>({});
  const [holidayStatus, setHolidayStatus] = useState<"loading" | "ready">("loading");

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
      const map = await loadSingaporeHolidays2026();
      if (cancelled) return;
      setHolidaysByDate(map);
      setHolidayStatus("ready");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const monthTitle = useMemo(() => `${monthLabel(monthIndex)} ${APP_YEAR}`, [monthIndex]);

  return (
    <div className="appShell">
      <header className="topBar">
        <div className="brand">
          <div className="brandTitle">Singapore Calendar</div>
          <div className="brandSubtitle">2026 · Monthly view · Photos per day</div>
        </div>

        <div className="controls">
          <button
            className="button"
            type="button"
            onClick={() => setMonthIndex((m) => monthIndexAfter(m, -1))}
            aria-label="Previous month"
            title="Previous month"
            disabled={monthIndex === 0}
          >
            ←
          </button>

          <MonthPicker monthIndex={monthIndex} onChangeMonthIndex={setMonthIndex} />

          <button
            className="button"
            type="button"
            onClick={() => setMonthIndex((m) => monthIndexAfter(m, 1))}
            aria-label="Next month"
            title="Next month"
            disabled={monthIndex === 11}
          >
            →
          </button>
        </div>
      </header>

      <main className="content">
        <div className="metaRow">
          <div className="monthHeading">{monthTitle}</div>
          <div className="status">
            {holidayStatus === "loading" ? (
              <span className="statusPill">Loading SG public holidays…</span>
            ) : (
              <span className="statusPill statusOk">SG public holidays loaded</span>
            )}
          </div>
        </div>

        <CalendarGrid
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

        <section className="tips">
          <div className="tipsTitle">Tips</div>
          <ul className="tipsList">
            <li>
              Photos are stored in your browser (localStorage). Use smaller images if you hit storage limits.
            </li>
            <li>Click any photo thumbnail to remove it.</li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        <span>2026 only · Week starts Monday · Default SG public holidays</span>
      </footer>
    </div>
  );
}

