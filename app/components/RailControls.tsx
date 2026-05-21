"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type RailControlsProps = {
  label: string;
  targetId: string;
};

export function RailControls({ label, targetId }: RailControlsProps) {
  function move(direction: "left" | "right") {
    const rail = document.getElementById(targetId);
    if (!rail) return;
    const distance = Math.max(320, rail.clientWidth * 0.82);
    rail.scrollBy({ left: direction === "right" ? distance : -distance, behavior: "smooth" });
  }

  return (
    <div className="rail-controls" aria-label={`${label} carousel controls`}>
      <button type="button" aria-label={`Previous ${label}`} onClick={() => move("left")}>
        <ChevronLeft size={18} />
      </button>
      <button type="button" aria-label={`Next ${label}`} onClick={() => move("right")}>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
