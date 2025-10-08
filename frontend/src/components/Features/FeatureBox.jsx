import React from "react";
import { FeaturePill } from "./FeaturePill";

function chunk3or4(items) {
  const n = items.length;
  const rows = [];
  let rest = [...items];

  if (n <= 4) {
    rows.push(rest.splice(0, Math.max(3, n)));
    return rows;
  }

  while (rest.length > 0) {
    const remaining = rest.length;

    if (remaining === 5) {
      rows.push(rest.splice(0, 3));
      rows.push(rest.splice(0, 2));
    } else if (remaining === 6) {
      rows.push(rest.splice(0, 3));
      rows.push(rest.splice(0, 3));
    } else if (remaining === 7) {
      rows.push(rest.splice(0, 4));
      rows.push(rest.splice(0, 3));
    } else if (remaining === 1 || remaining === 2) {
      const last = rows.pop() || [];
      const toMakeThree = 3 - remaining;
      const moved = last.splice(last.length - toMakeThree, toMakeThree);
      rows.push(last);
      rows.push([...moved, ...rest.splice(0, remaining)]);
    } else {
      rows.push(rest.splice(0, 4));
    }
  }

  return rows.filter((r) => r.length);
}

export default function FeaturesBox({ items }) {
  const rows = chunk3or4(items);

  return (
    <div className="mt-4 rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Mobile version: horizontal scroll */}
      <div className="block md:hidden overflow-x-auto">
        <div className="flex gap-3 px-3 py-3 min-w-fit">
          {items.map((it, i) => (
            <div
              key={i}
              className="min-w-[120px] px-4 py-2 border border-gray-200 rounded-lg"
            >
              <p className="text-[10px] uppercase tracking-wide text-gray-500">
                {it.label}
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {it.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop version: table layout */}
      <div className="hidden md:table w-full border-collapse">
        {rows.map((row, rIdx) => (
          <div key={rIdx} className="table-row">
            {row.map((it, cIdx) => (
              <FeaturePill
                key={`${rIdx}-${cIdx}`}
                label={it.label}
                value={it.value}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
