import React, { useEffect, useMemo, useRef, useState } from "react";
import { addDays, subDays, startOfDay, getDay, format } from "date-fns";
import EntryModal from "./EntryModal.jsx";
import Header from "./Header.jsx";
import { parseDDMMYYYY, isoYMD } from "../utils/dateUtils";
import rawData from "../data/data.json";
import DayCell from "./DayCell.jsx";
import "../index.css";

function initialDays(centerDate = new Date(), radius = 90) {
  // Start from the most recent Sunday to align with weekday header
  const center = startOfDay(centerDate);
  const startDate = subDays(center, radius);
  
  // Find the Sunday before startDate
  const dayOfWeek = getDay(startDate); // 0 = Sunday
  const alignedStart = subDays(startDate, dayOfWeek);
  
  const totalDays = radius * 2 + 1;
  // Round up to complete weeks
  const weeksNeeded = Math.ceil(totalDays / 7);
  const daysToGenerate = weeksNeeded * 7;
  
  const arr = [];
  for (let i = 0; i < daysToGenerate; i++) {
    arr.push(addDays(alignedStart, i));
  }
  return arr;
}

export default function InfiniteCalendar() {
  const containerRef = useRef(null);
  const [days, setDays] = useState(() => initialDays(new Date(), 90));
  
  // Track visible month for header
  const [visibleMonth, setVisibleMonth] = useState(format(new Date(), 'yyyy-MM'));

  // prepare entries
  const [entries, setEntries] = useState([]);
  useEffect(() => {
    const parsed = rawData
      .map((e, idx) => {
        const d = parseDDMMYYYY(e.date);
        return { ...e, _parsed: d, _iso: isoYMD(d), _id: idx };
      })
      .sort((a, b) => a._parsed - b._parsed);
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

  // Track scroll position to update visible month
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function updateVisibleMonth() {
      const { scrollTop, clientHeight } = el;
      const viewportCenter = scrollTop + clientHeight / 2;
      
      // Find which day is in the center of viewport
      const dayElements = el.querySelectorAll('.day-cell');
      let centerDay = null;
      
      dayElements.forEach((dayEl) => {
        const rect = dayEl.getBoundingClientRect();
        const elementTop = rect.top + scrollTop;
        const elementBottom = elementTop + rect.height;
        
        if (elementTop <= viewportCenter && elementBottom >= viewportCenter) {
          const dateStr = dayEl.getAttribute('data-date');
          if (dateStr) {
            centerDay = new Date(dateStr);
          }
        }
      });
      
      if (centerDay) {
        const monthId = format(centerDay, 'yyyy-MM');
        setVisibleMonth(monthId);
      }
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const { scrollTop, clientHeight, scrollHeight } = el;
        
        // Update visible month
        updateVisibleMonth();

        // Extend days when near edges
        if (scrollTop < 300) {
          const first = days[0];
          const toAdd = [];
          // Add complete weeks (7 days at a time)
          for (let i = 21; i >= 1; i--) {
            toAdd.push(subDays(first, i));
          }
          const prevHeight = el.scrollHeight;
          setDays((prev) => [...toAdd, ...prev]);
          requestAnimationFrame(() => {
            const delta = el.scrollHeight - prevHeight;
            el.scrollTop = scrollTop + delta;
          });
        }

        if (scrollTop + clientHeight > scrollHeight - 300) {
          const last = days[days.length - 1];
          const toAdd = [];
          // Add complete weeks (7 days at a time)
          for (let i = 1; i <= 21; i++) {
            toAdd.push(addDays(last, i));
          }
          setDays((prev) => [...prev, ...toAdd]);
        }

        ticking = false;
      });
    }

    el.addEventListener("scroll", onScroll, { passive: true });
    
    // Initial month detection
    updateVisibleMonth();
    
    return () => el.removeEventListener("scroll", onScroll);
  }, [days]);

  // open modal
  function openEntry(entry) {
    const idx = entries.findIndex((e) => e._id === entry._id);
    if (idx >= 0) setModalIndex(idx);
  }

  function closeModal() {
    setModalIndex(null);
  }

  return (
    <div>
      <Header monthId={visibleMonth} />

      <div ref={containerRef} className="calendar-wrap">
        <div className="continuous-calendar-grid">
          {days.map((d) => {
            const iso = isoYMD(d);
            const list = entriesByIso[iso] || [];
            return (
              <DayCell
                key={iso}
                date={d}
                inMonth={true}
                entries={list}
                onOpenEntry={openEntry}
              />
            );
          })}
        </div>
      </div>

      <button className="fab" title="Add" aria-label="Add">
        ＋
      </button>

      {modalIndex !== null && (
        <EntryModal
          entries={entries}
          initialIndex={modalIndex}
          onClose={closeModal}
        />
      )}
    </div>
  );
}