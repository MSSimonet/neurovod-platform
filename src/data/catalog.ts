import { ModuleItem, DoctorProfile } from '../types';

export const leadDoctor: DoctorProfile = {
  name: "Dr. Julián Rossi",
  title: "Médico Especialista en Neurología Infantil y Neurodesarrollo",
  specialty: "Trastorno del Espectro Autista (TEA) & TDAH",
  licenseNumber: "MN 142.890 / MP 45.210",
  bio: "Médico de planta del Hospital Pediátrico de Referencia y docente universitario. Con más de 16 años de práctica clínica acompañando a más de 3.500 familias en el diagnóstico, abordaje interdisciplinario y estrategias psicoeducativas para potenciar el neurodesarrollo.",
  avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&auto=format&fit=crop",
  experienceYears: 16,
  inPersonConsultFeeArs: 60000,
};

export const sampleModules: ModuleItem[] = [
  {
    id: "tdah-infancia-integral",
    title: "Manejo Integral del TDAH en la Infancia",
    subtitle: "Del Diagnóstico a las Rutinas Diarias en el Hogar y la Escuela",
    description: "Programa médico paso a paso diseñado para familias. Aprende a diferenciar desatención de desmotivación, implementar apoyos conductuales eficaces, comprender el rol y mitos de la medicación, y coordinar adaptaciones con el equipo docente.",
    condition: "TDAH",
    contentType: "Modulo",
    year: 2026,
    targetAudience: "Escolar (6-12 años)",
    rating: 4.95,
    reviewsCount: 142,
    totalDurationHours: "2h 45m",
    episodesCount: 5,
    priceArs: 50000,
    isFeatured: true,
    badge: "Módulo Completo Más Solicitado",
    thumbnailUrl: "https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=800&auto=format&fit=crop",
    heroBannerUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=1920&auto=format&fit=crop",
    doctor: leadDoctor,
    tags: ["TDAH", "Rutinas", "Escuela", "Medicación", "Crianza Respetuosa"],
    keyLearningPoints: [
      "Comprender la neurobiología de las funciones ejecutivas y la dopamina.",
      "Cómo estructurar el ambiente doméstico sin gritos ni desgaste diario.",
      "Mitos y realidades sobre la farmacología: cuándo sí y cuándo no.",
      "Elaboración de notas y pedidos de adecuaciones curriculares no significativas.",
      "Técnicas de regulación emocional ante la frustración y la impulsividad."
    ],
    episodes: [
      {
        id: "tdah-ep-1",
        episodeNumber: 1,
        title: "Episodio 1: Qué es realmente el TDAH: La química de la atención",
        durationMinutes: 32,
        synopsis: "Superando el mito de la falta de voluntad. Entendiendo por qué a tu hijo le cuesta iniciar tareas aburridas pero puede pasar horas hiperfocalizado.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800&auto=format&fit=crop",
        chapters: [
          { id: "c1-1", timeSeconds: 0, title: "00:00 Introducción médica y objetivos" },
          { id: "c1-2", timeSeconds: 240, title: "04:00 Circuitos prefrontales y dopamina" },
          { id: "c1-3", timeSeconds: 620, title: "10:20 Hiperfoco vs. Déficit de filtro atencional" },
          { id: "c1-4", timeSeconds: 1100, title: "18:20 Señales de alarma según la edad" },
          { id: "c1-5", timeSeconds: 1600, title: "26:40 Resumen clínico para padres" }
        ],
        resources: [
          { title: "Guía Médica: Síntomas y Funciones Ejecutivas", type: "pdf", size: "1.8 MB" }
        ]
      },
      {
        id: "tdah-ep-2",
        episodeNumber: 2,
        title: "Episodio 2: Rutinas predecibles y diseño del entorno doméstico",
        durationMinutes: 36,
        synopsis: "Estrategias de arquitectura ambiental: temporizadores visuales, checklist matutina y reducción de fricción antes de ir a la escuela.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=800&auto=format&fit=crop",
        chapters: [
          { id: "c2-1", timeSeconds: 0, title: "00:00 La trampa del recordatorio verbal continuo" },
          { id: "c2-2", timeSeconds: 300, title: "05:00 Cronómetros y apoyos no verbales" },
          { id: "c2-3", timeSeconds: 780, title: "13:00 Organización del espacio de tareas escolares" },
          { id: "c2-4", timeSeconds: 1400, title: "23:20 Sistema de recompensas inmediatas" }
        ],
        resources: [
          { title: "Plantilla Imprimible: Tablero de Rutinas Diarias", type: "checklist", size: "950 KB" }
        ]
      },
      {
        id: "tdah-ep-3",
        episodeNumber: 3,
        title: "Episodio 3: TDAH en el Aula y Diálogo con los Docentes",
        durationMinutes: 34,
        synopsis: "Cómo coordinar con el colegio sin confrontar. Adecuaciones metodológicas prácticas: descansos cerebrales, ubicación en el banco y evaluaciones fragmentadas.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop",
        chapters: [
          { id: "c3-1", timeSeconds: 0, title: "00:00 Construyendo alianza con maestros" },
          { id: "c3-2", timeSeconds: 420, title: "07:00 Adecuaciones no significativas" },
          { id: "c3-3", timeSeconds: 980, title: "16:20 Evaluaciones orales vs escritas cortas" }
        ],
        resources: [
          { title: "Modelo de Informe para la Escuela (PDF Editable)", type: "guide", size: "2.1 MB" }
        ]
      },
      {
        id: "tdah-ep-4",
        episodeNumber: 4,
        title: "Episodio 4: Tratamiento Farmacológico: Respuestas Claras",
        durationMinutes: 38,
        synopsis: "Metilfenidato, atomoxetina y opciones actuales. Indicaciones precisas, control de efectos secundarios, curvas de acción y mitos frecuentes.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800&auto=format&fit=crop",
        chapters: [
          { id: "c4-1", timeSeconds: 0, title: "00:00 ¿Cuándo se justifica la medicación?" },
          { id: "c4-2", timeSeconds: 450, title: "07:30 Estimulantes vs No estimulantes" },
          { id: "c4-3", timeSeconds: 960, title: "16:00 Apetito, sueño y seguimiento médico" }
        ]
      },
      {
        id: "tdah-ep-5",
        episodeNumber: 5,
        title: "Episodio 5: Regulación Emocional y Autoestima en el Niño",
        durationMinutes: 25,
        synopsis: "Reparando el impacto de las críticas continuas. Cómo fomentar el autoconcepto positivo, validar la frustración y prevenir el oposicionismo.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop",
        chapters: [
          { id: "c5-1", timeSeconds: 0, title: "00:00 La herida de la desaprobación crónica" },
          { id: "c5-2", timeSeconds: 380, title: "06:20 Técnicas de anclaje emocional" },
          { id: "c5-3", timeSeconds: 850, title: "14:10 Cierre del módulo y plan de acción" }
        ],
        resources: [
          { title: "Plan de Acción Familiar en 5 Pasos", type: "pdf", size: "1.2 MB" }
        ]
      }
    ]
  },
  {
    id: "autismo-desregulacion-colapsos",
    title: "Autismo (TEA): Desregulación y Colapsos Sensoriales",
    subtitle: "Diferenciando Berrinche de Crisis Sensorial (Meltdown vs Tantrum)",
    description: "Aprende a leer las señales tempranas de sobrecarga sensorial y fatiga comunicativa en niños con TEA. Herramientas prácticas para evitar desbordes y actuar con serenidad y seguridad durante y después de una crisis.",
    condition: "Autismo",
    contentType: "Modulo",
    year: 2025,
    targetAudience: "Escolar (6-12 años)",
    rating: 4.98,
    reviewsCount: 198,
    totalDurationHours: "2h 30m",
    episodesCount: 5,
    priceArs: 50000,
    badge: "Módulo Recomendado",
    thumbnailUrl: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=800&auto=format&fit=crop",
    heroBannerUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1920&auto=format&fit=crop",
    doctor: leadDoctor,
    tags: ["TEA", "Autismo", "Sensorial", "Meltdowns", "Regulación"],
    keyLearningPoints: [
      "Aprender a diferenciar un berrinche intencional de un colapso neurovegetativo.",
      "Construir un perfil sensorial personalizado de tu hijo.",
      "Qué hacer exactamente durante el pico de una crisis para garantizar seguridad.",
      "El período post-crisis: recuperación y descompresión del sistema nervioso."
    ],
    episodes: [
      {
        id: "tea-ep-1",
        episodeNumber: 1,
        title: "Episodio 1: Berrinche vs Meltdown: Diferencias neurológicas clave",
        durationMinutes: 28,
        synopsis: "Por qué exigir 'pórtate bien' durante un colapso sensorial empeora la crisis. Explicación biológica del secuestro amigdalino en TEA.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=800&auto=format&fit=crop",
        chapters: [
          { id: "tc1-1", timeSeconds: 0, title: "00:00 Presentación y errores habituales" },
          { id: "tc1-2", timeSeconds: 310, title: "05:10 La cascada sensorial invisible" },
          { id: "tc1-3", timeSeconds: 820, title: "13:40 Tabla comparativa Berrinche vs Meltdown" }
        ],
        resources: [
          { title: "Infografía Médica: Berrinche vs Meltdown", type: "pdf", size: "2.4 MB" }
        ]
      },
      {
        id: "tea-ep-2",
        episodeNumber: 2,
        title: "Episodio 2: Creando la Dieta Sensorial y Zonas de Calma en Casa",
        durationMinutes: 31,
        synopsis: "Herramientas propioceptivas, chalecos de peso, auriculares de cancelación y carpas de calma para regular el umbral antes del desborde.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop",
        chapters: [
          { id: "tc2-1", timeSeconds: 0, title: "00:00 Concepto de dieta sensorial" },
          { id: "tc2-2", timeSeconds: 400, title: "06:40 Espacios de calma de bajo costo" }
        ]
      },
      {
        id: "tea-ep-3",
        episodeNumber: 3,
        title: "Episodio 3: Anticipación y Apoyos Visuales en Transiciones",
        durationMinutes: 30,
        synopsis: "Cómo las transiciones no planificadas disparan la ansiedad en autismo y cómo los pictogramas y temporizadores reducen el estrés en un 80%.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop",
        chapters: [
          { id: "tc3-1", timeSeconds: 0, title: "00:00 Por qué el cerebro autista necesita predictibilidad" },
          { id: "tc3-2", timeSeconds: 520, title: "08:40 Diseño de agendas visuales efectivas" }
        ]
      },
      {
        id: "tea-ep-4",
        episodeNumber: 4,
        title: "Episodio 4: Protocolo de Seguridad Durante el Colapso",
        durationMinutes: 29,
        synopsis: "Postura del adulto, reducción de estímulos lumínicos y sonoros, qué NO decir y cómo proteger de autolesiones sin violencia física.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800&auto=format&fit=crop",
        chapters: [
          { id: "tc4-1", timeSeconds: 0, title: "00:00 Regla de oro: Menos palabras, más presencia" },
          { id: "tc4-2", timeSeconds: 480, title: "08:00 Gestión de espacios públicos" }
        ]
      },
      {
        id: "tea-ep-5",
        episodeNumber: 5,
        title: "Episodio 5: La Fase de Recuperación y Cuidado del Cuidador",
        durationMinutes: 32,
        synopsis: "Recuperación fisiológica post-descarga. Cuidado de la salud mental de padres y madres: burnout y culpa parental.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=800&auto=format&fit=crop",
        chapters: [
          { id: "tc5-1", timeSeconds: 0, title: "00:00 Cuándo volver a hablar de lo sucedido" },
          { id: "tc5-2", timeSeconds: 430, title: "07:10 Técnicas de descompresión para padres" }
        ]
      }
    ]
  },
  {
    id: "guia-sueno-neurodivergente",
    title: "Guía Rápida: Higiene del Sueño en Neurodivergentes",
    subtitle: "Estrategias Clínicas para Conciliar y Mantener el Sueño sin Batallas",
    description: "Hasta el 80% de los niños con TDAH o TEA presentan trastornos de conciliación o despertares nocturnos frecuentes. Conoce las causas biológicas (melatonina, hiperalerta sensorial) y las rutinas pre-cama comprobadas.",
    condition: "Sensorial",
    contentType: "Guia",
    year: 2026,
    targetAudience: "Familias y Cuidadores",
    rating: 4.92,
    reviewsCount: 87,
    totalDurationHours: "48m",
    episodesCount: 1,
    priceArs: 15000,
    badge: "Guía Puntual Accesible",
    thumbnailUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop",
    heroBannerUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1920&auto=format&fit=crop",
    doctor: leadDoctor,
    tags: ["Sueño", "Melatonina", "Rutinas", "Sensorial"],
    keyLearningPoints: [
      "La desregulación del ritmo circadiano en neurodivergencias.",
      "Uso responsable de mantas pesadas y ruido blanco/marrón.",
      "El protocolo de desconexión de pantallas 90 minutos antes.",
      "Cuándo consultar al neuropediatra por apoyo farmacológico del sueño."
    ],
    episodes: [
      {
        id: "guia-sueno-ep1",
        episodeNumber: 1,
        title: "Masterclass Intensiva: Protocolo Nocturno de 4 Fases",
        durationMinutes: 48,
        synopsis: "Paso a paso para estructurar la última hora y media antes de acostarse: reducción de estímulos, temperatura ambiental, aromaterapia y transición suave al descanso.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop",
        chapters: [
          { id: "gs-1", timeSeconds: 0, title: "00:00 Fisiología del sueño neurodivergente" },
          { id: "gs-2", timeSeconds: 380, title: "06:20 Ajustes ambientales de la habitación" },
          { id: "gs-3", timeSeconds: 940, title: "15:40 El protocolo de 4 fases" },
          { id: "gs-4", timeSeconds: 1600, title: "26:40 Despertares en mitad de la noche" }
        ],
        resources: [
          { title: "Checklist de Higiene del Sueño Imprimible", type: "checklist", size: "850 KB" }
        ]
      }
    ]
  },
  {
    id: "tdah-adolescencia-autonomia",
    title: "TDAH en la Adolescencia: Autonomía y Escuela Secundaria",
    subtitle: "Acompañando la Transición Hacia la Madurez sin Asfixiar",
    description: "Cuando la demanda académica se multiplica y el control parental debe ceder espacio. Abordaje de impulsividad social, manejo de dinero, pantallas y motivación en la etapa secundaria.",
    condition: "TDAH",
    contentType: "Modulo",
    year: 2025,
    targetAudience: "Adolescentes (13-18 años)",
    rating: 4.88,
    reviewsCount: 76,
    totalDurationHours: "2h 15m",
    episodesCount: 5,
    priceArs: 50000,
    thumbnailUrl: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=800&auto=format&fit=crop",
    heroBannerUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1920&auto=format&fit=crop",
    doctor: leadDoctor,
    tags: ["TDAH", "Adolescencia", "Secundaria", "Independencia"],
    keyLearningPoints: [
      "Por qué las estrategias de la infancia fallan en la secundaria.",
      "Manejo de la motivación y recompensas a mediano plazo.",
      "El adolescente frente a su propio diagnóstico y medicación."
    ],
    episodes: [
      {
        id: "tdah-adol-1",
        episodeNumber: 1,
        title: "Episodio 1: El cerebro adolescente con TDAH",
        durationMinutes: 28,
        synopsis: "Maduración retrasada de la corteza prefrontal y búsqueda de dopamina.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=800&auto=format&fit=crop",
        chapters: [{ id: "ta-1", timeSeconds: 0, title: "00:00 Transformaciones neurobiológicas" }]
      },
      {
        id: "tdah-adol-2",
        episodeNumber: 2,
        title: "Episodio 2: Organización y Estudio en Secundaria",
        durationMinutes: 30,
        synopsis: "Herramientas digitales: Notion, Google Calendar y técnicas de estudio no lineales.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop",
        chapters: [{ id: "ta-2", timeSeconds: 0, title: "00:00 Métodos de estudio adaptados" }]
      },
      {
        id: "tdah-adol-3",
        episodeNumber: 3,
        title: "Episodio 3: Pantallas, Redes y Videojuegos",
        durationMinutes: 27,
        synopsis: "Límites saludables acordados sin batallas campales.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?q=80&w=800&auto=format&fit=crop",
        chapters: [{ id: "ta-3", timeSeconds: 0, title: "00:00 Dopamina y pantallas" }]
      },
      {
        id: "tdah-adol-4",
        episodeNumber: 4,
        title: "Episodio 4: Adherencia a la Medicación y Autonomía",
        durationMinutes: 26,
        synopsis: "El rol del joven en su propio tratamiento médico.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800&auto=format&fit=crop",
        chapters: [{ id: "ta-4", timeSeconds: 0, title: "00:00 Consulta médica conjunta" }]
      },
      {
        id: "tdah-adol-5",
        episodeNumber: 5,
        title: "Episodio 5: Habilidades Sociales e Impulsividad",
        durationMinutes: 24,
        synopsis: "Prevención de aislamiento y construcción de vínculos seguros.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=800&auto=format&fit=crop",
        chapters: [{ id: "ta-5", timeSeconds: 0, title: "00:00 Amistades y neurodivergencia" }]
      }
    ]
  },
  {
    id: "tip-selectividad-alimentaria",
    title: "Tip Clínico: Manejo de Selectividad Alimentaria",
    subtitle: "Sensibilidad Oral, Rechazo a Texturas y Nuevos Alimentos",
    description: "Estrategias de fonoaudiología y terapia ocupacional validadas médicamente para ampliar la variedad de alimentos sin obligar ni generar aversiones traumáticas.",
    condition: "Sensorial",
    contentType: "Tip",
    year: 2026,
    targetAudience: "Preescolar (2-5 años)",
    rating: 4.89,
    reviewsCount: 65,
    totalDurationHours: "35m",
    episodesCount: 1,
    priceArs: 15000,
    badge: "Tip Práctico de Consulta",
    thumbnailUrl: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?q=80&w=800&auto=format&fit=crop",
    heroBannerUrl: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?q=80&w=1920&auto=format&fit=crop",
    doctor: leadDoctor,
    tags: ["Sensorial", "Alimentación", "Texturas", "Tips"],
    keyLearningPoints: [
      "Diferenciar capricho de hiperreactividad sensorial táctil-oral.",
      "La escalera de la alimentación: oler, tocar, lamer antes de comer.",
      "Cómo planificar comidas con un alimento seguro siempre presente."
    ],
    episodes: [
      {
        id: "tip-alim-1",
        episodeNumber: 1,
        title: "Guía en Video: La Escalera de Tolerancia de Texturas",
        durationMinutes: 35,
        synopsis: "Ejemplos en vivo de exposición gradual a texturas crujientes, blandas y húmedas sin forzar la ingesta.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?q=80&w=800&auto=format&fit=crop",
        chapters: [
          { id: "sa-1", timeSeconds: 0, title: "00:00 El componente sensorial de la comida" },
          { id: "sa-2", timeSeconds: 420, title: "07:00 Los 6 escalones de aceptación" }
        ],
        resources: [
          { title: "Tabla de Progresión de Texturas (PDF)", type: "pdf", size: "1.1 MB" }
        ]
      }
    ]
  },
  {
    id: "congreso-neurodesarrollo-2025",
    title: "Congreso de Neurodesarrollo: Actualización Médica",
    subtitle: "Grabación Completa de las 4 Jornadas y Paneles Clínicos",
    description: "Acceso exclusivo a las ponencias del último Congreso Nacional e Internacional sobre diagnóstico temprano de TEA, biomarcadores, neuroinflamación y avances terapéuticos en neurodiversidad.",
    condition: "General",
    contentType: "Congreso",
    year: 2025,
    targetAudience: "Familias y Cuidadores",
    rating: 4.96,
    reviewsCount: 114,
    totalDurationHours: "4h 20m",
    episodesCount: 4,
    priceArs: 50000,
    badge: "Grabación de Congreso",
    thumbnailUrl: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=800&auto=format&fit=crop",
    heroBannerUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1920&auto=format&fit=crop",
    doctor: leadDoctor,
    tags: ["Congreso", "Criterios Diagnósticos", "Investigación", "Evidencia"],
    keyLearningPoints: [
      "Nuevos criterios de detección temprana en menores de 24 meses.",
      "El perfil de presentación del autismo femenino (camuflaje / masking).",
      "Modelos de intervención basados en la evidencia científica actual."
    ],
    episodes: [
      {
        id: "cong-ep-1",
        episodeNumber: 1,
        title: "Sesión Plenaria 1: Diagnóstico Oportuno de TEA en Primera Infancia",
        durationMinutes: 65,
        synopsis: "Pistas tempranas de comunicación social, contacto visual y juego simbólico.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800&auto=format&fit=crop",
        chapters: [{ id: "cg-1", timeSeconds: 0, title: "00:00 Apertura y conferencia central" }]
      },
      {
        id: "cong-ep-2",
        episodeNumber: 2,
        title: "Sesión Plenaria 2: Autismo Femenino y Masking",
        durationMinutes: 60,
        synopsis: "Por qué tantas niñas y mujeres reciben diagnósticos tardíos en la adolescencia o adultez.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop",
        chapters: [{ id: "cg-2", timeSeconds: 0, title: "00:00 Características del camuflaje social" }]
      },
      {
        id: "cong-ep-3",
        episodeNumber: 3,
        title: "Sesión Plenaria 3: Mesa Redonda sobre Farmacología en TDAH",
        durationMinutes: 70,
        synopsis: "Debate interdisciplinario entre neurólogos, psiquiatras y psicopedagogos.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=800&auto=format&fit=crop",
        chapters: [{ id: "cg-3", timeSeconds: 0, title: "00:00 Casos clínicos reales" }]
      },
      {
        id: "cong-ep-4",
        episodeNumber: 4,
        title: "Sesión Plenaria 4: Conclusiones y Preguntas de la Audiencia",
        durationMinutes: 65,
        synopsis: "Respuestas a inquietudes directas planteadas por familiares y profesionales.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800&auto=format&fit=crop",
        chapters: [{ id: "cg-4", timeSeconds: 0, title: "00:00 Preguntas frecuentes respondidas" }]
      }
    ]
  },
  {
    id: "tea-comunicacion-apoyos-visuales",
    title: "Comunicación y Lenguaje en TEA: Apoyos Visuales",
    subtitle: "Sistemas Aumentativos y Alternativos de Comunicación (SAAC)",
    description: "Cómo potenciar la intención comunicativa tanto en niños verbales como no verbales. Uso práctico de agendas pictográficas, tableros de elección y aplicaciones tecnológicas.",
    condition: "Autismo",
    contentType: "Modulo",
    year: 2024,
    targetAudience: "Preescolar (2-5 años)",
    rating: 4.93,
    reviewsCount: 130,
    totalDurationHours: "2h 10m",
    episodesCount: 5,
    priceArs: 50000,
    thumbnailUrl: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop",
    heroBannerUrl: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=1920&auto=format&fit=crop",
    doctor: leadDoctor,
    tags: ["TEA", "Comunicación", "PECS", "SAAC", "Pictogramas"],
    keyLearningPoints: [
      "El mito de que los apoyos visuales impiden que el niño hable.",
      "Cómo armar un tablero de comunicación de baja tecnología.",
      "Estrategias de modelado y espera estructurada."
    ],
    episodes: [
      {
        id: "saac-1",
        episodeNumber: 1,
        title: "Episodio 1: Fundamentos de la Comunicación Aumentativa",
        durationMinutes: 26,
        synopsis: "Derribando el miedo: los apoyos estimulan el desarrollo del lenguaje oral.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop",
        chapters: [{ id: "saac-c1", timeSeconds: 0, title: "00:00 Introducción a los SAAC" }]
      },
      {
        id: "saac-2",
        episodeNumber: 2,
        title: "Episodio 2: Creación de Tableros de Elección",
        durationMinutes: 25,
        synopsis: "Comida, juego y descanso: dando voz y autonomía a través de imágenes.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=800&auto=format&fit=crop",
        chapters: [{ id: "saac-c2", timeSeconds: 0, title: "00:00 Materiales y selección de símbolos" }]
      },
      {
        id: "saac-3",
        episodeNumber: 3,
        title: "Episodio 3: Transiciones sin Frustración",
        durationMinutes: 24,
        synopsis: "La secuencia 'Primero... Luego...' para disminuir la resistencia al cambio.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=800&auto=format&fit=crop",
        chapters: [{ id: "saac-c3", timeSeconds: 0, title: "00:00 Estructura Primero/Luego" }]
      },
      {
        id: "saac-4",
        episodeNumber: 4,
        title: "Episodio 4: Modelado en el Contexto Natural del Juego",
        durationMinutes: 28,
        synopsis: "Cómo enseñar palabras funcionales mientras compartimos actividades placenteras.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop",
        chapters: [{ id: "saac-c4", timeSeconds: 0, title: "00:00 Modelado en situaciones reales" }]
      },
      {
        id: "saac-5",
        episodeNumber: 5,
        title: "Episodio 5: Aplicaciones y Dispositivos Electrónicos",
        durationMinutes: 27,
        synopsis: "Cuándo dar el salto a comunicadores dinámicos y tablets dedicadas.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800&auto=format&fit=crop",
        chapters: [{ id: "saac-c5", timeSeconds: 0, title: "00:00 Apps recomendadas" }]
      }
    ]
  },
  {
    id: "tip-dopamina-pantallas-tdah",
    title: "Tip Clínico: Pantallas y Regulación Dopaminérgica",
    subtitle: "Cómo Evitar la 'Furia al Cortar la Pantalla' en Niños con TDAH",
    description: "Estrategias de transición neurobiológica para cuando llega el momento de apagar tablets o consolas, evitando desregulaciones intensas y gritos.",
    condition: "TDAH",
    contentType: "Tip",
    year: 2026,
    targetAudience: "Escolar (6-12 años)",
    rating: 4.95,
    reviewsCount: 91,
    totalDurationHours: "32m",
    episodesCount: 1,
    priceArs: 15000,
    badge: "Tip Práctico Destacado",
    thumbnailUrl: "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?q=80&w=800&auto=format&fit=crop",
    heroBannerUrl: "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?q=80&w=1920&auto=format&fit=crop",
    doctor: leadDoctor,
    tags: ["TDAH", "Pantallas", "Dopamina", "Tips"],
    keyLearningPoints: [
      "El desplome de dopamina al apagar una pantalla interactiva.",
      "El 'puente de transición': una actividad intermedia agradable antes de una tarea aburrida.",
      "Avisos de tiempo eficaces que no suenan a castigo."
    ],
    episodes: [
      {
        id: "tip-dop-1",
        episodeNumber: 1,
        title: "Clase Rápida: El Descenso Dopaminérgico Suave",
        durationMinutes: 32,
        synopsis: "Cómo aplicar el método de 3 pasos para apagar los dispositivos electrónicos sin discusiones.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?q=80&w=800&auto=format&fit=crop",
        chapters: [
          { id: "dp-1", timeSeconds: 0, title: "00:00 La trampa neuroquímica de los videojuegos" },
          { id: "dp-2", timeSeconds: 360, title: "06:00 La técnica del puente dopaminérgico" }
        ],
        resources: [
          { title: "Protocolo de Pantallas en TDAH (PDF)", type: "pdf", size: "780 KB" }
        ]
      }
    ]
  }
];
