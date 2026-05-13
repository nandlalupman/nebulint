import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, Clock, Mail, MapPin, PhoneCall, ShieldCheck } from "lucide-react";
import { ContactForm } from "../components/ContactForm";
import { ThemeToggle } from "../components/ThemeToggle";

function ContactHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="NEBULINT home">
        <span className="brand-mark" />
        NEBULINT
      </Link>
      <nav aria-label="Contact navigation">
        <Link href="/about">About</Link>
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
          <div className="hero-actions">
            <a href="#project-inquiry" className="button primary">Submit Project Inquiry <ArrowRight size={17} /></a>
            <a href="mailto:contact@nebulint.com" className="button secondary">Email Engineering Desk</a>
          </div>
        </section>

        <section className="contact-layout">
          <div className="contact-intel">
            <article>
              <Mail size={21} />
              <h3>Direct Engineering Desk</h3>
              <a href="mailto:contact@nebulint.com">contact@nebulint.com</a>
            </article>
            <article>
              <PhoneCall size={21} />
              <h3>Primary Client Channel</h3>
              <p>Use the inquiry form for project requests, discovery calls, architecture reviews, and deployment discussions.</p>
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
              <h3>Office</h3>
              <p>4th Floor SR Bharath Apartments, 3rd Main Road, HAL 3rd Stage, Bengaluru - 560075.</p>
            </article>
            <article>
              <MapPin size={21} />
              <h3>Best Fit</h3>
              <p>Enterprise teams, industrial operators, research groups, robotics builders, and software organizations.</p>
            </article>
          </div>

          <ContactForm />
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
