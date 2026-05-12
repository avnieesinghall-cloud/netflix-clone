import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMovies, fetchTrailer, imageUrl } from "../api/tmdb";
import { addToWatchlist } from "../utils/watchlist";

function MovieRow({ title, fetchUrl, large, mediaType = "movie" }) {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [showNoTrailer, setShowNoTrailer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const getMovies = async () => {
      try {
        setLoading(true);

        const data = await fetchMovies(fetchUrl);

        const fixedMovies = data.map((movie) => ({
          ...movie,
          media_type:
            mediaType === "mixed"
              ? movie.media_type || (movie.first_air_date ? "tv" : "movie")
              : mediaType,
        }));

        setMovies(fixedMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    getMovies();
  }, [fetchUrl, mediaType]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const saveContinueWatching = (movie) => {
    const watched = JSON.parse(localStorage.getItem("continueWatching")) || [];
    const filtered = watched.filter((item) => Number(item.id) !== Number(movie.id));

    localStorage.setItem(
      "continueWatching",
      JSON.stringify([movie, ...filtered].slice(0, 8))
    );
  };

  const openDetails = (movie) => {
    saveContinueWatching(movie);
    navigate(`/movie/${movie.id}/${movie.media_type || "movie"}`);
  };

  const handleAddToList = (movie, e) => {
    e.stopPropagation();

    const result = addToWatchlist(movie);
    showToast(result.message);
  };

  const handleTrailer = async (movie, e) => {
    e.stopPropagation();

    try {
      const type = movie.media_type || (movie.first_air_date ? "tv" : "movie");
      const video = await fetchTrailer(movie.id, type);

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
              ((large && movie.poster_path) || (!large && movie.backdrop_path)) && (
                <div
                  className="movie-card"
                  key={`${movie.id}-${movie.media_type}`}
                  onClick={() => openDetails(movie)}
                >
                  <img
                    src={`${imageUrl}${large ? movie.poster_path : movie.backdrop_path}`}
                    alt={movie.title || movie.name}
                    className={large ? "movie-poster large" : "movie-poster"}
                  />

                  <div className="movie-overlay">
                    <h4>{movie.title || movie.name}</h4>
                    <button onClick={(e) => handleAddToList(movie, e)}>
                      + My List
                    </button>
                  </div>

                  <button
                    className="fav-btn"
                    onClick={(e) => handleAddToList(movie, e)}
                  >
                    +
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
            src={`https://www.youtube.com/embed/${trailer}?autoplay=1`}
            title="Movie Trailer"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {showNoTrailer && (
        <div className="trailer-modal">
          <div className="no-trailer-box">
            <button
              className="close-no-trailer"
              onClick={() => setShowNoTrailer(false)}
            >
              ✕
            </button>

            <h2>Trailer Coming Soon 🎬</h2>
            <p>This title does not have an available trailer right now.</p>
          </div>
        </div>
      )}

      {toast && (
        <div className="netflix-toast">
          <div className="toast-icon">✓</div>
          <span>{toast}</span>
        </div>
      )}
    </section>
  );
}

export default MovieRow;