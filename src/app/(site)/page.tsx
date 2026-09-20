import { Hero } from "@/components/home/hero";
import { AccesosDirectos } from "@/components/home/accesos-directos";
import { NewsletterBanner } from "@/components/home/newsletter-banner";
import { UltimasNovedades } from "@/components/home/ultimas-novedades";
import { ActividadAcademica } from "@/components/home/actividad-academica";
import { Sedes } from "@/components/home/sedes";
import { MutualBanner } from "@/components/home/mutual-banner";

export default function Home() {
  return (
    <>
      <Hero />
      <UltimasNovedades />
      <MutualBanner />
      <AccesosDirectos />
      <NewsletterBanner />
      <ActividadAcademica />
      <Sedes />
    </>
  );
}
