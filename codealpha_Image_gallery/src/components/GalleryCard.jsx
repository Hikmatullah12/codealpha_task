const GalleryCard = ({ image, onSelect }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <article
      className="gallery-card"
      onClick={() => onSelect()}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Open ${image.title}`}
    >
      <img src={image.src} alt={image.title} loading="lazy" />

      <div className="card-overlay">
        <div className="card-info">
          <span className="card-category">{image.category}</span>
          <h3>{image.title}</h3>
        </div>
        <span className="view-pill">View Image</span>
      </div>
    </article>
  );
};

export default GalleryCard;
