// TripMap.tsx
import { useEffect, useState } from "react";
import {
  GeoJSON,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { gpx as gpxToGeoJSON } from "@tmcw/togeojson";
import type { GeoJsonObject } from "geojson";

export interface MapPhoto {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  lat: number;
  lng: number;
}

interface TripMapProps {
  gpxUrl: string;
  photos?: MapPhoto[];
}

const FitBounds = ({ geoJson }: { geoJson: GeoJsonObject }) => {
  const map = useMap();

  useEffect(() => {
    const layer = L.geoJSON(geoJson);
    const bounds = layer.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [24, 24],
        maxZoom: 15,
      });
    }
  }, [geoJson, map]);

  return null;
};

const FlyToPhoto = ({ photo }: { photo?: MapPhoto }) => {
  const map = useMap();

  useEffect(() => {
    if (!photo) return;

    map.flyTo([photo.lat, photo.lng], Math.max(map.getZoom(), 14), {
      duration: 0.6,
    });
  }, [photo, map]);

  return null;
};

const createPhotoIcon = (index: number, isSelected: boolean) => {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        height: 30px;
        width: 30px;
        border-radius: 9999px;
        background: ${isSelected ? "#166534" : "#1c1917"};
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
};

export const TripMap = ({ gpxUrl, photos = [] }: TripMapProps) => {
  const [geoJson, setGeoJson] = useState<GeoJsonObject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);

  const selectedPhoto = photos.find((photo) => photo.id === selectedPhotoId);

  useEffect(() => {
    let cancelled = false;

    const loadGpx = async () => {
      try {
        setError(null);

        const response = await fetch(gpxUrl);

        if (!response.ok) {
          throw new Error(`Failed to load GPX file: ${response.status}`);
        }

        const gpxText = await response.text();
        const gpxDocument = new DOMParser().parseFromString(
          gpxText,
          "application/xml",
        );

        const parserError = gpxDocument.querySelector("parsererror");

        if (parserError) {
          throw new Error("Invalid GPX file");
        }

        const converted = gpxToGeoJSON(gpxDocument) as GeoJsonObject;

        if (!cancelled) {
          setGeoJson(converted);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load map");
        }
      }
    };

    loadGpx();

    return () => {
      cancelled = true;
    };
  }, [gpxUrl]);

  if (error) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!geoJson) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-2xl border border-stone-200 bg-stone-50 text-sm text-stone-500">
        Loading map...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <MapContainer
        center={[38.5, -90.5]}
        zoom={10}
        scrollWheelZoom={false}
        className="h-[400px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <GeoJSON
          data={geoJson}
          style={{
            weight: 4,
            opacity: 0.9,
          }}
        />

        {photos.map((photo, index) => (
          <Marker
            key={photo.id}
            position={[photo.lat, photo.lng]}
            icon={createPhotoIcon(index, selectedPhotoId === photo.id)}
            eventHandlers={{
              click: () => setSelectedPhotoId(photo.id),
            }}
          >
            <Popup>
              <div className="w-56 overflow-hidden rounded-xl">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="h-full w-full object-cover"
                  />

                  {photo.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-3 pb-3 pt-10 text-white">
                      <div className="text-sm font-medium leading-snug">
                        {photo.caption}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        <FitBounds geoJson={geoJson} />
        <FlyToPhoto photo={selectedPhoto} />
      </MapContainer>

      {photos.length > 0 && (
        <div className="border-t border-stone-200 bg-white p-3">
          <div className="mb-3 text-sm font-semibold">Photo stops</div>

          <div className="flex flex-col gap-2">
            {photos.map((photo, index) => {
              const isSelected = selectedPhotoId === photo.id;

              return (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setSelectedPhotoId(photo.id)}
                  className={`flex w-full items-center gap-3 rounded-lg border p-2 text-left transition ${
                    isSelected
                      ? "border-green-800 bg-green-50"
                      : "border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                      isSelected ? "bg-green-800" : "bg-stone-900"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="h-12 w-16 shrink-0 rounded-md object-cover"
                  />

                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {photo.caption ?? photo.alt}
                    </div>
                    <div className="text-xs text-stone-500">
                      View location on map
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
