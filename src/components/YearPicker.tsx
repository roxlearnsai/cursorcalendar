import { SUPPORTED_YEARS } from "../lib/dates";

export function YearPicker(props: { year: number; onChangeYear: (year: number) => void }) {
  const { year, onChangeYear } = props;

  return (
    <label className="monthPickerLabel">
      <span className="srOnly">Year</span>
      <select className="select" value={year} onChange={(e) => onChangeYear(Number(e.target.value))}>
        {SUPPORTED_YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </label>
  );
}

