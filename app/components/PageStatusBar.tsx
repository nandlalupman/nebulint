"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type PageStatusBarProps = {
  current?: string;
  section?: string;
};

const homeSections = [
  { id: "top", current: "Home", section: "Platform", href: "/" },
  { id: "products", current: "Products", section: "Product Systems", href: "/#products" },
  { id: "architecture", current: "Architecture", section: "System Design", href: "/#architecture" },
  { id: "operations", current: "Operations", section: "AI Ops Center", href: "/#operations" },
  { id: "research", current: "Research", section: "R&D", href: "/#research" }
];

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

  const shortcuts = pathname === "/"
    ? homeSections
    : [
      { current: "Home", href: "/" },
      { current: "About", href: "/about" },
      { current: "Services", href: "/services" },
      { current: "Careers", href: "/careers" },
      { current: "Contact", href: "/contact" }
    ];

  return (
    <div className="page-status-bar" aria-label="Current page">
      <span>{active.section}</span>
      <strong>{active.current}</strong>
      <nav aria-label="Page shortcuts">
        {shortcuts.map((item) => (
          <Link
            href={item.href}
            className={active.current === item.current ? "active" : ""}
            key={item.href}
          >
            {item.current}
          </Link>
        ))}
      </nav>
    </div>
  );
}
