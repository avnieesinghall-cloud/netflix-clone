function Navbar({ search, setSearch, setShowLogin }) {
  return (
    <nav className="navbar">
      <h1>StreamFlix</h1>

      <input
        type="text"
        placeholder="Search movies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <button className="login-btn" onClick={() => setShowLogin(true)}>
        Login
      </button>
    </nav>
  );
}

export default Navbar;