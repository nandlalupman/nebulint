import Link from "next/link";
import { ArrowRight, CheckCircle2, Cpu, FlaskConical, GraduationCap, Send } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";

const roles = [
  "Computer Vision Engineer",
  "Robotics Systems Engineer",
  "AI/ML Engineer",
  "Full Stack Platform Engineer",
  "Research Engineer",
  "Backend Systems Engineer"
];

const projects = [
  "Build object detection pipelines for industrial environments",
  "Prototype robotics interfaces with ROS-compatible control loops",
  "Ship monitoring dashboards for live AI infrastructure",
  "Design backend services for real-time data processing",
  "Evaluate models, datasets, latency, and deployment behavior"
];

export default function CareersPage() {
  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="NEBULINT home">
          <span className="brand-mark" />
          NEBULINT
        </Link>
        <nav aria-label="Careers navigation">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/#architecture">Architecture</Link>
          <Link href="/#operations">Operations</Link>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <Link href="/contact" className="nav-cta contact-nav-cta">Contact <ArrowRight size={14} /></Link>
        </div>
      </header>

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
                <article key={role}>
                  <Cpu size={18} />
                  <span>{role}</span>
                  <ArrowRight size={15} />
                </article>
              ))}
            </div>
          </div>

          <form className="application-form">
            <div>
              <h2>Talent Profile</h2>
              <p>Share your engineering focus, project history, and the systems you want to build.</p>
            </div>
            <label>
              Full name
              <input name="name" placeholder="Your name" />
            </label>
            <label>
              Email
              <input name="email" type="email" placeholder="you@example.com" />
            </label>
            <label>
              Role interest
              <select name="role" defaultValue="">
                <option value="" disabled>Select a role</option>
                {roles.map((role) => <option key={role}>{role}</option>)}
              </select>
            </label>
            <label>
              Portfolio / GitHub
              <input name="portfolio" placeholder="https://" />
            </label>
            <label>
              Engineering statement
              <textarea name="statement" placeholder="Tell us about systems, models, robotics, or infrastructure you have built." />
            </label>
            <button type="submit" className="button primary">Submit Profile <Send size={16} /></button>
          </form>
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
