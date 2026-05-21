import Link from "next/link";
import { getCaseStudies } from "../lib/content";
import { ThemeToggle } from "./components/ThemeToggle";

export const dynamic = "force-dynamic";
import { InteractiveArchitecture } from "./components/InteractiveArchitecture";
import { InteractiveOperations } from "./components/InteractiveOperations";
import { InteractiveSystemVisual } from "./components/InteractiveSystemVisual";
import { HeaderNav } from "./components/HeaderNav";
import { NebulintLogo } from "./components/NebulintLogo";
import { RailControls } from "./components/RailControls";
import {
  ArrowRight,
  Activity,
  Boxes,
  BrainCircuit,
  Cpu,
  Database,
  Eye,
  Factory,
  GitBranch,
  Lock,
  Network,
  Radio,
  Satellite,
  Server,
  Shield,
  Workflow
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const capabilities: Array<[string, string, LucideIcon, string]> = [
  ["Artificial Intelligence", "Decision models, orchestration, agentic workflows, and supervised automation for operational environments.", BrainCircuit, "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"],
  ["Computer Vision", "Detection, tracking, segmentation, facial mapping, edge analytics, and industrial monitoring pipelines.", Eye, "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=1200&q=80"],
  ["Robotics Systems", "Robotic control software, ROS integration, machine communication, and autonomous command layers.", Cpu, "https://images.unsplash.com/photo-1565689157206-0fddef7589a2?auto=format&fit=crop&w=1200&q=80"],
  ["ML Infrastructure", "Model registries, inference services, distributed training, observability, and deployment automation.", Server, "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80"],
  ["Autonomous Platforms", "Sensor fusion, planning logic, telemetry loops, fleet coordination, and real-time decision support.", Radio, "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80"],
  ["AI Automation", "Workflow automation, alerting, human-in-the-loop review, and intelligent software operations.", Workflow, "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"],
  ["Backend Systems", "Enterprise APIs, event streams, data planes, identity controls, and resilient service architectures.", Database, "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80"],
  ["Operational Intelligence", "Dashboards, live system state, predictive analytics, and executive-level monitoring.", Activity, "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80"],
  ["Distributed Cloud", "Hybrid cloud, edge compute, Kubernetes, message queues, and secure multi-site deployments.", Network, "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80"]
];

const stack = {
  "AI Runtime": ["Python", "PyTorch", "TensorFlow", "OpenCV"],
  "Robotics Control": ["ROS", "Edge IO", "Sensor Fusion", "Telemetry"],
  "Infrastructure": ["Docker", "Kubernetes", "AWS", "PostgreSQL"],
  "Operations Interfaces": ["Command UI", "WebGL Maps", "Dashboards", "Alerting"],
  "Backend Platform": ["FastAPI", "Redis", "Kafka", "Event Streams"]
};

const products = [
  {
    name: "Nebulint Core",
    type: "Infrastructure Platform",
    text: "A hardened backend layer for inference services, telemetry streams, model registries, and operator workflows.",
    stats: ["12ms P99", "480K req/s", "K8s native"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80"
  },
  {
    name: "VisionGrid",
    type: "Computer Vision System",
    text: "Industrial detection, tracking, smart surveillance, edge analytics, and visual event routing for live environments.",
    stats: ["41 fps", "Edge AI", "OpenCV"],
    image: "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?auto=format&fit=crop&w=1400&q=80"
  },
  {
    name: "Robotics Command",
    type: "Autonomy Interface",
    text: "Fleet coordination, ROS-compatible communication, control surfaces, and machine-state monitoring.",
    stats: ["ROS bus", "Live IO", "Path lock"],
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1400&q=80"
  },
  {
    name: "Ops Center",
    type: "Monitoring Platform",
    text: "Predictive analytics, anomaly alerts, distributed compute maps, and automation pipelines for infrastructure teams.",
    stats: ["24/7", "WebSocket", "SLA layer"],
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80"
  }
];

const researchPrograms = [
  {
    title: "Applied AI Systems",
    summary: "Model evaluation, inference workflows, and operational safeguards for production AI deployments.",
    detail: "Benchmarked on latency, failure modes, and human oversight"
  },
  {
    title: "Robotics R&D",
    summary: "Control interfaces, telemetry loops, and hardware-software coordination for autonomous platforms.",
    detail: "Designed for ROS, edge compute, and live operators"
  },
  {
    title: "Infrastructure Innovation",
    summary: "Event-driven backend systems, monitoring layers, and resilient deployment patterns.",
    detail: "Focused on observability, uptime, and secure service boundaries"
  },
  {
    title: "Autonomous Intelligence",
    summary: "Decision layers that connect sensors, models, and response workflows into one operating surface.",
    detail: "Built for explainability and deployment realism"
  }
];

const fallbackCaseStudies = [
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
    title: "Smart Factory Intelligence Platform",
    summary: "Machine-state monitoring, production insights, robotics coordination, and automation triggers.",
    category: "Industrial AI"
  },
  {
    title: "Real-Time Analytics Network",
    summary: "Streaming data architecture, live dashboards, data quality checks, and distributed processing.",
    category: "Data Systems"
  }
];

function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="NEBULINT home">
        <NebulintLogo />
      </Link>
      <HeaderNav />
      <div className="header-actions">
        <ThemeToggle />
        <Link href="/contact" className="nav-cta contact-nav-cta">
          Contact <ArrowRight size={14} />
        </Link>
      </div>
    </header>
  );
}

