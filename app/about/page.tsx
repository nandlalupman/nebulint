import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, Cpu, Eye, Network, ShieldCheck, Workflow } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";

const principles = [
  ["Engineering Depth", "We design AI systems as infrastructure: models, APIs, data pipelines, observability, deployment, and operator experience."],
  ["Operational Reality", "Our work is grounded in production constraints like latency, reliability, security, maintainability, and field deployment."],
  ["Applied Intelligence", "We focus on useful intelligence systems: automation, monitoring, computer vision, robotics interfaces, and backend platforms."],
  ["Research Discipline", "R&D is connected to measurable behavior, not demos. Experiments must be explainable, testable, and deployable."]
];

const focus = [
  ["AI Software", Cpu],
  ["Computer Vision", Eye],
  ["Robotics Platforms", Workflow],
  ["Monitoring Systems", Network],
  ["Secure Infrastructure", ShieldCheck],
  ["Bengaluru Office", Building2]
] as const;

function AboutHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="NEBULINT home">
        <span className="brand-mark" />
        NEBULINT
      </Link>
      <nav aria-label="About navigation">
        <Link href="/services">Services</Link>
        <Link href="/#products">Products</Link>
        <Link href="/#architecture">Architecture</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/careers">Careers</Link>
      </nav>
      <div className="header-actions">
        <ThemeToggle />
        <Link href="/" className="nav-cta"><ArrowLeft size={14} /> Home</Link>
      </div>
    </header>
  );
}

export default function AboutPage() {
  return (
    <>
      <AboutHeader />
      <main>
        <section className="about-hero">
          <div className="ambient-grid" />
          <div className="eyebrow"><span /> About NEBULINT</div>
          <h1>ENGINEERING INTELLIGENT INFRASTRUCTURE FROM BENGALURU.</h1>
          <p>
            NEBULINT is an engineering-first AI development company building software systems for computer vision,
            robotics, automation, monitoring, backend infrastructure, and real-world operational intelligence.
          </p>
          <div className="hero-actions">
            <Link href="/services" className="button primary">View Services <ArrowRight size={17} /></Link>
            <Link href="/contact" className="button secondary">Contact Office</Link>
          </div>
        </section>

        <section className="about-manifesto">
          <div>
            <div className="eyebrow"><span /> Company Position</div>
            <h2>WE BUILD SYSTEMS, NOT AI THEATER.</h2>
          </div>
          <p>
            Our work combines model development, backend architecture, data processing, computer vision,
            robotics communication, and operational dashboards into complete deployable systems. The goal is
            intelligence that works inside real organizations, not isolated prototypes.
          </p>
        </section>

        <section className="about-principles">
          {principles.map(([title, text], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </section>

        <section className="about-focus">
          <div className="section-head">
            <div className="eyebrow"><span /> What We Build</div>
            <h2>AI DEVELOPMENT ACROSS SOFTWARE, VISION, ROBOTICS, AND INFRASTRUCTURE.</h2>
          </div>
          <div className="about-focus-grid">
            {focus.map(([item, Icon]) => (
              <article key={item}>
                <Icon size={22} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="office-section">
          <div>
            <div className="eyebrow"><span /> Office</div>
            <h2>OUR ONLY OFFICE.</h2>
          </div>
          <address>
            4th Floor SR Bharath Apartments<br />
            3rd Main Road, HAL 3rd Stage<br />
            Bengaluru - 560075
          </address>
        </section>
      </main>
    </>
  );
}
