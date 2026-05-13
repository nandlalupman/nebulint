"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type PageStatusBarProps = {
  current?: string;
  section?: string;
};

const statusLinks = [
  { id: "top", current: "Home", section: "Platform", href: "/" },
  { id: "about", current: "About", section: "Global Company", href: "/about" },
  { id: "services", current: "Services", section: "AI Development", href: "/services" },
  { id: "products", current: "Products", section: "Product Systems", href: "/#products" },
  { id: "architecture", current: "Architecture", section: "System Design", href: "/#architecture" },
  { id: "operations", current: "Operations", section: "AI Ops Center", href: "/#operations" },
  { id: "research", current: "Research", section: "R&D", href: "/#research" },
  { id: "careers", current: "Careers", section: "Engineering Team", href: "/careers" },
  { id: "contact", current: "Contact", section: "Client Intake", href: "/contact" }
];

const homeSections = statusLinks.filter((item) => ["top", "products", "architecture", "operations", "research"].includes(item.id));

function derivePage(pathname: string) {
  if (pathname === "/about") return { current: "About", section: "Global Company" };
  if (pathname === "/services") return { current: "Services", section: "AI Development" };
  if (pathname === "/careers") return { current: "Careers", section: "Engineering Team" };
  if (pathname === "/contact") return { current: "Contact", section: "Client Intake" };
  return { current: "Home", section: "Platform" };
}

export function PageStatusBar({ current, section }: PageStatusBarProps) {
  const pathname = usePathname();
  const fallback = useMemo(() => derivePage(pathname), [pathname]);
  const [active, setActive] = useState({ current: current ?? fallback.current, section: section ?? fallback.section });

  useEffect(() => {
    if (pathname !== "/") {
      setActive({ current: current ?? fallback.current, section: section ?? fallback.section });
      return;
    }

    const updateFromScroll = () => {
      const offset = 132;
      const hash = window.location.hash.replace("#", "");
      let selected = homeSections.find((item) => item.id === hash) ?? homeSections[0];

      if (!hash) {
        for (const item of homeSections.slice(1)) {
          const element = document.getElementById(item.id);
          if (element && element.getBoundingClientRect().top <= offset) {
            selected = item;
          }
        }
      }

      setActive({ current: selected.current, section: selected.section });
    };

    updateFromScroll();
    window.addEventListener("scroll", updateFromScroll, { passive: true });
    window.addEventListener("hashchange", updateFromScroll);

    return () => {
      window.removeEventListener("scroll", updateFromScroll);
      window.removeEventListener("hashchange", updateFromScroll);
    };
  }, [current, fallback.current, fallback.section, pathname, section]);

  return (
    <div className="page-status-bar" aria-label="Current page">
      <span>{active.section}</span>
      <strong>{active.current}</strong>
      <small>Current section</small>
    </div>
  );
}
