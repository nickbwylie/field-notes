import type { TripFrontmatter } from "../types/MyTypes";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { dateToString } from "@/util/date";
import { useNavigate } from "react-router";
import { Skeleton } from "./ui/skeleton";

interface HeroProps {
  /** The trip to feature, or null/undefined while loading (shows skeleton). */
  trip?: TripFrontmatter | null;
}
const LoadingTrip = () => (
  <div className="w-full flex flex-col md:flex-row gap-6 md:gap-8">
    {/* image */}
    <div className="w-full md:w-1/2 flex flex-col">
      <Skeleton className="aspect-[4/3] w-full rounded-[25px]" />
    </div>

    {/* text column — each block mirrors the loaded layout's spacing */}
    <div className="w-full md:w-1/2 flex flex-col">
      {/* date | region */}
      <Skeleton className="h-4 w-2/5" />

      {/* title (two lines) */}
      <Skeleton className="mt-3 h-9 w-full" />
      <Skeleton className="mt-2 h-9 w-3/5" />

      {/* excerpt (three lines) */}
      <Skeleton className="mt-5 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-2/3" />

      {/* stats row */}
      <div className="mt-5 flex gap-6 sm:gap-8">
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
      </div>

      {/* buttons */}
      <div className="mt-5 flex gap-4">
        <Skeleton className="h-9 w-40 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  </div>
);

const Hero = ({ trip }: HeroProps) => {
  const nav = useNavigate();

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        rowGap: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          columnGap: 12,
        }}
      >
        <span className="uppercase text-green-800 text-xs text-nowrap font-[600] tracking-widest">
          latest trip report
        </span>
        <Separator />
      </div>
      {trip ? (
        <div className="w-full flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="w-full md:w-1/2 flex flex-col">
            <img
              src={trip.hero_image}
              alt={trip.title}
              style={{
                maxWidth: "100%",
                borderRadius: 25,
                objectFit: "cover",
              }}
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col">
            <span
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                columnGap: 8,
                alignItems: "center",
              }}
              className="text-sm opacity-40 uppercase"
            >
              <div>{dateToString(trip.created_at)}</div>
              {/* <div></div> */}
              <div>{trip.region}</div>
            </span>
            <div className="text-3xl md:text-4xl font-semibold mt-2">
              {trip.title}
            </div>
            <div className="text-md opacity-60 mt-4">{trip.excerpt}</div>
            <div
              style={{ width: "100%", display: "flex" }}
              className="mt-4 flex-wrap gap-x-6 gap-y-1 sm:gap-x-8"
            >
              <div className="text-md opacity-60">{trip.distance_mi} mi</div>
              <div className="text-md opacity-60">
                {trip.elevation_gain_ft} ft
              </div>
              <div className="text-md opacity-60">{trip.nights} nights</div>
              <div className="text-md  text-red-700">{trip.difficulty}</div>
            </div>

            <div
              style={{
                width: "100%",
                display: "flex",
                columnGap: 16,
                justifyContent: "flex-start",
              }}
              className="mt-4"
            >
              <Button
                className="cursor-pointer"
                onClick={() => nav(`/trips/${trip.id}`)}
              >
                Read trip report →
              </Button>
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => nav(`/trips/`)}
              >
                All trips
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <LoadingTrip />
      )}
    </div>
  );
};
export default Hero;
