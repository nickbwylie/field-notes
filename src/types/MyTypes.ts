export interface Image {
  id: number;
  url: string;
  alt: string;
}

export type TripType = "Hiking" | "Backpacking";

export type Difficulty = "Easy" | "Moderate" | "Strenuous";

export type RouteShape = "Loop" | "Out & Back" | "Point-to-Point";

export interface TripStats {
  distanceMi: number; // 9.8
  elevationGainFt: number; // 1470
  nights: number; // 0 = day hike
  difficulty: Difficulty;
  routeShape: RouteShape;
  highPointFt?: number;
}

/** One labelled route note (Water, Navigation, Camp, Bail-out…). */
export interface RouteNote {
  label: string; // 'WATER'
  body: string;
}

/** A captioned gallery image. */
export interface TripPhoto {
  src: string; // '/photos/bell/summit.jpg'
  caption: string;
  alt?: string;
}

/** Frontmatter parsed from each trip's MDX file. */
export interface TripFrontmatter {
  slug: string; // 'bell-mountain'
  title: string;
  type: TripType;
  date: string; // ISO 8601: '2025-10-12'
  region: string; // 'St. Francois Mtns, MO'
  location: {
    area: string;
    state: string;
    lat?: number;
    lng?: number;
  };
  tags: string[]; // ['glades', 'rhyolite', 'solitude']
  excerpt: string;
  heroImage: string;
  gpxUrl?: string;
  featured?: boolean;
  draft?: boolean;
  stats: TripStats;
}

export interface Trip extends TripFrontmatter {
  bodyHtml: string; // rendered MDX
  routeNotes: RouteNote[];
  gallery: TripPhoto[];
  lessonsLearned: string[];
  wouldDoDifferently: string[];
  readingTimeMin: number;
}
