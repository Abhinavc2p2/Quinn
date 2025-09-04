import React from "react";
import { formatMonthLabel } from "../utils/dateUtils";

export default function Header({ monthId }) {
  // monthId is 'YYYY-MM' or null
  function labelFromId(id) {
    if (!id) return "";
    const [y, m] = id.split("-").map(Number);
    return formatMonthLabel(new Date(y, m - 1, 1));
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="header" role="banner">
      <div className="header-inner">
        <div className="header-left">
          <button className="back-btn" title="Back">←</button>
          <div className="title"><span className="blue">my</span> hair diary</div>
        </div>
        <div className="header-right">
          <div className="month-label">{labelFromId(monthId)}</div>
        </div>
      </div>

      {/* Weekday Row (aligned with grid) */}
      <div className="weekdays-header">
        {weekdays.map((d, i) => (
          <div key={i} className={i === 0 ? "sunday" : i === 6 ? "saturday" : ""}>
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}
