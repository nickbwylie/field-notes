import { supabase } from "@/lib/supabase";
import type { Trip, TripFrontmatter } from "@/types/MyTypes";

export async function getTrips() {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getAllTrips(): Promise<TripFrontmatter[]> {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getTripDetails(tripID: string): Promise<Trip | null> {
  const { data, error } = await supabase
    .from("trip_details")
    .select("*")
    .eq("trip_id", Number(tripID));

  const { data: data2 } = await supabase
    .from("trips")
    .select("*")
    .eq("id", Number(tripID));

  if (error) {
    throw new Error(error.message);
  }
  if (!data || !data2) return null;

  return {
    ...data[0],
    ...data2[0],
  };
}