function SystemVisual() {
  return (
    <div className="system-visual" aria-label="Real-time infrastructure visualization">
      <div className="visual-topline">
        <span>NEBULINT OPS / LIVE SYSTEM MAP</span>
        <span className="live-dot">ACTIVE</span>
      </div>
      <div className="map-panel">
        <div className="node n1"><Server size={16} /> Core</div>
        <div className="node n2"><Eye size={16} /> Vision</div>
        <div className="node n3"><Radio size={16} /> Edge</div>
        <div className="node n4"><Factory size={16} /> Robotics</div>
        <div className="node n5"><Shield size={16} /> Security</div>
        <span className="link-line l1" />
        <span className="link-line l2" />
        <span className="link-line l3" />
        <span className="link-line l4" />
      </div>
      <div className="telemetry-grid">
        {["Inference", "Telemetry", "Vision", "Fleet", "Queue", "Alerts"].map((item, index) => (
          <div className="telemetry" key={item}>
            <span>{item}</span>
            <strong>{[12, 98, 41, 76, 204, 7][index]}{index === 0 ? "ms" : index === 1 ? "%" : ""}</strong>
          </div>
        ))}
      </div>
      <div className="signal-stack">
        {Array.from({ length: 22 }).map((_, index) => (
          <span key={index} style={{ height: `${18 + ((index * 17) % 58)}px` }} />
        ))}
      </div>
    </div>
  );
}

