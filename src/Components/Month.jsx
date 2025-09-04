import React from "react";
import { monthGrid, formatMonthLabel } from "../utils/dateUtils";
import DayCell from "./DayCell.jsx";

export default function Month({ monthDate, monthId, entriesByIso, onOpenEntry }) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const days = monthGrid(year, month); // 42 days

  return (
    <section
      data-month-id={monthId}
      className="month"
      aria-label={formatMonthLabel(monthDate)}
    >
      <div className="month-label">{formatMonthLabel(monthDate)}</div>

      <div className="month-grid">
        {days.map((d, idx) => {
          const iso = d.toISOString().slice(0, 10); // 'yyyy-mm-dd'
          const list = entriesByIso[iso] || [];
          const inMonth = d.getMonth() === month;
          return (
            <DayCell
              key={idx}
              date={d}
              inMonth={inMonth}
              entries={list}
              onOpenEntry={onOpenEntry}
              className={inMonth ? "day-cell" : "day-cell out-of-month"}
            />
          );
        })}
      </div>
    </section>
  );
}