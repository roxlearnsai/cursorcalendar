import type { IsoDate, PhotoByDate } from "../types";
import { buildMonthGrid } from "../lib/dates";
import { DayTile } from "./DayTile";

const WEEKDAY_INFO = [
  {
    key: "mon",
    icon: "🌙",
    lines: ["月 (げつ)", "월요일", "Isnin", "Monday"],
    weekend: false
  },
  {
    key: "tue",
    icon: "🔥",
    lines: ["火 (か)", "화요일", "Selasa", "Tuesday"],
    weekend: false
  },
  {
    key: "wed",
    icon: "💧",
    lines: ["水 (すい)", "수요일", "Rabu", "Wednesday"],
    weekend: false
  },
  {
    key: "thu",
    icon: "🪵",
    lines: ["木 (もく)", "목요일", "Khamis", "Thursday"],
    weekend: false
  },
  {
    key: "fri",
    icon: "🪙",
    lines: ["金 (きん)", "금요일", "Jumaat", "Friday"],
    weekend: false
  },
  {
    key: "sat",
    icon: "🌱",
    lines: ["土 (ど)", "토요일", "Sabtu", "Saturday"],
    weekend: true
  },
  {
    key: "sun",
    icon: "🌞",
    lines: ["日 (にち)", "일요일", "Ahad", "Sunday"],
    weekend: true
  }
] as const;

export function CalendarGrid(props: {
  year: number;
  monthIndex: number;
  holidaysByDate: Record<string, string[]>;
  photosByDate: PhotoByDate;
  onAddPhotos: (iso: IsoDate, photos: PhotoByDate[IsoDate]) => void;
  onRemovePhoto: (iso: IsoDate, photoId: string) => void;
}) {
  const { year, monthIndex, holidaysByDate, photosByDate, onAddPhotos, onRemovePhoto } = props;
  const cells = buildMonthGrid(year, monthIndex);

  return (
    <div className="calendar">
      <div className="weekdayHeader">
        {WEEKDAY_INFO.map((w) => (
          <div className={`weekdayCell ${w.weekend ? "weekdayCellWeekend" : ""}`} key={w.key}>
            <div className="weekdayIcon" aria-hidden>
              {w.icon}
            </div>
            {w.lines.map((line, idx) => (
              <div className={`weekdayLine weekdayLine${idx + 1}`} key={line}>
                {line}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="grid">
        {cells.map((c) => (
          <DayTile
            key={c.iso}
            iso={c.iso}
            date={c.date}
            inMonth={c.inMonth}
            isWeekend={c.date.getDay() === 0 || c.date.getDay() === 6}
            holidayNames={holidaysByDate[c.iso]}
            photos={photosByDate[c.iso]}
            onAddPhotos={onAddPhotos}
            onRemovePhoto={onRemovePhoto}
          />
        ))}
      </div>
    </div>
  );
}

