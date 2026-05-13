"use client";

import { Activity, Cpu, Eye, Network } from "lucide-react";
import { useMemo, useState } from "react";

const modes = {
  Infrastructure: {
    icon: Network,
    bars: [54, 82, 68, 112, 94, 74, 130, 88, 104, 76, 118, 96, 64, 142, 110, 84, 124, 92],
    rows: ["Cluster health", "Queue depth", "API latency", "Edge nodes", "Storage IO"],
    headline: "99.98%"
  },
  Vision: {
    icon: Eye,
    bars: [88, 72, 124, 102, 66, 114, 138, 90, 116, 130, 74, 96, 108, 144, 82, 120, 100, 132],
    rows: ["Detection stream", "Tracking quality", "Frame ingestion", "Model drift", "Review queue"],
    headline: "41 FPS"
  },
  Robotics: {
    icon: Cpu,
    bars: [62, 94, 128, 76, 112, 86, 142, 104, 72, 118, 96, 134, 80, 108, 146, 92, 124, 100],
    rows: ["ROS bridge", "Path planning", "Motor control", "Fleet state", "Safety channel"],
    headline: "7 FLEETS"
  }
};

type Mode = keyof typeof modes;

export function InteractiveOperations() {
  const [mode, setMode] = useState<Mode>("Infrastructure");
  const [selected, setSelected] = useState(5);
  const current = modes[mode];
  const Icon = current.icon;

  const rows = useMemo(
    () => current.rows.map((row, index) => ({ row, value: ["OK", "LIVE", "12ms", "SYNC", "CLEAR"][index] })),
    [current.rows]
  );

  return (
    <div className="ops-dashboard interactive-ops">
      <div className="ops-main">
        <div className="dashboard-header">
          <span>{mode} Monitoring</span>
          <span>LIVE</span>
        </div>
        <div className="ops-mode-row" aria-label="Operations dashboard modes">
          {(Object.keys(modes) as Mode[]).map((item) => (
            <button type="button" aria-label={`Show ${item} operations`} className={item === mode ? "active" : ""} onClick={() => { setMode(item); setSelected(5); }} key={item}>
              {item}
            </button>
          ))}
        </div>
        <div className="ops-kpi">
          <Icon size={22} />
          <div>
            <span>Current Signal</span>
            <strong>{current.headline}</strong>
          </div>
        </div>
        <div className="sample-readout">
          <span>Selected sample</span>
          <strong>{current.bars[selected] ?? current.bars[0]}%</strong>
          <small>{mode.toLowerCase()} stream / node {selected + 1}</small>
        </div>
        <div className="chart-lines interactive-chart">
          {current.bars.map((height, i) => (
            <button
              type="button"
              className={selected === i ? "active" : ""}
              key={`${mode}-${i}`}
              style={{ height: `${height}px` }}
              aria-label={`${mode} sample ${i + 1}`}
              onClick={() => setSelected(i)}
            />
          ))}
        </div>
      </div>
      <div className="ops-side">
        {rows.map(({ row, value }) => (
          <div className="ops-row" key={row}><Activity size={15} /> {row}<span>{value}</span></div>
        ))}
      </div>
    </div>
  );
}
