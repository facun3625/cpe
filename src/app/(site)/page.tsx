import { Hero } from "@/components/home/hero";
import { getHomeHero } from "@/lib/home-hero";
import { AccesosDirectos } from "@/components/home/accesos-directos";
import { NewsletterBanner } from "@/components/home/newsletter-banner";
import { UltimasNovedades } from "@/components/home/ultimas-novedades";
import { ActividadAcademica } from "@/components/home/actividad-academica";
import { Sedes } from "@/components/home/sedes";
import { MutualBanner } from "@/components/home/mutual-banner";

export default async function Home() {
  const heroData = await getHomeHero();
  return (
    <>
      <Hero hero={heroData} />
      <UltimasNovedades />
      <MutualBanner />
      <AccesosDirectos />
      <NewsletterBanner />
      <ActividadAcademica />
      <Sedes />
    </>
  );
}
