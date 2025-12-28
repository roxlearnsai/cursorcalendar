import type { IsoDate, PhotoByDate } from "../types";
import { buildMonthGrid } from "../lib/dates";
import { DayTile } from "./DayTile";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export function CalendarGrid(props: {
  monthIndex: number;
  holidaysByDate: Record<string, string[]>;
  photosByDate: PhotoByDate;
  onAddPhotos: (iso: IsoDate, photos: PhotoByDate[IsoDate]) => void;
  onRemovePhoto: (iso: IsoDate, photoId: string) => void;
}) {
  const { monthIndex, holidaysByDate, photosByDate, onAddPhotos, onRemovePhoto } = props;
  const cells = buildMonthGrid(monthIndex);

  return (
    <div className="calendar">
      <div className="weekdayHeader">
        {WEEKDAYS.map((w) => (
          <div className="weekdayCell" key={w}>
            {w}
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

