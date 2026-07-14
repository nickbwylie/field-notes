import type { Trip, TripPhoto } from "@/types/MyTypes";
import { dateToString } from "@/util/date";
import { difficultyColorToClass } from "@/util/colorutil";
import { TripMap, type MapPhoto } from "./TripMap";
import { PhotoGallery } from "./PhotoGallery";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getTripDetails } from "@/apiCalls/api";

export const TripReport = () => {
  const bg = ["bg-blue-800", "bg-green-800", "bg-yellow-800", "bg-orange-800"];
  const index = Math.floor(Math.random() * bg.length);

  const { slug } = useParams<{ slug: string }>();

  const [trip, setTrip] = useState<Trip | null>();


  const StatBlock = (name: string, val: string, isLast?: boolean) => {
    return (
      <div className={`w-1/6 ${!isLast ? "border-r-2" : ""}`}>
        <div className="flex flex-col p-4">
          <div className="text-xs uppercase tracking-widest opacity-50">
            {name}
          </div>
          <div className="mt-1 text-md font-semibold">{val}</div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!slug) return;
    async function test() {
      setTrip(await getTripDetails(slug as string));
    }
    test();
  }, [slug]);
  console.log("trip data", trip);

  if (!trip) return null;

  // Gallery photos that have coordinates (from EXIF GPS or manual
  // lat/lng in trip.md) become "photo stops" on the map.
  const galleryPhotos = (trip.gallery ?? []) as unknown as TripPhoto[];
  const mapPhotos: MapPhoto[] = galleryPhotos
    .filter((p) => p.lat != null && p.lng != null)
    .map((p, index) => ({
      id: `photo-stop-${index}`,
      src: p.src,
      alt: p.alt ?? p.caption,
      caption: p.caption,
      lat: p.lat as number,
      lng: p.lng as number,
    }));

  return (
    <div className="flex flex-col justify-start gap-6">
      <Breadcrumb className="">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-gray-400">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/trips/" className="text-gray-400">
              Trips
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-800">
              {trip.type}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full gap-3">
          <div className="flex flex-row items-center gap-2 rounded-xl border border-gray-200 bg-stone-100 px-4 py-1 text-sm">
            <div className={`h-2 w-2 rounded-full ${bg[index]}`}></div>
            <div>{trip.type}</div>
          </div>

          <div
            className={`rounded-xl px-4 py-1 text-sm ${difficultyColorToClass(
              trip.difficulty,
            )}`}
          >
            {trip.difficulty}
          </div>
        </div>

        <div className="text-4xl font-bold">{trip.title}</div>

        <div className="text-md tracking-widest opacity-50">
          {dateToString(trip.created_at)} | {trip.region}
        </div>
      </div>

      <div className="flex w-full flex-col">
        <img
          src={trip.hero_image}
          alt={trip.title}
          style={{
            maxWidth: "100%",
            borderRadius: 25,
            objectFit: "cover",
            maxHeight: 600,
          }}
        />
      </div>

      <div className="flex w-full flex-row rounded-lg border-2">
        {StatBlock("distance", `${trip.distance_mi} mi`)}
        {StatBlock("elev gain", `${trip.elevation_gain_ft} ft`)}
        {StatBlock("nights", `${trip.nights}`)}
        {StatBlock("difficulty", `${trip.difficulty}`)}
        {StatBlock("region", `${trip.region}`)}
        {StatBlock("date", `${dateToString(trip.created_at)}`, true)}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex w-full flex-col gap-8 opacity-80 lg:w-3/5">
          <div
            className="opacity-80"
            dangerouslySetInnerHTML={{ __html: trip.body_html }}
          />

          <div className="w-full">
            <div className="text-xl font-semibold">Route notes</div>

            <div className="mt-3 rounded-lg border-2">
              {(trip.route_notes as { body: string; label: string }[]).map(
                (note, index) => (
                  <div
                    className="flex w-full flex-row gap-2 border-b-2 p-4 last:border-b-0"
                    key={index}
                  >
                    <div className="w-1/3 text-xs uppercase tracking-widest text-green-800">
                      {note.label}
                    </div>
                    <div className="w-2/3 text-md opacity-80">{note.body}</div>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="flex w-full flex-col gap-4">
            <div className="w-full text-xl font-semibold">Photo gallery</div>
            <PhotoGallery photos={galleryPhotos} />
          </div>

          <div className="w-full">
            <div className="flex w-full flex-col rounded-xl border-2 bg-stone-100 p-4">
              <div className="flex w-full flex-row items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-800"></div>
                <div className="text-sm font-semibold">Lessons learned</div>
              </div>

              <ul className="mt-2 w-full list-disc pl-5 opacity-70">
                {trip.lessons_learned.map((lesson, index) => (
                  <li key={index} className="mb-2 text-xs">
                    {lesson}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/5">
          <div className="lg:sticky lg:top-6">
            {trip.gpx_url ? (
              <TripMap gpxUrl={trip.gpx_url} photos={mapPhotos} />
            ) : (
              <div className="flex h-[520px] items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-50 text-sm text-stone-500">
                No GPX map added for this trip yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
