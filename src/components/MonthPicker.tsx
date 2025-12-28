import { monthLabel } from "../lib/dates";

export function MonthPicker(props: {
  year: number;
  monthIndex: number;
  onChangeMonthIndex: (next: number) => void;
}) {
  const { year, monthIndex, onChangeMonthIndex } = props;

  return (
    <div className="monthPicker">
      <label className="monthPickerLabel">
        <span className="srOnly">Month</span>
        <select
          className="select"
          value={monthIndex}
          onChange={(e) => onChangeMonthIndex(Number(e.target.value))}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <option value={i} key={i}>
              {monthLabel(year, i)} {year}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

