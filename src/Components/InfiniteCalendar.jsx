import React, { useEffect, useMemo, useRef, useState } from "react";
import { startOfMonth, addMonths } from "date-fns";
import Month from "./Month.jsx";
import EntryModal from "./EntryModal.jsx";
import Header from "./Header.jsx";
import useVisibleMonth from "../hooks/useVisibleMonth";
import { parseDDMMYYYY, isoYMD, formatMonthId } from "../utils/dateUtils";
import rawData from "../data/data.json";
import "../index.css";



function initialMonths(centerDate = new Date(), radius = 6) {
  const arr = [];
  for (let i = -radius; i <= radius; i++) {
    arr.push(startOfMonth(addMonths(centerDate, i)));
  }
  return arr;
}

export default function InfiniteCalendar() {
  const containerRef = useRef(null);
  const [months, setMonths] = useState(() => initialMonths(new Date(), 6));
  const visibleId = useVisibleMonth(containerRef, [months]); // re-run when months change

  // prepare entries: parse dates and build flat & map by iso
  const [entries, setEntries] = useState([]);
  useEffect(() => {
    const parsed = rawData.map((e, idx) => {
      const d = parseDDMMYYYY(e.date);
      return { ...e, _parsed: d, _iso: isoYMD(d), _id: idx };
    }).sort((a,b) => a._parsed - b._parsed);
    setEntries(parsed);
  }, []);

  const entriesByIso = useMemo(() => {
    const map = {};
    entries.forEach((e) => {
      map[e._iso] = map[e._iso] || [];
      map[e._iso].push(e);
    });
    return map;
  }, [entries]);

  // modal state
  const [modalIndex, setModalIndex] = useState(null);

  // infinite scroll behavior
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const { scrollTop, clientHeight, scrollHeight } = el;

        // prepend when near top
        if (scrollTop < 300) {
          const first = months[0];
          const toAdd = [];
          for (let i = 3; i >= 1; i--) {
            toAdd.push(startOfMonth(addMonths(first, -i)));
          }
          const prevHeight = el.scrollHeight;
          setMonths((prev) => {
            const next = [...toAdd, ...prev];
            return next.length > 40 ? next.slice(0, 40) : next;
          });
          // after DOM update adjust scroll top to avoid jump
          requestAnimationFrame(() => {
            const delta = el.scrollHeight - prevHeight;
            el.scrollTop = scrollTop + delta;
          });
        }

        // append when near bottom
        if (scrollTop + clientHeight > scrollHeight - 300) {
          const last = months[months.length - 1];
          const toAdd = [];
          for (let i = 1; i <= 3; i++) {
            toAdd.push(startOfMonth(addMonths(last, i)));
          }
          setMonths((prev) => {
            const next = [...prev, ...toAdd];
            return next.length > 40 ? next.slice(next.length - 40) : next;
          });
        }

        ticking = false;
      });
    }

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [months]);

  // open modal: find flat index in entries
  function openEntry(entry) {
    const idx = entries.findIndex((e) => e._id === entry._id);
    if (idx >= 0) setModalIndex(idx);
  }

  function closeModal() {
    setModalIndex(null);
  }

  return (
    <div>
      <Header monthId={visibleId} />
      
      <div ref={containerRef} className="calendar-wrap">
        
        {months.map((mDate) => {
          const id = formatMonthId(mDate);
          return (
            <Month
              key={id}
              monthDate={mDate}
              monthId={id}
              entriesByIso={entriesByIso}
              onOpenEntry={openEntry}
            />
          );
        })}
      </div>

      <button className="fab" title="Add" aria-label="Add">＋</button>

      {modalIndex !== null && (
        <EntryModal entries={entries} initialIndex={modalIndex} onClose={closeModal} />
      )}
    </div>
  );
}
