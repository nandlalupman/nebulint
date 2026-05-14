import { isSupabaseConfigured, listRows, type OpenRole, type WorkItem } from "./supabase/rest";

export const fallbackRoles: OpenRole[] = [
  {
    title: "Computer Vision Engineer",
    summary: "Detection, tracking, segmentation, edge analytics, and industrial monitoring systems.",
    department: "Applied AI",
    location: "Remote / Hybrid",
    type: "Engineering"
  },
  {
    title: "Robotics Systems Engineer",
    summary: "ROS-compatible control layers, telemetry loops, robotics dashboards, and autonomy interfaces.",
    department: "Robotics",
    location: "Remote / Hybrid",
    type: "Engineering"
  },
  {
    title: "AI/ML Engineer",
    summary: "Model evaluation, inference services, data pipelines, and production ML infrastructure.",
    department: "Machine Learning",
    location: "Remote / Hybrid",
    type: "Engineering"
  },
  {
    title: "Full Stack Platform Engineer",
    summary: "Operational dashboards, product workflows, admin systems, APIs, and real-time interfaces.",
    department: "Platform",
    location: "Remote / Hybrid",
    type: "Engineering"
  },
  {
    title: "Research Engineer",
    summary: "Applied experimentation with measurable reliability, latency, and deployment outcomes.",
    department: "R&D",
    location: "Remote / Hybrid",
    type: "Research"
  },
  {
    title: "Backend Systems Engineer",
    summary: "APIs, queues, databases, observability, deployment automation, and secure service boundaries.",
    department: "Infrastructure",
    location: "Remote / Hybrid",
    type: "Engineering"
  }
];

export const fallbackWorks: WorkItem[] = [
  {
    title: "Autonomous Monitoring Platform",
    summary: "Live infrastructure telemetry, model-backed anomaly detection, alerting, and operator dashboards.",
    category: "Operations"
  },
  {
    title: "Industrial Vision Intelligence",
    summary: "Computer vision pipelines for detection, tracking, inspection, and real-time facility analytics.",
    category: "Computer Vision"
  },
  {
    title: "Robotics Command Interface",
    summary: "ROS-compatible control surfaces, fleet telemetry, safety states, and hardware-system communication.",
    category: "Robotics"
  },
  {
    title: "Predictive Infrastructure Engine",
    summary: "Forecasting, queue health, capacity signals, automated escalation, and reliability analytics.",
    category: "Infrastructure"
  },
  {
    title: "AI Surveillance System",
    summary: "Edge AI monitoring, event routing, security review workflows, and visual intelligence overlays.",
    category: "AI Security"
  },
  {
    title: "Real-Time Analytics Network",
    summary: "Streaming data architecture, live dashboards, data quality checks, and distributed processing.",
    category: "Data Systems"
  },
  {
    title: "Smart Factory Intelligence Platform",
    summary: "Machine-state monitoring, production insights, robotics coordination, and automation triggers.",
    category: "Industrial AI"
  }
];

export async function getOpenRoles() {
  if (!isSupabaseConfigured()) return fallbackRoles;

  try {
    const roles = await listRows<OpenRole>(
      "open_roles",
      "select=*&is_active=eq.true&order=sort_order.asc.nullslast,title.asc"
    );
    return roles.length ? roles : fallbackRoles;
  } catch {
    return fallbackRoles;
  }
}

export async function getCaseStudies() {
  if (!isSupabaseConfigured()) return fallbackWorks;

  try {
    const works = await listRows<WorkItem>(
      "case_studies",
      "select=*&is_active=eq.true&order=sort_order.asc.nullslast,title.asc"
    );
    return works.length ? works : fallbackWorks;
  } catch {
    return fallbackWorks;
  }
}
