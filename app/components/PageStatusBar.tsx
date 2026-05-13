import Link from "next/link";

type PageStatusBarProps = {
  current: string;
  section?: string;
};

export function PageStatusBar({ current, section = "Company" }: PageStatusBarProps) {
  return (
    <div className="page-status-bar" aria-label="Current page">
      <span>{section}</span>
      <strong>{current}</strong>
      <nav aria-label="Page shortcuts">
        <Link href="/about">About</Link>
        <Link href="/services">Services</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </div>
  );
}
