"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { PasswordInput } from "@/components/password-input";

const EMAIL_GUARDADO_KEY = "cpe-admin-email";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const emailRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  const [recordar, setRecordar] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(EMAIL_GUARDADO_KEY);
      if (guardado && emailRef.current) emailRef.current.value = guardado;
    } catch {}
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const email = emailRef.current?.value ?? "";
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email o contraseña incorrectos");
      return;
    }

    try {
      if (recordar) localStorage.setItem(EMAIL_GUARDADO_KEY, email);
      else localStorage.removeItem(EMAIL_GUARDADO_KEY);
    } catch {}

    router.push(callbackUrl);
    router.refresh();
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-cpe-royal focus:outline-none focus:ring-4 focus:ring-cpe-royal/10";

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-cpe-navy px-14 py-12 text-white lg:flex">
        <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full border-[70px] border-white/[.04]" aria-hidden />
        <div className="absolute bottom-10 left-10 h-40 w-40 rounded-full bg-cpe-coral/15 blur-3xl" aria-hidden />

        <Link href="/" className="relative block w-fit">
          <Image src="/logo_final.png" alt="CPE Santa Fe" width={885} height={256} priority className="h-14 w-auto object-contain" />
        </Link>

        <div className="relative max-w-md">
          <p className="text-xs font-bold uppercase tracking-[.22em] text-cpe-mint">Panel de administración</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight">
            Todo el Colegio, en un mismo panel.
          </h1>
          <ul className="mt-8 space-y-3 text-sm text-white/75">
            {[
              "Novedades, trámites y documentos institucionales",
              "Padrón de matriculados y suscriptores",
              "Nomenclador, biblioteca y formación académica",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cpe-mint/20 text-cpe-mint">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/40">© {new Date().getFullYear()} Colegio de Profesionales en Enfermería de Santa Fe.</p>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-cpe-bg px-6 py-16 lg:w-1/2">
        <div className="mb-8 rounded-2xl bg-cpe-navy px-6 py-4 lg:hidden">
          <Image src="/logo_final.png" alt="CPE Santa Fe" width={885} height={256} priority className="h-10 w-auto object-contain" />
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-cpe-navy">Ingreso administrador</h2>
          <p className="mt-1.5 text-sm text-slate-500">Ingresá con tu email y contraseña para acceder al panel.</p>

          {error && (
            <p className="mt-5 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="mt-6">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Email</label>
            <input
              type="email"
              name="email"
              autoComplete="username"
              required
              ref={emailRef}
              className={inputClass}
            />
          </div>

          <div className="mt-4">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Contraseña</label>
            <PasswordInput
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          <label className="mt-5 flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={recordar}
              onChange={(e) => setRecordar(e.target.checked)}
              className="h-4 w-4 cursor-pointer rounded border-slate-300 text-cpe-navy focus:ring-cpe-royal"
            />
            Recordar mi usuario
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full cursor-pointer rounded-xl bg-cpe-navy px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cpe-navy-light hover:shadow-md disabled:cursor-default disabled:opacity-60"
          >
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<div className="min-h-screen bg-cpe-bg" />}><LoginForm /></Suspense>;
}
