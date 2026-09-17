"use client";

import { useState, type ReactNode } from "react";

export function FotoPublica({ src, alt, className, fallback }: { src?: string | null; alt: string; className?: string; fallback: ReactNode }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (!src || failedSrc === src) return <>{fallback}</>;
  // Uploaded images are served directly, including files added after the build.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" className={className} onError={() => setFailedSrc(src)} />;
}
