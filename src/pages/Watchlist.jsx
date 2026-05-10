import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { imageUrl } from "../api/tmdb";

function Watchlist() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  const removeFavorite = (id) => {
    const updated = favorites.filter((movie) => movie.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <>
      <Navbar search="" setSearch={() => {}} setShowLogin={() => {}} />

      <main className="watchlist-page">
        <h1>My Watchlist ❤️</h1>
        <p>Your saved movies appear here.</p>

        {favorites.length === 0 ? (
          <div className="empty-watchlist">
            <h2>No movies saved yet 🎬</h2>
            <button onClick={() => (window.location.href = "/")}>
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="watchlist-grid">
            {favorites.map((movie) => (
              <div className="watchlist-card" key={movie.id}>
                <img
                  src={`${imageUrl}${movie.poster_path || movie.backdrop_path}`}
                  alt={movie.title || movie.name}
                  onClick={() => (window.location.href = `/movie/${movie.id}`)}
                />

                <h3>{movie.title || movie.name}</h3>

                <button onClick={() => removeFavorite(movie.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default Watchlist;