import { Hero } from "@/components/home/hero";
import { AccesosDirectos } from "@/components/home/accesos-directos";
import { NewsletterBanner } from "@/components/home/newsletter-banner";
import { UltimasNovedades } from "@/components/home/ultimas-novedades";
import { ActividadAcademica } from "@/components/home/actividad-academica";
import { Sedes } from "@/components/home/sedes";

export default function Home() {
  return (
    <>
      <Hero />
      <UltimasNovedades />
      <AccesosDirectos />
      <NewsletterBanner />
      <ActividadAcademica />
      <Sedes />
    </>
  );
}
