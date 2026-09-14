"use client";

import Image from "next/image";
import { useState } from "react";

export function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Algo salió mal. Probá de nuevo.");
        return;
      }
      setStatus("success");
      setMessage("¡Listo! Ya estás suscripto a nuestras novedades.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("No pudimos conectar. Probá de nuevo en un momento.");
    }
  }

  return (
    <section className="relative isolate overflow-hidden bg-cpe-navy py-20 text-white sm:py-28">
      <Image
        src="/images/newsletter-equipo.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-[75%_30%] opacity-40"
      />
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(4,31,43,.97)_0%,rgba(4,31,43,.9)_45%,rgba(4,31,43,.55)_100%)]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[.22em] text-cpe-mint">Mantenete informado</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Las novedades del Colegio, directo en tu email.
          </h2>
          <p className="mt-5 max-w-md leading-7 text-white/70">
            Sumate para enterarte primero de convocatorias, formaciones y noticias institucionales.
          </p>

          {status === "success" ? (
            <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-cpe-mint">
              {message}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="min-h-12 flex-1 rounded-full border border-white/30 bg-white/10 px-5 text-sm text-white placeholder:text-white/50 outline-none backdrop-blur transition focus:border-white/60 sm:max-w-xs"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full bg-white px-7 text-sm font-bold text-cpe-navy shadow-lg transition hover:-translate-y-0.5 hover:bg-cpe-mint disabled:cursor-default disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {status === "loading" ? "Enviando…" : "Suscribirme"}
              </button>
            </form>
          )}
          {status === "error" && <p className="mt-3 text-sm text-cpe-coral">{message}</p>}
        </div>
      </div>
    </section>
  );
}
