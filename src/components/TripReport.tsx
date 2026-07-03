import type { Trip } from "@/types/MyTypes";
import { dateToString } from "@/util/date";
import { difficultyColorToClass } from "@/util/colorutil";
import BellMountain from "../assets/bellmountain.jpg";
import { TripMap } from "./TripMap";
import { PhotoGallery } from "./PhotoGallery";

interface TripReportProps {
  trip: Trip;
}

export const TripReport = ({ trip }: TripReportProps) => {
  const bg = ["bg-blue-800", "bg-green-800", "bg-yellow-800", "bg-orange-800"];
  const index = Math.floor(Math.random() * bg.length);

  const testMapPhotos = [
    {
      id: "summit-view",
      src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
      alt: "Mountain landscape",
      caption: "Viewpoint near the ridge",
      lat: 37.6899,
      lng: -90.8645,
    },
    {
      id: "forest-trail",
      src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80",
      alt: "Forest trail",
      caption: "Shaded section of trail",
      lat: 37.6828,
      lng: -90.8576,
    },
    {
      id: "camp-spot",
      src: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80",
      alt: "Tent in the woods",
      caption: "Possible camp area",
      lat: 37.6767,
      lng: -90.8528,
    },
  ];

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

  return (
    <div className="flex flex-col justify-start gap-6">
      <div className="flex w-full gap-3">
        <div className="flex flex-row items-center gap-2 rounded-xl border border-gray-200 bg-stone-100 px-4 py-1 text-sm">
          <div className={`h-2 w-2 rounded-full ${bg[index]}`}></div>
          <div>{trip.type}</div>
        </div>

        <div
          className={`rounded-xl px-4 py-1 text-sm ${difficultyColorToClass(
            trip.stats.difficulty,
          )}`}
        >
          {trip.stats.difficulty}
        </div>
      </div>

      <div className="text-4xl font-bold">{trip.title}</div>

      <div className="text-md tracking-widest opacity-50">
        {dateToString(trip.date)} | {trip.region}
      </div>

      <div className="flex w-full flex-col">
        <img
          src={BellMountain}
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
        {StatBlock("distance", `${trip.stats.distanceMi} mi`)}
        {StatBlock("elev gain", `${trip.stats.elevationGainFt} ft`)}
        {StatBlock("nights", `${trip.stats.nights}`)}
        {StatBlock("difficulty", `${trip.stats.difficulty}`)}
        {StatBlock("region", `${trip.region}`)}
        {StatBlock("date", `${dateToString(trip.date)}`, true)}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex w-full flex-col gap-8 opacity-80 lg:w-3/5">
          <div
            className="opacity-80"
            dangerouslySetInnerHTML={{ __html: trip.bodyHtml }}
          />

          <div className="w-full">
            <div className="text-xl font-semibold">Route notes</div>

            <div className="mt-3 rounded-lg border-2">
              {trip.routeNotes.map((note, index) => (
                <div
                  className="flex w-full flex-row gap-2 border-b-2 p-4 last:border-b-0"
                  key={index}
                >
                  <div className="w-1/3 text-xs uppercase tracking-widest text-green-800">
                    {note.label}
                  </div>
                  <div className="w-2/3 text-md opacity-80">{note.body}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-4">
            <div className="w-full text-xl font-semibold">Photo gallery</div>
            <PhotoGallery photos={trip.gallery} />
          </div>

          <div className="w-full">
            <div className="flex w-full flex-col rounded-xl border-2 bg-stone-100 p-4">
              <div className="flex w-full flex-row items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-800"></div>
                <div className="text-sm font-semibold">Lessons learned</div>
              </div>

              <ul className="mt-2 w-full list-disc pl-5 opacity-70">
                {trip.lessonsLearned.map((lesson, index) => (
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
            {trip.gpxUrl ? (
              <TripMap gpxUrl={trip.gpxUrl} photos={testMapPhotos} />
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
