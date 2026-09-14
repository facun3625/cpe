import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { LogoutButton } from "@/components/logout-button";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-cpe-navy px-5 py-6 text-white lg:flex">
        <Link href="/" className="block">
          <Image src="/logo_final.png" alt="CPE Santa Fe" width={885} height={256} priority className="h-auto w-40 object-contain" />
        </Link>
        <p className="mt-3 text-[11px] font-bold uppercase tracking-widest text-white/35">Panel de administración</p>

        <AdminNav />

        <div className="mt-auto border-t border-white/10 pt-5">
          <p className="truncate text-xs text-white/45">{session?.user?.email}</p>
          <div className="mt-3 space-y-1">
            <Link href="/" className="block rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white">
              Volver al sitio
            </Link>
            <LogoutButton />
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 lg:hidden">
          <Image src="/logo_final.png" alt="CPE Santa Fe" width={885} height={256} className="h-8 w-auto object-contain" />
          <Link href="/" className="text-sm font-semibold text-cpe-navy">Ver sitio ↗</Link>
        </header>
        <main className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
