import type { Json } from "@/lib/database.types";

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
  /** Where the photo was taken (EXIF GPS or manual lat/lng in trip.md). Photos with coords render as "photo stops" on the trip map. */
  lat?: number;
  lng?: number;
}

/** Frontmatter parsed from each trip's MDX file. */
export interface TripFrontmatter {
  created_at: string;
  difficulty: string;
  distance_mi: number;
  elevation_gain_ft: number;
  excerpt: string;
  featured: boolean;
  gpx_url: string;
  hero_image: string;
  high_point_ft: number;
  id: number;
  location_area: string;
  location_lat: string;
  location_lng: string;
  location_state: string;
  nights: number;
  reading_time_min: number;
  region: string;
  route_shape: string;
  tags: string[];
  title: string;
  type: string;
}

export interface Trip extends TripFrontmatter {
  body_html: string; // rendered MDX
  route_notes: Json; //RouteNote[];
  gallery: Json; //TripPhoto[];
  lessons_learned: string[];
  would_do_differently: string[];
  reading_time_min: number;
}
