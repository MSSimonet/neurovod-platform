export type ConditionType = 'TDAH' | 'Autismo' | 'Sensorial' | 'General';

export type ContentType = 'Modulo' | 'Guia' | 'Congreso' | 'Tip';

export type TargetAudience =
  | 'Preescolar (2-5 años)'
  | 'Escolar (6-12 años)'
  | 'Adolescentes (13-18 años)'
  | 'Familias y Cuidadores';

export interface Chapter {
  id: string;
  timeSeconds: number;
  title: string;
  description?: string;
}

export type ResourceType = 'pdf' | 'checklist' | 'guide';

export interface EpisodeResource {
  title: string;
  type: ResourceType;
  size: string;
  downloadUrl?: string;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  durationMinutes: number;
  synopsis: string;
  videoUrl: string;
  thumbnailUrl: string;
  chapters: Chapter[];
  resources?: EpisodeResource[];
}

/** Consultorio donde el profesional atiende en persona. */
export interface ConsultingRoom {
  city: string;
  province: string;
  place: string;
  address: string;
}

/** Canales por los que una familia pide turno. */
export interface DoctorContact {
  /** Numero tal como se muestra, en formato legible. */
  whatsapp: string;
  /** Enlace ya armado: evita que cada pantalla invente el formato. */
  whatsappUrl: string;
  /** Telefonos de turnos, como los dicta el consultorio. */
  phones: string[];
  instagramUser: string;
  instagramUrl: string;
}

export interface DoctorProfile {
  name: string;
  title: string;
  specialty: string;
  /**
   * Matriculas profesionales. Requisito E-E-A-T, siempre visibles en la ficha.
   * La primera es la nacional: es la que se muestra sola cuando no entran
   * todas, como en el pie de una tarjeta.
   */
  licenses: string[];
  bio: string;
  avatarUrl: string;
  experienceYears: number;
  inPersonConsultFeeArs: number;
  contact: DoctorContact;
  consultingRooms: ConsultingRoom[];
}

export interface ModuleItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  condition: ConditionType;
  contentType: ContentType;
  year: number;
  targetAudience: TargetAudience;
  rating: number;
  reviewsCount: number;
  totalDurationHours: string;
  episodesCount: number;
  priceArs: number;
  isFeatured?: boolean;
  badge?: string;
  thumbnailUrl: string;
  heroBannerUrl: string;
  doctor: DoctorProfile;
  keyLearningPoints: string[];
  episodes: Episode[];
  tags: string[];
  /** Referencias bibliograficas que respaldan el modulo (E-E-A-T, Voice.md 3). */
  references?: ClinicalReference[];
}

export interface ClinicalReference {
  source: string;
  detail: string;
  year: number;
}

export interface FilterState {
  searchQuery: string;
  condition: ConditionType | 'all';
  contentType: ContentType | 'all';
  year: number | 'all';
  targetAudience: TargetAudience | 'all';
}

/** Transaccion registrada por el panel administrativo. */
export interface Sale {
  id: string;
  moduleId: string;
  moduleTitle: string;
  buyerEmail: string;
  amountArs: number;
  method: string;
  /** Fecha ISO de acreditacion */
  processedAt: string;
  /** Una beca es un acceso otorgado a mano, sin cobro. */
  kind: 'pago' | 'beca';
}

/** Datos que el profesional carga al crear o editar un modulo. */
export interface ModuleDraft {
  title: string;
  subtitle: string;
  description: string;
  condition: ConditionType;
  contentType: ContentType;
  targetAudience: TargetAudience;
  priceArs: number;
  thumbnailUrl: string;
  videoUrl: string;
  pdfTitle: string;
  pdfUrl: string;
}
