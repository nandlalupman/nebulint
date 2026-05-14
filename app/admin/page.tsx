import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AdminDashboard } from "../components/AdminDashboard";
import { HeaderNav } from "../components/HeaderNav";
import { NebulintLogo } from "../components/NebulintLogo";
import { ThemeToggle } from "../components/ThemeToggle";

export default function AdminPage() {
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
      <AdminDashboard />
    </>
  );
}
