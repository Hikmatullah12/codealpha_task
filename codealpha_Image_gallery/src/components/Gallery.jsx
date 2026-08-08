import { useEffect, useState } from 'react';
import GalleryCard from './GalleryCard';

const Gallery = ({ images, onSelectImage }) => {
  const [visibleImages, setVisibleImages] = useState(images);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisibleImages(images);
    }, 120);

    return () => window.clearTimeout(timer);
  }, [images]);

  return (
    <div className="gallery-grid" key={images.map((image) => image.id).join('-')}>
      {visibleImages.map((image, index) => (
        <GalleryCard key={image.id} image={image} onSelect={() => onSelectImage(index)} />
      ))}
    </div>
  );
};

export default Gallery;
