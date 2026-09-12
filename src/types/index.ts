export type ConditionType = 'TDAH' | 'Autismo' | 'Sensorial' | 'General';

export type ContentType = 'Modulo' | 'Guia' | 'Congreso' | 'Tip';

export type TargetAudience = 'Preescolar (2-5 años)' | 'Escolar (6-12 años)' | 'Adolescentes (13-18 años)' | 'Familias y Cuidadores';

export interface Chapter {
  id: string;
  timeSeconds: number;
  title: string;
  description?: string;
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
  resources?: {
    title: string;
    type: 'pdf' | 'checklist' | 'guide';
    size: string;
    downloadUrl?: string;
  }[];
}

export interface DoctorProfile {
  name: string;
  title: string;
  specialty: string;
  licenseNumber: string; // Matrícula profesional
  bio: string;
  avatarUrl: string;
  experienceYears: number;
  inPersonConsultFeeArs: number; // Ej: 60.000 ARS
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
  priceArs: number; // 50.000 ARS o 15.000 ARS
  isFeatured?: boolean;
  badge?: string;
  thumbnailUrl: string;
  heroBannerUrl: string;
  doctor: DoctorProfile;
  keyLearningPoints: string[];
  episodes: Episode[];
  tags: string[];
}

export interface FilterState {
  searchQuery: string;
  condition: ConditionType | 'all';
  contentType: ContentType | 'all';
  year: number | 'all';
  targetAudience: TargetAudience | 'all';
}
