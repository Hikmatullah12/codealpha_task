import { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FilterButtons from './components/FilterButtons';
import Gallery from './components/Gallery';
import Lightbox from './components/Lightbox';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import images from './data/images';

const categories = ['All', 'Nature', 'Cities', 'Animals', 'Technology'];

function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const visibleImages = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = images.filter((image) => {
      const matchesCategory = activeCategory === 'All' || image.category === activeCategory;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        image.title.toLowerCase().includes(normalizedQuery) ||
        image.category.toLowerCase().includes(normalizedQuery) ||
        image.description.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });

    return filtered;
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    if (selectedImageIndex === null) return;

    if (visibleImages.length === 0 || selectedImageIndex >= visibleImages.length) {
      setSelectedImageIndex(null);
    }
  }, [selectedImageIndex, visibleImages.length]);

  useEffect(() => {
    if (selectedImageIndex === null) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedImageIndex(null);
      } else if (event.key === 'ArrowLeft') {
        setSelectedImageIndex((current) =>
          current === null ? 0 : (current > 0 ? current - 1 : visibleImages.length - 1)
        );
      } else if (event.key === 'ArrowRight') {
        setSelectedImageIndex((current) =>
          current === null ? 0 : (current + 1) % visibleImages.length
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, visibleImages.length]);

  const openLightbox = (index) => setSelectedImageIndex(index);
  const closeLightbox = () => setSelectedImageIndex(null);

  const navigateImage = (direction) => {
    setSelectedImageIndex((current) => {
      if (current === null) return direction === 1 ? 0 : visibleImages.length - 1;
      const next = current + direction;
      if (next < 0) return visibleImages.length - 1;
      if (next >= visibleImages.length) return 0;
      return next;
    });
  };

  return (
    <div className="app-shell">
      <Navbar />
      <Hero />

      <main id="gallery" className="main-content">
        <section className="gallery-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Curated Collection</p>
              <h2>Discover the perfect frame for every mood</h2>
            </div>
            <p className="section-copy">
              Browse through striking visuals that capture nature, city life, wildlife, and innovation.
            </p>
          </div>

          <div className="toolbar">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <FilterButtons
              categories={categories}
              activeCategory={activeCategory}
              onFilterChange={setActiveCategory}
            />
          </div>

          {visibleImages.length === 0 ? (
            <div className="empty-state">
              <h3>No images found</h3>
              <p>Try a different keyword or switch to another category.</p>
            </div>
          ) : (
            <Gallery images={visibleImages} onSelectImage={openLightbox} />
          )}
        </section>
      </main>

      {selectedImageIndex !== null && (
        <Lightbox
          image={visibleImages[selectedImageIndex]}
          onClose={closeLightbox}
          onPrevious={() => navigateImage(-1)}
          onNext={() => navigateImage(1)}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;
