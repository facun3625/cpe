import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { ACTIVIDADES } from "../src/components/nomenclador/data";

const prisma = new PrismaClient();

async function seedIfEmpty<T>(modelName: string, count: () => Promise<number>, seed: () => Promise<T>) {
  const existentes = await count();
  if (existentes > 0) {
    console.log(`${modelName}: ya hay ${existentes} filas, no se vuelve a sembrar.`);
    return;
  }
  await seed();
  console.log(`${modelName}: sembrado.`);
}

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@cpe.local";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "admin1234";
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, name: "Admin", passwordHash },
  });
  console.log(`Usuario admin listo: ${user.email}`);

  const novedades = [
    { titulo: "Acta de Escrutinio definitivo elecciones 19.06.26", slug: "acta-escrutinio-definitivo-elecciones-19-06-26", resumen: "Acta de escrutinio definitivo de las elecciones del Colegio.", publicadoEn: new Date("2026-06-19") },
    { titulo: "Acta 3 Junta Electoral Elecciones 19.06.26", slug: "acta-3-junta-electoral-elecciones-19-06-26", resumen: "Tercera acta de la Junta Electoral correspondiente a las elecciones.", publicadoEn: new Date("2026-06-18") },
    { titulo: "Lista Oficializada", slug: "lista-oficializada", resumen: "Lista oficializada para las elecciones del Colegio.", publicadoEn: new Date("2026-06-17") },
    { titulo: "Acta 2 Junta Electoral Elecciones 19.06.26", slug: "acta-2-junta-electoral-elecciones-19-06-26", resumen: "Segunda acta de la Junta Electoral correspondiente a las elecciones.", publicadoEn: new Date("2026-06-16") },
  ];
  for (const novedad of novedades) {
    await prisma.novedad.upsert({ where: { slug: novedad.slug }, update: novedad, create: novedad });
  }
  console.log(`Novedades seedeadas: ${novedades.length}`);

  // --- Misión, visión y propósitos ---
  await prisma.paginaTexto.upsert({
    where: { pagina: "mision" },
    update: {},
    create: {
      pagina: "mision",
      contenido: {
        misionTitulo: "Velar por el ejercicio profesional, de acuerdo al marco legal de la Ley N.º 10.819, para lo cual fue creado el Colegio.",
        misionTexto: "Liderar los preceptos del conocimiento ético, moral, profesional, histórico y científico, manteniendo una imagen fuerte de la profesión.",
        visionTitulo: "Optimizar el ejercicio de la profesión, alcanzando la excelencia en la gestión del cuidado de la salud.",
        visionTexto: "Lograr el reconocimiento de la sociedad y el empoderamiento de la profesión, promoviendo y protegiendo el bienestar social.",
        propositos: ["Reconocimiento profesional", "Sentido de pertenencia", "Participación activa", "Motivación", "Confianza y compromiso"],
      },
    },
  });

  // --- Propuesta educativa ---
  await prisma.paginaTexto.upsert({
    where: { pagina: "propuesta-educativa" },
    update: {},
    create: {
      pagina: "propuesta-educativa",
      contenido: {
        intro: "Esta nueva gestión tiene una propuesta educativa amplia y popular.",
        parrafos: [
          "La Comisión de Capacitación y Actividades Académicas se complace al contar con vuestra participación en las distintas actividades del colegio; por lo que los invitamos a que se sumen a nuestro trabajo, compartiendo su propia experiencia.",
          "Las jornadas de enfermería son necesarias para nuestro crecimiento profesional, mejorando nuestras estrategias de trabajo y optimizando los conocimientos.",
          "Así desarrollaremos una oferta educativa continua y de gran nivel; dejando un espacio libre para nuevas propuestas y quedando a su disposición para recibir sus ideas y sugerencias, las cuales trabajaremos en conjunto transitando nuevos caminos.",
        ],
        firma: "Comisión de Capacitación y Actividades Académicas",
      },
    },
  });

  // --- Becas ---
  await prisma.paginaTexto.upsert({
    where: { pagina: "becas" },
    update: {},
    create: {
      pagina: "becas",
      contenido: {
        requisitos: [
          "Presentar la solicitud correspondiente.",
          "Acreditar la cuota de mantenimiento de matrícula o registro al día.",
          "Poseer 1 año como mínimo de antigüedad en la matrícula o registro.",
          "Solicitarla con un plazo no inferior a 15 días de la fecha de comienzo del evento al que se quiere concurrir.",
        ],
      },
    },
  });

  // --- Secciones tipo "índice" (cards con link) ---
  await seedIfEmpty("SeccionItem", () => prisma.seccionItem.count(), () =>
    prisma.seccionItem.createMany({
      data: [
        { pagina: "institucional", orden: 0, titulo: "Misión y visión", texto: "Promover la excelencia, la ética y el ejercicio responsable, defendiendo derechos y jerarquizando el rol de la enfermería.", href: "/institucional/mision" },
        { pagina: "institucional", orden: 1, titulo: "Autoridades", texto: "Conocé a quienes integran el Consejo Directivo y los órganos institucionales del Colegio.", href: "/institucional/autoridades" },
        { pagina: "institucional", orden: 2, titulo: "Historia", texto: "Un recorrido por los hitos que dieron forma a la organización profesional de la enfermería santafesina.", href: "/institucional/historia" },
        { pagina: "institucional", orden: 3, titulo: "Comisiones", texto: "Equipos de trabajo que abordan temas académicos, éticos, legales y profesionales.", href: "/institucional/comisiones" },
        { pagina: "institucional", orden: 4, titulo: "Reglamentos", texto: "Normativa institucional, código de ética, resoluciones y documentación de consulta.", href: "/institucional/reglamentos" },
        { pagina: "institucional", orden: 5, titulo: "Sedes y delegaciones", texto: "Presencia territorial en Santa Fe, Rafaela, Reconquista, Vera y Sastre.", href: "/contacto" },

        { pagina: "actividad-academica", orden: 0, titulo: "Propuesta educativa", texto: "Capacitaciones presenciales y virtuales sobre cuidados, gestión, docencia e investigación.", href: "/actividad-academica/propuesta-educativa" },
        { pagina: "actividad-academica", orden: 1, titulo: "Biblioteca", texto: "Material bibliográfico, revistas especializadas y recursos para estudiantes y profesionales.", href: "/biblioteca" },
        { pagina: "actividad-academica", orden: 2, titulo: "Jornadas y eventos", texto: "Encuentros que conectan experiencias, saberes y nuevos desafíos del campo profesional.", href: null },
        { pagina: "actividad-academica", orden: 3, titulo: "Becas", texto: "Oportunidades de apoyo para la formación y el desarrollo profesional.", href: "/becas" },

        { pagina: "biblioteca", orden: 0, titulo: "Catálogo bibliográfico", texto: "Libros y publicaciones especializadas en las diferentes áreas de enfermería.", href: null },
        { pagina: "biblioteca", orden: 1, titulo: "Revistas y publicaciones", texto: "Material periódico para acompañar la actualización científica y profesional.", href: null },
        { pagina: "biblioteca", orden: 2, titulo: "Consulta en sala", texto: "Acceso presencial a los recursos disponibles en la biblioteca institucional.", href: null },
        { pagina: "biblioteca", orden: 3, titulo: "Recursos digitales", texto: "Enlaces y documentos seleccionados para ampliar tus fuentes de estudio.", href: null },
      ],
    })
  );

  // --- Autoridades ---
  await seedIfEmpty("Autoridad", () => prisma.autoridad.count(), () =>
    prisma.autoridad.createMany({
      data: [
        { grupo: "CONSEJO_DIRECTIVO", rol: "Presidente", nombre: "Azoge, Carlos Luis Rubén", orden: 0 },
        { grupo: "CONSEJO_DIRECTIVO", rol: "Vicepresidente", nombre: "Zanutto, Raúl Alberto", orden: 1 },
        { grupo: "CONSEJO_DIRECTIVO", rol: "Secretaria", nombre: "Bello, Rosa Susana", orden: 2 },
        { grupo: "CONSEJO_DIRECTIVO", rol: "Tesorero", nombre: "Trovetti, Juan Carlos", orden: 3 },

        { grupo: "VOCAL_TITULAR", rol: null, nombre: "Gomitolo, Lilian Adriana", orden: 0 },
        { grupo: "VOCAL_TITULAR", rol: null, nombre: "Alvarez, Ramona Ester", orden: 1 },
        { grupo: "VOCAL_TITULAR", rol: null, nombre: "Villasboas, Adriana Soledad", orden: 2 },
        { grupo: "VOCAL_TITULAR", rol: null, nombre: "Serra, Norma Beatríz", orden: 3 },

        { grupo: "VOCAL_SUPLENTE", rol: null, nombre: "Correa, Carina Andrea", orden: 0 },
        { grupo: "VOCAL_SUPLENTE", rol: null, nombre: "Lorenzón, Rocío Belén", orden: 1 },
        { grupo: "VOCAL_SUPLENTE", rol: null, nombre: "Juanovich, Alcira Graciela Gricelda", orden: 2 },
        { grupo: "VOCAL_SUPLENTE", rol: null, nombre: "Quiroga, María Yolanda", orden: 3 },

        { grupo: "SINDICO", rol: "Síndico titular", nombre: "García, Carlos Emanuel", orden: 0 },
        { grupo: "SINDICO", rol: "Síndico suplente", nombre: "Zapata, Carolina Inés", orden: 1 },

        { grupo: "ETICA_TITULAR", rol: null, nombre: "Durani, Elisabet Claudia Beatríz", orden: 0 },
        { grupo: "ETICA_TITULAR", rol: null, nombre: "Santuche, Francisco Salvador Rafael", orden: 1 },
        { grupo: "ETICA_TITULAR", rol: null, nombre: "Bianchi, Dora Lidia", orden: 2 },

        { grupo: "ETICA_SUPLENTE", rol: null, nombre: "Outeyral, Adriana Liliana", orden: 0 },
        { grupo: "ETICA_SUPLENTE", rol: null, nombre: "Nieva, Flavio Rubén", orden: 1 },
        { grupo: "ETICA_SUPLENTE", rol: null, nombre: "Prysunka, Carina Jaquelina", orden: 2 },
      ],
    })
  );

  // --- Historia ---
  await seedIfEmpty("HitoHistoria", () => prisma.hitoHistoria.count(), () =>
    prisma.hitoHistoria.createMany({
      data: [
        { anio: "1992", orden: 0, titulo: "Un grupo de enfermeros impulsa la ley", texto: "Un grupo de enfermeros trabajó con el objetivo de agrupar a los profesionales en enfermería y ordenar el control de la matrícula y el ejercicio de la profesión. Se promulgó la Ley N.º 10.819 y su Decreto reglamentario 1482/96, que constituye el Colegio de Profesionales en Enfermería con asiento en la ciudad de Santa Fe." },
        { anio: "1996", orden: 1, titulo: "Estatuto y Código de Ética", texto: "Una vez creado el Colegio, se trabajó en la redacción del Estatuto y el Código de Ética, estableciendo pautas de actuación que contribuyen al bien social de la profesión." },
        { anio: "Dic. 1996", orden: 2, titulo: "Primera Comisión Directiva", texto: "El 13 de diciembre de 1996 se constituyó la 1.ª Comisión Directiva. Desde entonces, tal como establece el Estatuto, se renueva cada dos años mediante acto electoral." },
        { anio: "Hoy", orden: 3, titulo: "Una institución consolidada", texto: "El Colegio creció gracias al compromiso permanente de los matriculados, que esperan una profesión fuertemente posicionada dentro de la sociedad. Hoy, consolidados como institución, seguimos con el impulso de llegar a toda nuestra región." },
      ],
    })
  );

  // --- Comisiones ---
  await seedIfEmpty("Comision", () => prisma.comision.count(), () =>
    prisma.comision.createMany({
      data: [
        { orden: 0, titulo: "Comisión de Auditoría Interna", texto: "Entiende en el gobierno de la matrícula profesional, disponiendo las medidas necesarias a los efectos de la matriculación de todos los profesionales en enfermería.", tramitesRelacionados: ["Matriculación o registro", "Matriculación de auxiliar como enfermero", "Actualización de título", "Solicitud de certificado de matrícula o constancia de registro", "Solicitud de duplicado de credencial", "Solicitud de cuota de mantenimiento de matrícula o registro", "Baja de matrícula o registro", "Rehabilitación de matrícula o registro"] },
        { orden: 1, titulo: "Comisión de Auditoría Externa", texto: "Supervisa establecimientos asistenciales bajo la Ley 9.847, por delegación del Ministerio de Salud de Santa Fe. Controla consultorios de enfermería sin internación y servicios domiciliarios.", tramitesRelacionados: ["Requisitos para la habilitación de un consultorio de enfermería sin internación"] },
        { orden: 2, titulo: "Comisión de Becas", texto: "Promociona medidas tendientes a lograr un constante perfeccionamiento profesional.", tramitesRelacionados: ["Reglamento para la solicitud de becas", "Formulario para la solicitud de becas"] },
        { orden: 3, titulo: "Comisión de Cultura y Actividades Académicas", texto: "Coordina actividades académicas, de formación, culturales, recreativas y sociales.", tramitesRelacionados: [] },
        { orden: 4, titulo: "Comisión de Prensa y Relaciones Públicas", texto: "Es la única voz del Colegio frente a los medios de comunicación.", tramitesRelacionados: [] },
        { orden: 5, titulo: "Comisión de Relaciones Institucionales", texto: "Defiende los derechos profesionales, protege a los colegiados en relación de dependencia y representa al Colegio ante las autoridades.", tramitesRelacionados: [] },
        { orden: 6, titulo: "Comisión de Turismo y Recreación", texto: "Promueve la salud psicofísica enfocada en la recreación y el descanso profesional.", tramitesRelacionados: ["Inscripción a actividades turísticas"] },
        { orden: 7, titulo: "Comisión de Desarrollo Legal de la Enfermería e Incumbencias Profesionales", texto: "Analiza las normas regulatorias y propone reformas disciplinarias profesionales.", tramitesRelacionados: ["Normativa vigente", "Resoluciones del Colegio sobre incumbencias"] },
        { orden: 8, titulo: "Comisión de Actualización Permanente del Nomenclador de Aranceles y Bolsa de Trabajo", texto: "Actualiza los valores de las prestaciones y reorganiza la bolsa laboral para enfermeros.", tramitesRelacionados: ["Valores actuales del nomenclador", "Inscripción a la bolsa de trabajo"] },
      ],
    })
  );

  // --- Trámites ---
  const tramites = [
    { slug: "matriculacion-registro", orden: 0, titulo: "Matriculación o registro", texto: "El interesado deberá contar con su título formal; no es posible dar inicio al trámite con constancia de egreso o título provisorio. La documentación se digitaliza y se inicia el trámite a través del SAG.", requisitos: ["Original y copia certificada de título/diploma en cartón, o archivo en PDF de título digital según corresponda.", "Fotocopia certificada de documento (DNI).", "Declaración de domicilio (debe acreditar su domicilio real).", "1 foto carnet actualizada."] },
    { slug: "matriculacion-auxiliar", orden: 1, titulo: "Matriculación de auxiliar como enfermero", texto: "El interesado deberá contar con su título formal; no es posible dar inicio al trámite con constancia de egreso o título provisorio.", requisitos: ["Original y copia certificada de título/diploma en cartón, o archivo en PDF de título digital según corresponda.", "Fotocopia certificada de documento (DNI).", "Declaración de domicilio (debe acreditar su domicilio real).", "Credencial de auxiliar de enfermería.", "1 foto carnet actualizada."] },
    { slug: "actualizacion-titulo", orden: 2, titulo: "Actualización de título", texto: "El interesado deberá contar con su título formal para actualizar su categoría de matriculación.", requisitos: ["Original y copia certificada de título/diploma en cartón, o archivo en PDF de título digital según corresponda.", "Fotocopia certificada de documento (DNI).", "Credencial anterior.", "1 foto carnet actualizada."] },
    { slug: "certificado-matricula", orden: 3, titulo: "Certificado de matrícula o constancia de registro", texto: "El interesado deberá tener las cuotas de mantenimiento al día y adjuntar a través del SAG una nota realizando la solicitud correspondiente. La firma debe coincidir con la registrada oportunamente en este Colegio.", requisitos: ["Cuotas de mantenimiento al día.", "Nota vía SAG indicando nombre completo, DNI, N.º de matrícula/registro y empresa, razón social o efector en el que será presentado."] },
    { slug: "duplicado-credencial", orden: 4, titulo: "Duplicado de credencial", texto: "Para solicitar un duplicado de credencial por extravío, robo o deterioro.", requisitos: ["Nota solicitando el duplicado de credencial.", "Constancia de extravío, robo o deterioro.", "1 foto carnet."] },
    { slug: "baja-matricula", orden: 5, titulo: "Baja de matrícula o registro", texto: "Se digitaliza la documentación con claridad y se inicia el trámite a través del SAG.", requisitos: ["Nota solicitando la baja de su matrícula/registro.", "Documentación que respalde el motivo."] },
    { slug: "certificado-etica", orden: 6, titulo: "Certificado de ética profesional", texto: "El interesado deberá tener las cuotas de mantenimiento al día y adjuntar a través del SAG la nota solicitando la certificación. La firma debe coincidir con la registrada oportunamente en este Colegio.", requisitos: ["Cuotas de mantenimiento al día.", "Nota vía SAG indicando nombre completo, DNI, N.º de matrícula/registro y empresa, razón social o efector en el que será presentado."] },
    { slug: "habilitacion-consultorio", orden: 7, titulo: "Habilitación de consultorio de enfermería sin internación", texto: "Trámite para habilitar un consultorio de enfermería que no brinde servicios de internación.", requisitos: ["Formulario de \"Solicitud de habilitación\" completo.", "Croquis de la enfermería a escala y acotado, indicando instalaciones sanitarias, eléctricas, de gas, etc., office limpio y office sucio.", "Certificado de matrícula profesional extendido por el Colegio de Profesionales en Enfermería con asiento en la ciudad de Santa Fe.", "Habilitación municipal de la enfermería.", "Convenio de recolección y tratamiento de residuos patológicos, más último recibo de pago.", "Constancia de AFIP que acredite titularidad para ese domicilio y esa actividad."] },
  ];
  for (const tramite of tramites) {
    await prisma.tramite.upsert({ where: { slug: tramite.slug }, update: {}, create: tramite });
  }
  console.log(`Trámites seedeados: ${tramites.length}`);

  // --- Documentos: dictámenes, reglamentos, notas modelo, becas ---
  await seedIfEmpty("Documento", () => prisma.documento.count(), () =>
    prisma.documento.createMany({
      data: [
        { tipo: "DICTAMEN", orden: 0, titulo: "La extracción de sangre no corresponde a enfermería" },
        { tipo: "DICTAMEN", orden: 1, titulo: "La conexión y desconexión de transfusión de sangre y sus hemoderivados no corresponde a enfermería" },
        { tipo: "DICTAMEN", orden: 2, titulo: "La toma de muestras por hisopado nasal para Covid-19 no corresponde a enfermería" },
        { tipo: "DICTAMEN", orden: 3, titulo: "La toma de registro de electrocardiograma no corresponde a enfermería" },
        { tipo: "DICTAMEN", orden: 4, titulo: "La colocación de sondas nasoyeyunal K-108 no corresponde a enfermería" },

        { tipo: "REGLAMENTO", grupo: "Marco legal", orden: 0, titulo: "Ley N.º 10.819" },
        { tipo: "REGLAMENTO", grupo: "Marco legal", orden: 1, titulo: "Ley N.º 12.501" },
        { tipo: "REGLAMENTO", grupo: "Marco legal", orden: 2, titulo: "Decreto 2810/12" },
        { tipo: "REGLAMENTO", grupo: "Marco legal", orden: 3, titulo: "Decreto 2810/12 — Anexo" },
        { tipo: "REGLAMENTO", grupo: "Estatuto y reglamentos internos", orden: 4, titulo: "Estatuto" },
        { tipo: "REGLAMENTO", grupo: "Estatuto y reglamentos internos", orden: 5, titulo: "Reglamento Electoral 2017" },
        { tipo: "REGLAMENTO", grupo: "Estatuto y reglamentos internos", orden: 6, titulo: "Reglamento del Directorio — CPE 2017" },
        { tipo: "REGLAMENTO", grupo: "Estatuto y reglamentos internos", orden: 7, titulo: "Estatuto del Colegio de Profesionales en Enfermería de Santa Fe 2017" },
        { tipo: "REGLAMENTO", grupo: "Estatuto y reglamentos internos", orden: 8, titulo: "Decreto 2201/2017 — Aprueba reformas CPE Santa Fe con cédula" },
        { tipo: "REGLAMENTO", grupo: "Estatuto y reglamentos internos", orden: 9, titulo: "Código y Reglamento de Ética 2017" },

        { tipo: "NOTA_MODELO", grupo: "certificado-matricula", orden: 0, titulo: "Nota modelo — Certificado de matrícula o constancia de registro" },
        { tipo: "NOTA_MODELO", grupo: "duplicado-credencial", orden: 1, titulo: "Nota modelo — Duplicado de credencial" },
        { tipo: "NOTA_MODELO", grupo: "baja-matricula", orden: 2, titulo: "Nota modelo — Baja de matrícula o registro" },
        { tipo: "NOTA_MODELO", grupo: "certificado-etica", orden: 3, titulo: "Nota modelo — Certificado de ética profesional" },
        { tipo: "NOTA_MODELO", grupo: "habilitacion-consultorio", orden: 4, titulo: "Nota modelo — Requisitos de habilitación de consultorio de enfermería" },

        { tipo: "BECA", orden: 0, titulo: "Reglamento de becas" },
        { tipo: "BECA", orden: 1, titulo: "Formulario de solicitud" },
      ],
    })
  );

  // --- Sedes (usadas por el home y por /contacto) ---
  await seedIfEmpty("Sede", () => prisma.sede.count(), () =>
    prisma.sede.createMany({
      data: [
        { orden: 0, nombre: "Santa Fe", direccion: "Corrientes 2976 – Santa Fe – 3000 – Santa Fe", telefonos: ["Tel: (0342) 4598561 - (0342) 4515101", "Cel: (0342) 156 146 598 (solo llamadas)"], horario: "Lunes a Viernes de 8 a 13 hs.", email: "colegioenfermeros@gmail.com" },
        { orden: 1, nombre: "Rafaela", direccion: "Sarmiento 561 – Rafaela – Santa Fe", telefonos: [], horario: "Jueves de 9 a 14 hs.", email: "cpedelegacionrafaela@gmail.com" },
        { orden: 2, nombre: "Reconquista", direccion: "General López 1435 – Reconquista - S3560", telefonos: ["(03482) 15220140"], horario: "Jueves de 13:30 a 15 hs", email: null },
        { orden: 3, nombre: "Vera", direccion: "Mariano Leiva 725 – Planta Alta – Local 34", telefonos: ["Tel: (0342) 155087694"], horario: "Jueves de 11 a 15 hs.", email: "cpeoficinavera@gmail.com" },
        { orden: 4, nombre: "Sastre", direccion: "Julio A. Roca 1693, local 2", telefonos: ["(0342) 156121609"], horario: "Jueves de 9 a 14 hs.", email: null },
      ],
    })
  );

  // --- Nomenclador (122 prestaciones, ya transcriptas del PDF oficial) ---
  await seedIfEmpty("NomencladorItem", () => prisma.nomencladorItem.count(), () =>
    prisma.nomencladorItem.createMany({
      data: ACTIVIDADES.map((a, index) => ({
        orden: index,
        nombre: a.nombre,
        tiempo: a.tiempo,
        upe: a.upe,
        cd: a.cd,
        cn: a.cn,
        dn: a.dn,
        noReconocida: a.noReconocida ?? false,
      })),
    })
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
