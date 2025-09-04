import {
  startOfMonth,
//   endOfMonth,
  startOfWeek,
//   endOfWeek,
  addDays,
  format,
  parse
} from "date-fns";

/**
 * monthGrid(year, monthZeroBased) -> array of 42 Date objects (6 weeks)
 * weekStartsOn: 0 = Sunday, 1 = Monday
 */
export function monthGrid(year, monthZeroBased, weekStartsOn = 0) {
  const firstOfMonth = startOfMonth(new Date(year, monthZeroBased, 1));
  const gridStart = startOfWeek(firstOfMonth, { weekStartsOn });
  const days = [];
  for (let i = 0; i < 42; i++) {
    days.push(addDays(gridStart, i));
  }
  return days;
}

export function formatMonthId(d) {
  return format(d, "yyyy-MM"); // '2025-09'
}

export function formatMonthLabel(d) {
  return format(d, "MMMM yyyy");
}

export function isoYMD(d) {
  return format(d, "yyyy-MM-dd");
}

// parse "DD/MM/YYYY" -> Date
export function parseDDMMYYYY(s) {
  return parse(s, "dd/MM/yyyy", new Date());
}
