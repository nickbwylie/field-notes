import type { TripPhoto } from "@/types/MyTypes";

interface PhotoGalleryProps {
  photos: TripPhoto[];
  /** Called with the photo's index; opens the shared lightbox. */
  onPhotoClick?: (index: number) => void;
}

export const PhotoGallery = ({ photos, onPhotoClick }: PhotoGalleryProps) => {
  return (
    <div className="grid grid-flow-row grid-cols-2 gap-3 sm:gap-4">
      {photos.map((photo, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onPhotoClick?.(index)}
          className="group relative w-full cursor-zoom-in overflow-hidden rounded-lg text-left"
        >
          <img
            src={photo.src}
            alt={photo.alt ?? photo.caption}
            loading="lazy"
            className="h-auto w-full rounded-lg transition duration-300 group-hover:scale-[1.02]"
          />
          {photo.caption && (
            <div className="absolute inset-x-0 bottom-0 rounded-b-lg bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8 text-white opacity-0 transition duration-200 group-hover:opacity-100">
              <div className="text-xs leading-snug">{photo.caption}</div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};
