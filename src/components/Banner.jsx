import { useEffect, useState } from "react";
import { searchMovies, imageUrl } from "../api/tmdb";

function Banner({ movie }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );

  useEffect(() => {
    const fetchSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      const movies = await searchMovies(query);
      setResults(movies);
    };

    fetchSearch();
  }, [query]);

  const toggleFavorite = (movie, e) => {
    e.stopPropagation();

    const exists = favorites.find((fav) => fav.id === movie.id);

    let updatedFavorites;

    if (exists) {
      updatedFavorites = favorites.filter((fav) => fav.id !== movie.id);
    } else {
      updatedFavorites = [...favorites, movie];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const openMovie = (movie) => {
    const watched =
      JSON.parse(localStorage.getItem("continueWatching")) || [];

    const filtered = watched.filter((item) => item.id !== movie.id);

    localStorage.setItem(
      "continueWatching",
      JSON.stringify([movie, ...filtered].slice(0, 8))
    );

    window.location.href = `/movie/${movie.id}`;
  };

  return (
    <header
      className="banner"
      style={{
        backgroundImage: `url(${imageUrl}${movie?.backdrop_path})`,
      }}
    >
      <div className="banner-overlay">
        <nav className="navbar">
          <h1 className="logo">StreamFlix</h1>

          <div className="nav-right">
            <input
              type="text"
              placeholder="Search movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <button
              className="wishlist-nav-btn"
              onClick={() => (window.location.href = "/wishlist")}
            >
              My List
            </button>

            <div className="profile-avatar">A</div>

            <span>avni@netflix.com</span>

            <button className="logout-btn">Logout</button>
          </div>
        </nav>

        <div className="banner-content">
          <h1>{movie?.title || movie?.name}</h1>

          <p>{movie?.overview}</p>

          <button className="play-btn">▶ Play</button>
        </div>

        {results.length > 0 && (
          <div className="search-results">
            {results.map((movie) => (
              <div
                className="search-card"
                key={movie.id}
                onClick={() => openMovie(movie)}
              >
                <img
                  src={`${imageUrl}${movie.poster_path}`}
                  alt={movie.title}
                />

                <div className="search-info">
                  <h4>{movie.title}</h4>

                  <button
                    className="search-fav-btn"
                    onClick={(e) => toggleFavorite(movie, e)}
                  >
                    {favorites.find((fav) => fav.id === movie.id)
                      ? "❤️"
                      : "🤍"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

export default Banner;