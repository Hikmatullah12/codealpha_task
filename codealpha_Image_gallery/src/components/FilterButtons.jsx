const FilterButtons = ({ categories, activeCategory, onFilterChange }) => {
  return (
    <div className="filter-bar" role="group" aria-label="Image categories">
      {categories.map((category) => {
        const isActive = activeCategory === category;

        return (
          <button
            key={category}
            type="button"
            className={`filter-btn ${isActive ? 'active' : ''}`}
            onClick={() => onFilterChange(category)}
            aria-pressed={isActive}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};

export default FilterButtons;
