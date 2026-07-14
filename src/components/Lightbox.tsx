import { useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { TripPhoto } from "@/types/MyTypes";

interface LightboxProps {
  photos: TripPhoto[];
  /** Index of the open photo, or null when closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * Fullscreen photo viewer shared by the gallery, the map popups, and the
 * photo-stop list. Supports arrow keys, Escape, swipe, and click-outside.
 */
export const Lightbox = ({ photos, index, onClose, onNavigate }: LightboxProps) => {
  const open = index !== null && index >= 0 && index < photos.length;
  const touchStartX = useRef<number | null>(null);

  const prev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + photos.length) % photos.length);
  }, [index, photos.length, onNavigate]);

  const next = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % photos.length);
  }, [index, photos.length, onNavigate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, prev, next, onClose]);

  if (!open) return null;
  const photo = photos[index];
  const showNav = photos.length > 1;

  return (
    <div
      className="fixed inset-0 z-[2000] flex flex-col bg-black/95"
      onClick={onClose}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(delta) > 50) (delta > 0 ? prev : next)();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt ?? photo.caption}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/25"
      >
        <X className="h-5 w-5" />
      </button>

      {showNav && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/25 md:left-4"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/25 md:right-4"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <div className="flex min-h-0 flex-1 items-center justify-center p-4 pt-14">
        <img
          src={photo.src}
          alt={photo.alt ?? photo.caption}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full rounded-lg object-contain"
        />
      </div>

      <div
        className="shrink-0 px-6 pb-6 pt-2 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {photo.caption && (
          <div className="mx-auto max-w-2xl text-sm leading-snug text-white">
            {photo.caption}
          </div>
        )}
        <div className="mt-1 text-xs text-white/50">
          {index + 1} / {photos.length}
        </div>
      </div>
    </div>
  );
};
