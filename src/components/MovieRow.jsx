import { useEffect, useState } from "react";
import { fetchMovies, fetchTrailer, imageUrl } from "../api/tmdb";

function MovieRow({ title, fetchUrl, large }) {
  const [movies, setMovies] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [showNoTrailer, setShowNoTrailer] = useState(false);
  const [loading, setLoading] = useState(true);

  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );

  useEffect(() => {
    const getMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchMovies(fetchUrl);
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    getMovies();
  }, [fetchUrl]);

  const saveContinueWatching = (movie) => {
    const watched = JSON.parse(localStorage.getItem("continueWatching")) || [];
    const filtered = watched.filter((item) => item.id !== movie.id);

    localStorage.setItem(
      "continueWatching",
      JSON.stringify([movie, ...filtered].slice(0, 8))
    );
  };

  const openDetails = (movie) => {
    saveContinueWatching(movie);
    window.location.href = `/movie/${movie.id}`;
  };

  const toggleFavorite = (movie, e) => {
    e.stopPropagation();

    const exists = favorites.find((fav) => fav.id === movie.id);

    const updatedFavorites = exists
      ? favorites.filter((fav) => fav.id !== movie.id)
      : [...favorites, movie];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const handleTrailer = async (movie, e) => {
    e.stopPropagation();

    try {
      const mediaType =
        movie.media_type || (movie.first_air_date ? "tv" : "movie");

      const video = await fetchTrailer(movie.id, mediaType);

      if (video) {
        setTrailer(video.key);
        setShowNoTrailer(false);
      } else {
        setTrailer(null);
        setShowNoTrailer(true);
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
      setTrailer(null);
      setShowNoTrailer(true);
    }
  };

  return (
    <section className="movie-row">
      <h2>{title}</h2>

      <div className="movie-list">
        {loading ? (
          <div className="spinner"></div>
        ) : (
          movies.map(
            (movie) =>
              ((large && movie.poster_path) ||
                (!large && movie.backdrop_path)) && (
                <div className="movie-card" key={movie.id}>
                  <img
                    src={`${imageUrl}${
                      large ? movie.poster_path : movie.backdrop_path
                    }`}
                    alt={movie.title || movie.name}
                    className={large ? "movie-poster large" : "movie-poster"}
                    onClick={() => openDetails(movie)}
                  />

                  <div className="movie-overlay">
                    <h4>{movie.title || movie.name}</h4>
                    <button onClick={() => openDetails(movie)}>Details</button>
                  </div>

                  <button
                    className="fav-btn"
                    onClick={(e) => toggleFavorite(movie, e)}
                  >
                    {favorites.find((fav) => fav.id === movie.id) ? "❤️" : "🤍"}
                  </button>

                  <button
                    className="trailer-btn"
                    onClick={(e) => handleTrailer(movie, e)}
                  >
                    ▶
                  </button>
                </div>
              )
          )
        )}
      </div>

      {trailer && (
        <div className="trailer-modal">
          <button onClick={() => setTrailer(null)}>✕</button>
          <iframe
            src={`https://www.youtube.com/embed/${trailer}`}
            title="Movie Trailer"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {showNoTrailer && (
        <div className="trailer-modal">
          <button onClick={() => setShowNoTrailer(false)}>✕</button>

          <div className="no-trailer-box">
            <h2>Trailer Coming Soon 🎬</h2>
            <p>This movie does not have an available trailer right now.</p>
          </div>
        </div>
      )}
    </section>
  );
}

export default MovieRow;