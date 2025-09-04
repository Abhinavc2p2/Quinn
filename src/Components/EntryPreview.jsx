import React from "react";

export default function EntryPreview({ entry, onClick }) {
  return (
    <div className="entry-preview" onClick={onClick} role="button" tabIndex={0}>
      <img src={entry.imgUrl} alt="entry" loading="lazy" />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>{entry.categories?.[0] || "Entry"}</div>
        <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
          {(entry.description || "").slice(0, 60)}{entry.description?.length > 60 ? "…" : ""}
        </div>
        <div className="chips" style={{ marginTop: 8 }}>
          <div className="chip">⭐ {entry.rating}</div>
          {entry.categories?.slice(0,2).map((c,i) => <div key={i} className="chip">{c}</div>)}
        </div>
      </div>
    </div>
  );
}