function ArchitectureFlow() {
  const layers = [
    "Sensors",
    "Data Acquisition",
    "AI Processing Layer",
    "Computer Vision Models",
    "Inference Engine",
    "Cloud Infrastructure",
    "Real-Time Dashboard",
    "Alert & Automation Systems"
  ];

  return (
    <div className="architecture-flow">
      {layers.map((layer, index) => (
        <div className="flow-row" key={layer}>
          <div className="flow-index">0{index + 1}</div>
          <div className="flow-card">
            <span>{layer}</span>
            <small>{["MQTT", "Kafka", "CUDA", "OpenCV", "FastAPI", "K8s", "WebSocket", "Rules"][index]}</small>
          </div>
        </div>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div>
          <div className="footer-logo"><NebulintLogo showTagline /></div>
          <p>Engineering intelligent systems for modern infrastructure.</p>
          <div className="footer-contact-strip">
            <Link href="/contact">Start a project</Link>
            <a href="mailto:contact@nebulint.com">contact@nebulint.com</a>
            <Link href="/services">AI development services</Link>
          </div>
        </div>
        <div className="footer-status">
          <span className="live-dot">ACTIVE</span>
          Global monitoring fabric online
        </div>
      </div>
      <div className="footer-command">
        <div>
          <span>Deployment Modes</span>
          <strong>Cloud / On-Prem / Edge</strong>
        </div>
        <div>
          <span>Core Work</span>
          <strong>AI, Vision, Robotics, Automation</strong>
        </div>
        <div>
          <span>Response</span>
          <strong>Engineering review within 1 business day</strong>
        </div>
        <div>
          <span>India Office</span>
          <strong>4th Floor SR Bharath Apartments, 3rd Main Road, HAL 3rd Stage, Bengaluru - 560075</strong>
        </div>
        <div>
          <span>Italy Office</span>
          <strong>Via Arenaccia, 29, 80141 Napoli NA, Italy</strong>
        </div>
      </div>
      <div className="footer-grid">
        <div>
          <h4>Systems</h4>
          <Link href="/services">Services</Link>
          <a href="#products">Products</a>
          <a href="#architecture">Architecture</a>
          <a href="#operations">Operations</a>
        </div>
        <div>
          <h4>Company</h4>
          <Link href="/about">About</Link>
          <a href="#research">Research</a>
          <Link href="/careers">Careers</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div>
          <h4>Network</h4>
          <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="mailto:research@nebulint.com">Research Desk</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>2026 NEBULINT. India: 4th Floor SR Bharath Apartments, 3rd Main Road, HAL 3rd Stage, Bengaluru - 560075. Italy: Via Arenaccia, 29, 80141 Napoli NA, Italy.</span>
        <span>Security / Reliability / Autonomy</span>
      </div>
    </footer>
  );
}

export default async function Home() {
  const cases = await getCaseStudies();

  return (
    <>
      <Header />
      <main>
        <section className="hero" id="top">
          <div className="ambient-grid" />
          <div className="hero-copy">
            <div className="eyebrow"><span /> Advanced Systems Engineering</div>
            <h1>ENGINEERING THE FUTURE OF INTELLIGENT SYSTEMS.</h1>
            <p>
              NEBULINT develops advanced AI infrastructure, robotics platforms, computer vision systems,
              and enterprise-scale operational technology for real-world environments.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="button primary">Start a Project <ArrowRight size={17} /></Link>
              <a href="#systems" className="button secondary">Explore Systems</a>
            </div>
          </div>
          <InteractiveSystemVisual />
        </section>

        <section className="metrics" aria-label="Platform metrics">
          {[
            ["99.98%", "Reliability"],
            ["24/7", "Monitoring"],
            ["Distributed", "Infrastructure"],
            ["Real-Time", "Processing"],
            ["Enterprise", "Security"],
            ["Autonomous", "Intelligence"]
          ].map(([value, label]) => (
            <div key={label}><strong>{value}</strong><span>{label}</span></div>
          ))}
        </section>

        <section className="client-access" aria-label="Client contact access">
          <div>
            <span>Client Intake</span>
            <h2>CONTACT NEBULINT FOR AI DEVELOPMENT, AUTOMATION, VISION, ROBOTICS, AND BACKEND SYSTEMS.</h2>
          </div>
          <p>
            Send a project brief and our engineering desk will review scope, architecture, deployment environment,
            and the fastest path to a production-ready system.
          </p>
          <Link href="/contact" className="button primary">Open Contact Page <ArrowRight size={17} /></Link>
        </section>

        <section className="split-section" id="systems">
          <div>
            <div className="eyebrow"><span /> Engineering First</div>
            <h2>AI PLATFORMS BUILT FOR OPERATIONAL SCALE.</h2>
          </div>
          <p>
            NEBULINT is structured around backend architecture, research-grade machine learning, robotics
            interfaces, and real-time data systems. We design intelligent infrastructure that connects
            sensors, models, operators, autonomous assets, and secure cloud environments into one hardened
            operational layer.
          </p>
        </section>

        <section className="product-section" id="products">
          <div className="product-head">
            <div>
              <div className="eyebrow"><span /> Product Systems</div>
              <h2>BUILT AS CONNECTED OPERATIONAL PLATFORMS.</h2>
            </div>
            <div>
              <p>Core platform modules designed to operate together across inference, telemetry, robotics, monitoring, and automation environments.</p>
              <RailControls label="products" targetId="product-rail" />
            </div>
          </div>
          <div className="product-rail" id="product-rail" aria-label="NEBULINT product systems">
            {products.map((product, index) => (
              <article className="product-card" key={product.name}>
                <div className="product-number">0{index + 1}</div>
                <div className="product-visual" style={{ backgroundImage: `linear-gradient(180deg, rgba(10,10,10,0.1), rgba(10,10,10,0.82)), url(${product.image})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                  <span className="product-core" />
                  <span className="product-ring r1" />
                  <span className="product-ring r2" />
                  <span className="product-line pl1" />
                  <span className="product-line pl2" />
                  <span className="product-line pl3" />
                </div>
                <div>
                  <span className="product-type">{product.type}</span>
                  <h3>{product.name}</h3>
                  <p>{product.text}</p>
                </div>
                <div className="product-stats">
                  {product.stats.map((stat) => <span key={stat}>{stat}</span>)}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="capabilities-section">
          <div className="section-head">
            <div className="eyebrow"><span /> Core Capabilities</div>
            <h2>PRECISION SOFTWARE FOR ADVANCED SYSTEMS.</h2>
            <RailControls label="capabilities" targetId="capability-rail" />
          </div>
          <div className="capability-grid" id="capability-rail">
            {capabilities.map(([title, text, Icon, image]) => (
              <article className="capability-card" key={String(title)}>
                <div className="card-visual" style={{ backgroundImage: `linear-gradient(180deg, rgba(10,10,10,0.08), rgba(10,10,10,0.72)), url(${image})` }}>
                  <Icon size={22} />
                  <span />
                  <span />
                  <span />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="architecture-section" id="architecture">
          <div className="architecture-copy">
            <div className="eyebrow"><span /> System Architecture</div>
            <h2>REAL-TIME SYSTEMS. AUTONOMOUS INTELLIGENCE.</h2>
            <p>
              A layered backend model for ingesting live signals, routing data through AI processing,
              executing inference, and surfacing decisions to operational dashboards and automation systems.
            </p>
            <div className="architecture-tags">
              <span>Event Streams</span><span>Inference APIs</span><span>Model Registry</span><span>Edge Runtime</span>
            </div>
          </div>
          <InteractiveArchitecture />
        </section>

        <section className="image-band vision">
          <div className="band-content">
            <div className="eyebrow"><span /> Computer Vision</div>
            <h2>INDUSTRIAL PERCEPTION FOR LIVE ENVIRONMENTS.</h2>
            <p>
              Object detection, smart surveillance, edge AI systems, tracking overlays, facial mapping,
              and analytics pipelines designed for high-volume operational monitoring.
            </p>
          </div>
          <div className="overlay-ui detection">
            <span className="box b1">ASSET 04</span>
            <span className="box b2">PERSONNEL</span>
            <span className="box b3">VEHICLE</span>
          </div>
        </section>

        <section className="robotics-section">
          <div className="robotics-panel">
            <div className="eyebrow"><span /> Robotics</div>
            <h2>CONTROL LAYERS FOR INDUSTRIAL AUTONOMY.</h2>
            <p>
              Robotics dashboards, machine communication, autonomous control, manufacturing intelligence,
              and hardware-system interaction for assets operating beyond the browser.
            </p>
          </div>
          <div className="robot-arm">
            <span className="joint j1" /><span className="joint j2" /><span className="joint j3" />
            <span className="arm a1" /><span className="arm a2" /><span className="arm a3" />
            <div className="robot-readout">
              <strong>ROS BUS</strong>
              <small>motor.ctrl: nominal</small>
              <small>vision.sync: 41 fps</small>
              <small>path.plan: locked</small>
            </div>
          </div>
        </section>

        <section className="ops-section" id="operations">
          <div className="section-head">
            <div className="eyebrow"><span /> AI Operations Center</div>
            <h2>MISSION-CRITICAL INFRASTRUCTURE SOFTWARE.</h2>
          </div>
          <InteractiveOperations />
        </section>

        <section className="research-section" id="research">
          <div>
            <div className="eyebrow"><span /> Research & Development</div>
            <h2>EXPERIMENTATION LABS FOR FUTURE INTELLIGENCE.</h2>
          </div>
          <div className="research-grid">
            {researchPrograms.map((item) => (
              <article key={item.title}>
                <GitBranch size={20} />
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <small>{item.detail}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="case-section">
          <div className="section-head">
            <div className="eyebrow"><span /> Case Studies</div>
            <h2>ENTERPRISE DEPLOYMENTS, DESIGNED AS SYSTEMS.</h2>
          </div>
          <div className="case-grid">
            {(cases.length ? cases : fallbackCaseStudies).map((item, index) => (
              <article key={"id" in item ? item.id || item.title : item.title} className="case-card">
                <span>{String(index + 1).padStart(2, "0")}</span>
                {"category" in item && item.category ? <small>{item.category}</small> : null}
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="stack-section">
          <div className="section-head">
            <div className="eyebrow"><span /> Engineering Stack</div>
            <h2>INFRASTRUCTURE USED TO BUILD CLIENT SYSTEMS.</h2>
          </div>
          <div className="stack-layout">
            <div className="stack-console">
              <span>NEBULINT BUILD MATRIX</span>
              <strong>From model runtime to operational deployment.</strong>
              <div className="stack-pipeline">
                <i>Data</i><i>Models</i><i>APIs</i><i>Queues</i><i>Dashboards</i><i>Deploy</i>
              </div>
            </div>
            <div className="stack-grid">
              {Object.entries(stack).map(([group, items]) => (
                <div className="stack-card" key={group}>
                  <h3>{group}</h3>
                  {items.map((item) => <span key={item}>{item}</span>)}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div className="cta-copy">
            <div className="eyebrow"><span /> Engage NEBULINT</div>
            <h2>BUILD THE NEXT GENERATION OF INTELLIGENT INFRASTRUCTURE.</h2>
          </div>
          <div className="cta-panel">
            <p>Bring us a system problem: AI product development, computer vision, robotics software, automation, backend infrastructure, or monitoring platforms.</p>
            <div className="cta-actions">
              <Link href="/contact" className="button primary">Start a Project <Boxes size={17} /></Link>
              <Link href="/careers" className="button secondary">Explore Careers <ArrowRight size={17} /></Link>
            </div>
            <div className="cta-mini-grid">
              <span>Discovery</span><span>Architecture</span><span>Prototype</span><span>Deployment</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
