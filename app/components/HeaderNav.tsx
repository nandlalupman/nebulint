"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Home", href: "/", key: "home" },
  { label: "About", href: "/about", key: "about" },
  { label: "Services", href: "/services", key: "services" },
  { label: "Products", href: "/#products", key: "products" },
  { label: "Architecture", href: "/#architecture", key: "architecture" },
  { label: "Operations", href: "/#operations", key: "operations" },
  { label: "Research", href: "/#research", key: "research" },
  { label: "Careers", href: "/careers", key: "careers" }
];

function getActiveKey(pathname: string, hash: string) {
  if (pathname === "/about") return "about";
  if (pathname === "/services") return "services";
  if (pathname === "/careers") return "careers";
  if (pathname === "/" && hash) return hash.replace("#", "") || "home";
  return "home";
}

export function HeaderNav() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);

    updateHash();
    window.addEventListener("hashchange", updateHash);
    window.addEventListener("scroll", updateHash, { passive: true });

    return () => {
      window.removeEventListener("hashchange", updateHash);
      window.removeEventListener("scroll", updateHash);
    };
  }, []);

  const activeKey = getActiveKey(pathname, hash);

  useEffect(() => {
    setOpen(false);
  }, [pathname, hash]);

  return (
    <nav className={`primary-nav${open ? " open" : ""}`} aria-label="Primary navigation">
      <button
        type="button"
        className="mobile-nav-toggle"
        aria-expanded={open}
        aria-label={open ? "Close navigation" : "Open navigation"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={17} /> : <Menu size={17} />}
        <span>{open ? "Close" : "Menu"}</span>
      </button>
      <div className="nav-links">
        {navItems.map((item) => (
          <Link href={item.href} className={activeKey === item.key ? "active" : ""} key={item.key}>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
