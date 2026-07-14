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
import { useNavigate } from "react-router";
import { Skeleton } from "./ui/skeleton";

interface TripCardProps {
  trip: TripFrontmatter;
}

export const TripCard = ({ trip }: TripCardProps) => {
  const nav = useNavigate();
  return (
    <Card
      className="mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden pt-0 cursor-pointer "
      onClick={() => nav(`/trips/${trip.id}`)}
    >
      <div className="relative aspect-video w-full shrink-0 max-h-48">
        <div className="absolute inset-0 z-10 " />

        <img
          src={trip.hero_image}
          alt="Event cover"
          className="h-full w-full object-cover"
        />
      </div>

      <CardHeader className="flex-1">
        <CardTitle>
          <div className="text-xs uppercase tracking-widest opacity-50">
            {dateToString(trip.created_at)} {trip.region}
          </div>

          <div className="line-clamp-2 text-lg font-semibold">{trip.title}</div>
        </CardTitle>

        <CardDescription className="line-clamp-3">
          {trip.excerpt}
        </CardDescription>
      </CardHeader>

      <CardFooter className="mt-auto bg-white">
        <div className="flex w-full items-center gap-10">
          <div className="text-sm opacity-60">{trip.distance_mi} mi</div>

          <div className="text-sm opacity-60">{trip.elevation_gain_ft} ft</div>

          <div
            className={`rounded-xl px-4 py-1 text-sm ${difficultyColorToClass(trip.difficulty)}`}
          >
            {trip.difficulty}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export function TripCardSkeleton() {
  return (
    <Card className="mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden pt-0">
      <Skeleton className="aspect-video w-full max-h-48 rounded-none" />

      <CardHeader className="flex-1 space-y-3">
        <Skeleton className="h-3 w-40" />

        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />

        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>

      <CardFooter>
        <div className="flex w-full items-center gap-10">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
      </CardFooter>
    </Card>
  );
}
