import { useEffect, useRef } from 'react';

const Lightbox = ({ image, onClose, onPrevious, onNext }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowRight') {
        onNext();
      } else if (event.key === 'ArrowLeft') {
        onPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onNext, onPrevious]);

  const handleBackdropClick = (event) => {
    if (contentRef.current && !contentRef.current.contains(event.target)) {
      onClose();
    }
  };

  return (
    <div className="lightbox-backdrop" role="dialog" aria-modal="true" onClick={handleBackdropClick}>
      <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close lightbox">
        ×
      </button>

      <button type="button" className="lightbox-nav prev" onClick={onPrevious} aria-label="Previous image">
        ‹
      </button>

      <div className="lightbox-content" ref={contentRef}>
        <img src={image.src} alt={image.title} />
        <div className="lightbox-caption">
          <p className="card-category">{image.category}</p>
          <h3>{image.title}</h3>
          <p>{image.description}</p>
        </div>
      </div>

      <button type="button" className="lightbox-nav next" onClick={onNext} aria-label="Next image">
        ›
      </button>
    </div>
  );
};

export default Lightbox;
