"use client";

import { Eye, Factory, Radio, Server, Shield } from "lucide-react";
import { useMemo, useState } from "react";

const modes = {
  Infrastructure: {
    values: [12, 98, 41, 76, 204, 7],
    labels: ["Inference", "Telemetry", "Vision", "Fleet", "Queue", "Alerts"],
    bars: [28, 64, 42, 72, 56, 36, 84, 62, 48, 76, 52, 88, 44, 66, 58, 92, 70, 50, 82, 60, 74, 54]
  },
  Vision: {
    values: [18, 94, 63, 42, 118, 11],
    labels: ["Latency", "Confidence", "Frames", "Tracks", "Events", "Reviews"],
    bars: [52, 78, 86, 64, 92, 74, 58, 88, 96, 70, 84, 62, 100, 76, 90, 68, 82, 104, 72, 94, 66, 80]
  },
  Robotics: {
    values: [9, 87, 34, 12, 56, 3],
    labels: ["Loop", "Sync", "Motors", "Fleet", "Routes", "Faults"],
    bars: [40, 72, 58, 96, 66, 84, 52, 100, 74, 62, 90, 68, 108, 76, 86, 54, 92, 64, 80, 70, 98, 60]
  }
};

type Mode = keyof typeof modes;

export function InteractiveSystemVisual() {
  const [mode, setMode] = useState<Mode>("Infrastructure");
  const [selected, setSelected] = useState(6);
  const current = modes[mode];

  const selectedSignal = useMemo(() => current.bars[selected] ?? current.bars[0], [current.bars, selected]);
  const selectedLabel = current.labels[selected % current.labels.length];

  return (
    <div className="system-visual" aria-label="Interactive real-time infrastructure visualization">
      <div className="visual-topline">
        <span>NEBULINT OPS / LIVE SYSTEM MAP</span>
        <span className="live-dot">ACTIVE</span>
      </div>
      <div className="visual-mode-row" aria-label="Hero visualization modes">
        {(Object.keys(modes) as Mode[]).map((item) => (
          <button type="button" className={mode === item ? "active" : ""} onClick={() => { setMode(item); setSelected(6); }} key={item}>
            {item}
          </button>
        ))}
      </div>
      <div className="map-panel">
        <button type="button" className="node n1"><Server size={16} /> Core</button>
        <button type="button" className="node n2"><Eye size={16} /> Vision</button>
        <button type="button" className="node n3"><Radio size={16} /> Edge</button>
        <button type="button" className="node n4"><Factory size={16} /> Robotics</button>
        <button type="button" className="node n5"><Shield size={16} /> Security</button>
        <span className="link-line l1" />
        <span className="link-line l2" />
        <span className="link-line l3" />
        <span className="link-line l4" />
      </div>
      <div className="telemetry-grid">
        {current.labels.map((item, index) => (
          <button type="button" className="telemetry" key={item} onClick={() => setSelected((index * 3) % current.bars.length)}>
            <span>{item}</span>
            <strong>{current.values[index]}{index === 0 ? "ms" : index === 1 ? "%" : ""}</strong>
          </button>
        ))}
      </div>
      <div className="signal-readout">
        <span>{mode} signal</span>
        <strong>{selectedSignal}%</strong>
      </div>
      <div className="signal-detail" aria-live="polite">
        <span>Selected graph bar</span>
        <strong>Sample {String(selected + 1).padStart(2, "0")} / {selectedLabel}</strong>
        <small>{selectedSignal >= 88 ? "High load detected" : selectedSignal >= 64 ? "Nominal processing range" : "Low activity interval"}</small>
      </div>
      <div className="signal-stack">
        {current.bars.map((height, index) => (
          <button
            type="button"
            className={selected === index ? "active" : ""}
            aria-label={`${mode} signal sample ${index + 1}`}
            key={`${mode}-${index}`}
            style={{ height: `${height}px` }}
            onClick={() => setSelected(index)}
          />
        ))}
      </div>
    </div>
  );
}
