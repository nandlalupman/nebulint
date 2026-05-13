"use client";

import { useState } from "react";

const layers = [
  { name: "Sensors", protocol: "MQTT", detail: "Industrial cameras, robotics telemetry, edge IO, and facility signals." },
  { name: "Data Acquisition", protocol: "Kafka", detail: "Stream ingestion, buffering, validation, and event normalization." },
  { name: "AI Processing Layer", protocol: "CUDA", detail: "GPU accelerated model execution, feature extraction, and scoring." },
  { name: "Computer Vision Models", protocol: "OpenCV", detail: "Detection, tracking, segmentation, and scene understanding." },
  { name: "Inference Engine", protocol: "FastAPI", detail: "Low-latency APIs for predictions, routing, and operator actions." },
  { name: "Cloud Infrastructure", protocol: "K8s", detail: "Container orchestration, observability, secrets, and deployment control." },
  { name: "Real-Time Dashboard", protocol: "WebSocket", detail: "Live system state, alerts, traces, and operational dashboards." },
  { name: "Alert & Automation", protocol: "Rules", detail: "Escalation policies, automation triggers, and workflow execution." }
];

export function InteractiveArchitecture() {
  const [active, setActive] = useState(2);

  return (
    <div className="architecture-flow interactive-flow">
      <div className="interactive-topline">
        <span>Layer Inspector</span>
        <strong>{layers[active].protocol}</strong>
      </div>
      {layers.map((layer, index) => (
        <button
          type="button"
          className={`flow-row flow-button ${active === index ? "active" : ""}`}
          key={layer.name}
          onClick={() => setActive(index)}
        >
          <span className="flow-index">0{index + 1}</span>
          <span className="flow-card">
            <span>{layer.name}</span>
            <small>{layer.protocol}</small>
          </span>
        </button>
      ))}
      <div className="layer-detail">
        <span>Selected Layer</span>
        <h3>{layers[active].name}</h3>
        <p>{layers[active].detail}</p>
      </div>
    </div>
  );
}
