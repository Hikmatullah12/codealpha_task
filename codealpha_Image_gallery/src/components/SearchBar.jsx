const SearchBar = ({ value, onChange }) => {
  return (
    <label className="search-bar" htmlFor="image-search">
      <span className="search-icon" aria-hidden="true">
        🔎
      </span>
      <span className="sr-only">Search gallery images</span>
      <input
        id="image-search"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by title, category, or description"
        aria-describedby="search-help"
      />
      <span id="search-help" className="sr-only">
        Search by title, category, or description.
      </span>
    </label>
  );
};

export default SearchBar;
