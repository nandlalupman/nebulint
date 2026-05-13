import Link from "next/link";
import { ArrowRight, BrainCircuit, Cpu, Database, Eye, Network, Workflow } from "lucide-react";
import { NebulintLogo } from "../components/NebulintLogo";
import { ThemeToggle } from "../components/ThemeToggle";

const services = [
  ["AI Development", "Custom models, intelligent software, decision systems, agentic workflows, and product-grade AI features.", BrainCircuit],
  ["Computer Vision", "Detection, tracking, segmentation, industrial monitoring, edge analytics, and video intelligence.", Eye],
  ["Robotics Software", "ROS integrations, control interfaces, telemetry systems, autonomy layers, and command dashboards.", Cpu],
  ["AI Automation", "Operations automation, workflow routing, alerting, review systems, and human-in-the-loop tools.", Workflow],
  ["Backend Infrastructure", "APIs, streaming systems, queues, databases, security boundaries, and deployment automation.", Database],
  ["Monitoring Platforms", "Real-time dashboards, observability, predictive analytics, infrastructure maps, and alert pipelines.", Network]
] as const;

function ServicesHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="NEBULINT home">
        <NebulintLogo />
      </Link>
      <nav aria-label="Services navigation">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/#products">Products</Link>
        <Link href="/#architecture">Architecture</Link>
        <Link href="/#operations">Operations</Link>
      </nav>
      <div className="header-actions">
        <ThemeToggle />
        <Link href="/contact" className="nav-cta contact-nav-cta">Contact <ArrowRight size={14} /></Link>
      </div>
    </header>
  );
}

export default function ServicesPage() {
  return (
    <>
      <ServicesHeader />
      <main>
        <section className="services-hero">
          <div className="ambient-grid" />
          <div className="eyebrow"><span /> AI Development Company</div>
          <h1>AI SYSTEMS ENGINEERING FOR REAL OPERATIONS.</h1>
          <p>
            NEBULINT builds custom AI software, robotics interfaces, computer vision systems, automation
            platforms, and backend infrastructure for companies that need production-grade intelligence.
          </p>
          <div className="hero-actions">
            <Link href="/contact" className="button primary">Start a Project <ArrowRight size={17} /></Link>
            <Link href="/#architecture" className="button secondary">View Architecture</Link>
          </div>
        </section>

        <section className="services-grid-section">
          <div className="section-head">
            <div className="eyebrow"><span /> Services</div>
            <h2>FROM MODEL RESEARCH TO DEPLOYED INFRASTRUCTURE.</h2>
          </div>
          <div className="services-grid">
            {services.map(([title, text, Icon], index) => (
              <article className="service-card" key={title}>
                <span>0{index + 1}</span>
                <Icon size={24} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="delivery-section">
          <div>
            <div className="eyebrow"><span /> Delivery Model</div>
            <h2>TECHNICAL WORK THAT CAN SURVIVE PRODUCTION.</h2>
          </div>
          <p>
            Every engagement is structured around measurable system behavior: latency, reliability,
            deployment path, data quality, security, monitoring, and maintainability. We design the model,
            the backend, the operator experience, and the infrastructure together.
          </p>
        </section>
      </main>
    </>
  );
}
