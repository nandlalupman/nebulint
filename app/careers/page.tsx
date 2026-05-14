import Link from "next/link";
import { ArrowRight, CheckCircle2, Cpu, FlaskConical, GraduationCap } from "lucide-react";
import { getOpenRoles } from "../../lib/content";
import { CareerForm } from "../components/CareerForm";
import { HeaderNav } from "../components/HeaderNav";
import { NebulintLogo } from "../components/NebulintLogo";
import { PageStatusBar } from "../components/PageStatusBar";
import { ThemeToggle } from "../components/ThemeToggle";

const projects = [
  "Build object detection pipelines for industrial environments",
  "Prototype robotics interfaces with ROS-compatible control loops",
  "Ship monitoring dashboards for live AI infrastructure",
  "Design backend services for real-time data processing",
  "Evaluate models, datasets, latency, and deployment behavior"
];

export default async function CareersPage() {
  const roles = await getOpenRoles();

  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="NEBULINT home">
          <NebulintLogo />
        </Link>
        <HeaderNav />
        <div className="header-actions">
          <ThemeToggle />
          <Link href="/contact" className="nav-cta contact-nav-cta">Contact <ArrowRight size={14} /></Link>
        </div>
      </header>

      <PageStatusBar />
      <main>
        <section className="careers-hero">
          <div className="ambient-grid" />
          <div className="eyebrow"><span /> Careers</div>
          <h1>JOIN THE NEXT GENERATION OF ENGINEERS.</h1>
          <p>Build intelligent systems for real-world operations with a selective engineering team.</p>
        </section>

        <section className="careers-layout">
          <div className="roles-panel">
            <div className="eyebrow"><span /> Engineering Tracks</div>
            <div className="role-list">
              {roles.map((role) => (
                <article key={role.id || role.title}>
                  <Cpu size={18} />
                  <span>{role.title}</span>
                  <ArrowRight size={15} />
                </article>
              ))}
            </div>
          </div>

          <CareerForm roles={roles} />
        </section>

        <section className="internship-info">
          <article>
            <GraduationCap size={22} />
            <h2>Technical Requirements</h2>
            <p>Strong fundamentals in programming, systems thinking, data structures, APIs, ML workflows, computer vision, robotics, or cloud infrastructure.</p>
          </article>
          <article>
            <FlaskConical size={22} />
            <h2>Expected Projects</h2>
            {projects.map((project) => <p key={project}><CheckCircle2 size={15} /> {project}</p>)}
          </article>
          <article>
            <Cpu size={22} />
            <h2>Mentorship Structure</h2>
            <p>Engineers work with technical leads through scoped system reviews, research sessions, architecture critiques, and deployment-focused feedback.</p>
          </article>
        </section>

        <section className="culture-section">
          <div>
            <div className="eyebrow"><span /> Engineering Culture</div>
            <h2>SELECTIVE, PRACTICAL, RESEARCH-DRIVEN.</h2>
          </div>
          <p>
            The team is designed for builders who care about real systems: observability, robustness,
            documentation, reproducibility, latency, and the discipline required to move from experiment
            to infrastructure.
          </p>
        </section>
      </main>
    </>
  );
}
