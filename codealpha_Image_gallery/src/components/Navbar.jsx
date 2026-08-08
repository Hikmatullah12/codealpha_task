const Navbar = () => {
  return (
    <header className="navbar">
      <a href="#" className="brand">
        <span className="brand-mark">✦</span>
        <span>PixelVista</span>
      </a>
      <nav className="nav-links" aria-label="Primary navigation">
        <a href="#gallery">Gallery</a>
        <a href="#footer">Contact</a>
      </nav>
    </header>
  );
};

export default Navbar;
