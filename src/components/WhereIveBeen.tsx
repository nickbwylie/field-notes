import { useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router";
import type { TripFrontmatter } from "@/types/MyTypes";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

interface WhereIveBeenProps {
  trips: TripFrontmatter[];
}

const createPinIcon = (index: number) =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        height: 30px;
        width: 30px;
        border-radius: 9999px;
        background: #1c1917;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 700;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.35);
      ">
        ${index + 1}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

const SectionHeader = () => (
  <div className="flex w-full flex-row items-center gap-3">
    <span className="text-nowrap text-xs font-[600] uppercase tracking-widest text-green-800">
      where i've been
    </span>
    <Separator />
    <span className="hidden text-nowrap text-xs opacity-50 sm:block">
      every trip, one map
    </span>
  </div>
);

const LoadingWhereIveBeen = () => (
  <div className="flex w-full flex-col gap-4 sm:gap-6">
    <SectionHeader />

    {/* stat cards */}
    <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-lg bg-stone-100 px-4 py-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-2 h-7 w-14" />
        </div>
      ))}
    </div>

    {/* map + chip strip */}
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <Skeleton className="h-[320px] w-full rounded-none sm:h-[400px]" />
      <div className="flex gap-2 overflow-hidden border-t border-stone-200 bg-white p-3">
        <Skeleton className="h-8 w-44 rounded-lg" />
        <Skeleton className="h-8 w-56 rounded-lg" />
        <Skeleton className="h-8 w-48 rounded-lg" />
      </div>
    </div>
  </div>
);

const FitAllPins = ({ positions }: { positions: [number, number][] }) => {
  const map = useMap();
  const fitted = useRef(false);

  if (!fitted.current && positions.length > 0) {
    fitted.current = true;
    map.fitBounds(L.latLngBounds(positions), { padding: [60, 60], maxZoom: 5 });
  }

  return null;
};

export const WhereIveBeen = ({ trips }: WhereIveBeenProps) => {
  const nav = useNavigate();
  const markerRefs = useRef<Record<number, L.Marker | null>>({});
  const mapRef = useRef<L.Map | null>(null);

  const pins = trips.filter(
    (t) =>
      t.location_lat &&
      t.location_lng &&
      !Number.isNaN(Number(t.location_lat)) &&
      !Number.isNaN(Number(t.location_lng)),
  );

  // No data yet (fetch in flight) — mirror the loaded layout with skeletons.
  if (trips.length === 0) return <LoadingWhereIveBeen />;

  // Data loaded but nothing has coordinates — nothing to map.
  if (pins.length === 0) return null;

  const totalMiles = trips.reduce((sum, t) => sum + (t.distance_mi ?? 0), 0);
  const totalGain = trips.reduce(
    (sum, t) => sum + (t.elevation_gain_ft ?? 0),
    0,
  );
  const totalNights = trips.reduce((sum, t) => sum + (t.nights ?? 0), 0);
  const states = new Set(trips.map((t) => t.location_state).filter(Boolean))
    .size;

  const positions: [number, number][] = pins.map((t) => [
    Number(t.location_lat),
    Number(t.location_lng),
  ]);

  const flyToTrip = (index: number) => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo(positions[index], Math.max(map.getZoom(), 8), { duration: 0.8 });
    markerRefs.current[index]?.openPopup();
  };

  const stats = [
    { label: "trail miles", value: totalMiles.toFixed(1) },
    { label: "feet climbed", value: totalGain.toLocaleString() },
    { label: "nights out", value: `${totalNights}` },
    { label: "states", value: `${states}` },
  ];

  return (
    <div className="flex w-full flex-col gap-4 sm:gap-6">
      <SectionHeader />

      <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-stone-100 px-4 py-3">
            <div className="text-xs uppercase tracking-widest opacity-50">
              {stat.label}
            </div>
            <div className="mt-1 text-2xl font-semibold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <MapContainer
          center={positions[0]}
          zoom={4}
          scrollWheelZoom={false}
          className="h-[400px] w-full sm:h-[500px] "
          ref={mapRef}
          style={{ zIndex: 10 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {pins.map((trip, index) => (
            <Marker
              key={trip.id}
              position={positions[index]}
              icon={createPinIcon(index)}
              ref={(marker) => {
                markerRefs.current[index] = marker;
              }}
            >
              <Popup>
                <div
                  className="w-48 cursor-pointer"
                  onClick={() => nav(`/trips/${trip.id}`)}
                >
                  <img
                    src={trip.hero_image}
                    alt={trip.title}
                    className="aspect-video w-full rounded-lg object-cover"
                  />
                  <div className="mt-2 text-sm font-semibold leading-snug">
                    {trip.title}
                  </div>
                  <div className="mt-0.5 text-xs text-stone-500">
                    {trip.location_area}, {trip.location_state}
                  </div>
                  <div className="text-xs text-stone-500">
                    {trip.distance_mi} mi · {trip.elevation_gain_ft} ft ·{" "}
                    {trip.nights > 0 ? `${trip.nights} nights` : "day hike"}
                  </div>
                  <div className="mt-1.5 text-xs font-semibold text-green-800">
                    Read trip report →
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          <FitAllPins positions={positions} />
        </MapContainer>

        <div className="flex gap-2 overflow-x-auto border-t border-stone-200 bg-white p-3">
          {pins.map((trip, index) => (
            <button
              key={trip.id}
              type="button"
              onClick={() => flyToTrip(index)}
              className="flex shrink-0 items-center gap-2 rounded-lg border border-stone-200 px-3 py-1.5 text-xs transition hover:bg-stone-50"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-900 text-[10px] font-bold text-white">
                {index + 1}
              </span>
              <span className="font-medium">{trip.title}</span>
              <span className="text-stone-400">{trip.difficulty}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
