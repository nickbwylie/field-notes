import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import type { TripFrontmatter } from "../types/MyTypes";
import { dateToString } from "@/util/date";
import { difficultyColorToClass } from "@/util/colorutil";

interface TripCardProps {
  trip: TripFrontmatter;
}

export const TripCard = ({ trip }: TripCardProps) => {
  return (
    <Card className="mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden pt-0">
      <div className="relative aspect-video w-full shrink-0 max-h-48">
        <div className="absolute inset-0 z-10 " />

        <img
          src={trip.heroImage}
          alt="Event cover"
          className="h-full w-full object-cover"
        />
      </div>

      <CardHeader className="flex-1">
        <CardTitle>
          <div className="text-xs uppercase tracking-widest opacity-50">
            {dateToString(trip.date)} {trip.region}
          </div>

          <div className="line-clamp-2 text-lg font-semibold">{trip.title}</div>
        </CardTitle>

        <CardDescription className="line-clamp-3">
          {trip.excerpt}
        </CardDescription>
      </CardHeader>

      <CardFooter className="mt-auto bg-white">
        <div className="flex w-full items-center gap-10">
          <div className="text-sm opacity-60">{trip.stats.distanceMi} mi</div>

          <div className="text-sm opacity-60">
            {trip.stats.elevationGainFt} ft
          </div>

          <div
            className={`rounded-xl px-4 py-1 text-sm ${difficultyColorToClass(trip.stats.difficulty)}`}
          >
            {trip.stats.difficulty}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
