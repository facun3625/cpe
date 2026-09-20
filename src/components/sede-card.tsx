import { RichText } from "@/components/rich-text";
type Sede = {
  id: string;
  nombre: string;
  direccion: string;
  telefonos: string[];
  horario: string;
  email: string | null;
};

function IconPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 h-3.5 w-3.5 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 h-3.5 w-3.5 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 4h2.7l1.3 4-1.9 1.6a11 11 0 0 0 5.8 5.8l1.6-1.9 4 1.3v2.7c0 .9-.8 1.6-1.7 1.5-8-.7-13.4-6.1-14.1-14.1C4.9 4.8 5.6 4 6.5 4Z" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 h-3.5 w-3.5 shrink-0">
      <circle cx="12" cy="12" r="8.25" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5V12l3 2" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 h-3.5 w-3.5 shrink-0">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 7 7.5 5.5L19.5 7" />
    </svg>
  );
}

export function SedeCard({ sede, className = "", variant = "dark" }: { sede: Sede; className?: string; variant?: "dark" | "light" }) {
  const textColor = variant === "dark" ? "text-white/70" : "text-slate-600";
  const titleColor = variant === "dark" ? "text-white" : "text-cpe-navy";
  return (
    <div className={className}>
      <h3 className={`text-base font-bold ${titleColor}`}><RichText value={sede.nombre} /></h3>
      <div className={`mt-3 space-y-1.5 text-xs leading-5 ${textColor}`}>
        <p className="flex items-start gap-2">
          <IconPin /> <RichText value={sede.direccion} />
        </p>
        {sede.telefonos.map((telefono) => (
          <p key={telefono} className="flex items-start gap-2">
            <IconPhone /> {telefono}
          </p>
        ))}
        <p className="flex items-start gap-2">
          <IconClock /> <RichText value={sede.horario} />
        </p>
        {sede.email && (
          <p className="flex items-start gap-2">
            <IconMail /> {sede.email}
          </p>
        )}
      </div>
    </div>
  );
}
