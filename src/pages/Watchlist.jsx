import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWatchlist, removeFromWatchlist } from "../utils/watchlist";

const imageUrl = "https://image.tmdb.org/t/p/w500";

function Watchlist() {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setMovies(getWatchlist());
  }, []);

  const handleRemove = (id) => {
    removeFromWatchlist(id);
    setMovies(getWatchlist());
  };

  return (
    <div className="watchlist-page">
      <h1>My List</h1>
      <p>Your saved movies and shows appear here.</p>

      {movies.length === 0 ? (
        <div className="empty-watchlist">
          <h2>No movies added yet</h2>
          <p>Add movies from Search Results, Continue Watching, or Details Page.</p>

          <button onClick={() => navigate("/")}>Go Home</button>
        </div>
      ) : (
        <div className="watchlist-grid">
          {movies.map((movie) => (
            <div className="watchlist-card" key={`${movie.id}-${movie.media_type}`}>
              <img
                src={
                  movie.poster_path
                    ? `${imageUrl}${movie.poster_path}`
                    : movie.backdrop_path
                    ? `${imageUrl}${movie.backdrop_path}`
                    : "https://via.placeholder.com/500x750?text=No+Image"
                }
                alt={movie.title || movie.name}
                onClick={() =>
                  navigate(`/movie/${movie.id}/${movie.media_type || "movie"}`)
                }
              />

              <h3>{movie.title || movie.name}</h3>

              <button onClick={() => handleRemove(movie.id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist;