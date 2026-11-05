import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeaderNav } from "./HeaderNav";
import { NebulintLogo } from "./NebulintLogo";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return <header className="site-header">
    <Link href="/" className="brand" aria-label="NEBULINT home"><NebulintLogo /></Link>
    <HeaderNav />
    <div className="header-actions"><ThemeToggle /><Link href="/contact" className="nav-cta contact-nav-cta">Contact <ArrowRight size={14} /></Link></div>
  </header>;
}
