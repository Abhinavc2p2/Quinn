import { useEffect, useRef, useState } from "react";

/**
 * Observes elements with [data-month-id] inside containerRef and returns
 * the monthId (YYYY-MM) that currently has the highest intersectionRatio.
 *
 * Usage: const visibleId = useVisibleMonth(containerRef, months);
 * Pass months as dependency so observer rebinds when months change.
 */
export default function useVisibleMonth(containerRef, deps = []) {
  const [visibleId, setVisibleId] = useState(null);
  const ratios = useRef({});
  const observerRef = useRef(null);

  useEffect(
    () => {
      const root = containerRef.current || null;
      ratios.current = {};
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            const id = e.target.dataset.monthId;
            ratios.current[id] = e.intersectionRatio;
          });
          const items = Object.entries(ratios.current);
          if (items.length === 0) return;
          items.sort((a, b) => b[1] - a[1]);
          setVisibleId(items[0][0]);
        },
        { root, threshold: [0, 0.25, 0.5, 0.75, 1] }
      );

      const container = containerRef.current;
      if (!container) return;

      const nodes = container.querySelectorAll("[data-month-id]");
      nodes.forEach((n) => observerRef.current.observe(n));

      return () => observerRef.current && observerRef.current.disconnect();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    deps.length ? [containerRef, ...deps] : [containerRef]
  );

  return visibleId;
}
