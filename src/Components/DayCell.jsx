import React from "react";

export default function DayCell({ date, inMonth, entries = [], onOpenEntry }) {
  const dayNum = date.getDate();

  return (
    <div className={`day-cell ${!inMonth ? "day-outside" : ""}`}>
      <div className="day-num">{dayNum}</div>

      {entries.length > 0 && (
        <div
          className="dc-entry"
          onClick={() => onOpenEntry(entries[0])}
        >
          {/* ⭐ Rating above image */}
          <div className="dc-rating">
            {"★".repeat(Math.round(entries[0].rating))}
          </div>

          {/* 🖼️ Image */}
          <img
            src={entries[0].imgUrl}
            alt="entry"
            className="dc-img"
          />

          {/* 🏷️ Category badges */}
          <div className="dc-categories">
            {entries[0].categories.slice(0, 2).map((cat, idx) => (
              <span
                key={idx}
                className="dc-badge"
                style={{
                  backgroundColor: `hsl(${Math.floor(
                    Math.random() * 360
                  )}, 70%, 85%)`,
                }}
              >
                {cat.split(" ")[0][0]}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
