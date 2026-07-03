import type { Image } from "../types/MyTypes";

interface ImageCarouselProps {
  images: Image[];
  imageIndex: number;
}

const ImageCarousel = ({ images, imageIndex }: ImageCarouselProps) => {
  // need next back arrows

  return images.length > 0 ? (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <img
        src={images[imageIndex].url}
        alt={images[imageIndex].alt}
        style={{ maxWidth: "100%", maxHeight: "400px" }}
      />
    </div>
  ) : (
    <p>No images available</p>
  );
};

export default ImageCarousel;
