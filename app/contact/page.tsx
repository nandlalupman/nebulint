import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, Clock, Mail, Send, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";

const projectTypes = [
  "Custom AI Development",
  "Computer Vision System",
  "Robotics Platform",
  "AI Automation",
  "Monitoring Dashboard",
  "Backend Infrastructure"
];

function ContactHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="NEBULINT home">
        <span className="brand-mark" />
        NEBULINT
      </Link>
      <nav aria-label="Contact navigation">
        <Link href="/services">Services</Link>
        <Link href="/#products">Products</Link>
        <Link href="/#architecture">Architecture</Link>
        <Link href="/careers">Careers</Link>
      </nav>
      <div className="header-actions">
        <ThemeToggle />
        <Link href="/" className="nav-cta"><ArrowLeft size={14} /> Home</Link>
      </div>
    </header>
  );
}

export default function ContactPage() {
  return (
    <>
      <ContactHeader />
      <main>
        <section className="contact-hero">
          <div className="ambient-grid" />
          <div className="eyebrow"><span /> Client Contact</div>
          <h1>START A SYSTEMS ENGINEERING CONVERSATION.</h1>
          <p>
            Contact NEBULINT for AI development, computer vision, robotics software, intelligent automation,
            monitoring platforms, and enterprise backend infrastructure.
          </p>
        </section>

        <section className="contact-layout">
          <div className="contact-intel">
            <article>
              <Mail size={21} />
              <h3>Direct Engineering Desk</h3>
              <a href="mailto:contact@nebulint.com">contact@nebulint.com</a>
            </article>
            <article>
              <Clock size={21} />
              <h3>Response Window</h3>
              <p>Qualified project inquiries are reviewed within one business day.</p>
            </article>
            <article>
              <ShieldCheck size={21} />
              <h3>Engagement Model</h3>
              <p>Discovery, architecture review, scoped delivery plan, deployment, and operational support.</p>
            </article>
            <article>
              <Building2 size={21} />
              <h3>Best Fit</h3>
              <p>Enterprise teams, industrial operators, research groups, robotics builders, and software organizations.</p>
            </article>
          </div>

          <form className="contact-form">
            <div>
              <h2>Project Inquiry</h2>
              <p>Tell us what you are building. The more technical context you share, the faster we can route it.</p>
            </div>
            <label>
              Name
              <input name="name" placeholder="Your name" />
            </label>
            <label>
              Work email
              <input name="email" type="email" placeholder="name@company.com" />
            </label>
            <label>
              Company
              <input name="company" placeholder="Company / organization" />
            </label>
            <label>
              Project type
              <select name="projectType" defaultValue="">
                <option value="" disabled>Select project type</option>
                {projectTypes.map((type) => <option key={type}>{type}</option>)}
              </select>
            </label>
            <div className="form-grid">
              <label>
                Timeline
                <select name="timeline" defaultValue="">
                  <option value="" disabled>Select timeline</option>
                  <option>Immediate evaluation</option>
                  <option>30-60 days</option>
                  <option>Quarter planning</option>
                  <option>Research phase</option>
                </select>
              </label>
              <label>
                Deployment environment
                <select name="environment" defaultValue="">
                  <option value="" disabled>Select environment</option>
                  <option>Cloud</option>
                  <option>On-prem</option>
                  <option>Edge / device</option>
                  <option>Hybrid</option>
                </select>
              </label>
            </div>
            <label>
              Technical brief
              <textarea name="brief" placeholder="Describe the system, data sources, models, robotics hardware, dashboards, integrations, constraints, or goals." />
            </label>
            <button type="submit" className="button primary">Send Inquiry <Send size={16} /></button>
          </form>
        </section>

        <section className="contact-process">
          {["Discovery", "Architecture", "Prototype", "Deployment"].map((step, index) => (
            <article key={step}>
              <span>0{index + 1}</span>
              <h3>{step}</h3>
              <p>{["Requirements, data context, environment, and constraints.", "System design, model plan, infrastructure, and integration map.", "Functional build with measurable performance criteria.", "Production rollout, monitoring, documentation, and support."][index]}</p>
              <ArrowRight size={16} />
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
