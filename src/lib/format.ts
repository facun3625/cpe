/** Formatea fecha+hora en es-AR. Usar siempre desde el servidor (page.tsx o una Server Action) para
 * evitar mismatches de hidratación: el motor ICU del navegador puede formatear "a. m."/"a.m." distinto
 * al de Node, así que un Client Component nunca debería llamar a Intl.DateTimeFormat sobre datos SSR-eados. */
export function formatFechaHora(fecha: Date | string): string {
  const d = typeof fecha === "string" ? new Date(fecha) : fecha;
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
