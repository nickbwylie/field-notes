import type { TripPhoto } from "@/types/MyTypes";

export const PhotoGallery = ({ photos }: { photos: TripPhoto[] }) => {
  return (
    <div className="grid grid-flow-row grid-cols-3 lg:grid-cols-2 gap-4">
      {photos.map((photo, index) => (
        <div key={index} className="w-full relative">
          <img
            src={photo.src}
            alt={photo.alt}
            className="w-full h-auto rounded-lg"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent px-4 pb-4 pt-12 text-white rounded-b-lg">
            <div className="text-xs leading-snug ">{photo.caption}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
