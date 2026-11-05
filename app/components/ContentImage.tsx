"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";

export function ContentImage({ src, alt, className = "" }: { src: string | null; alt: string; className?: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (!src || src === failedSrc) return <div className={`content-image image-placeholder ${className}`} role="img" aria-label={alt}><ImageIcon size={32} /><span>NEBULINT / {alt}</span></div>;
  return <img className={`content-image ${className}`} src={src} alt={alt} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailedSrc(src)} />;
}
