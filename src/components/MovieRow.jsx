import { useEffect, useState } from "react";
import { fetchMovies, fetchTrailer, imageUrl } from "../api/tmdb";

function MovieRow({ title, fetchUrl, large }) {
  const [movies, setMovies] = useState([]);
  const [trailer, setTrailer] = useState(null);
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

  const toggleFavorite = (movie, e) => {
    e.stopPropagation();

    const exists = favorites.find((fav) => fav.id === movie.id);

    const updatedFavorites = exists
      ? favorites.filter((fav) => fav.id !== movie.id)
      : [...favorites, movie];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const handleTrailer = async (movie) => {
    try {
      const mediaType =
        movie.media_type || (movie.first_air_date ? "tv" : "movie");

      const video = await fetchTrailer(movie.id, mediaType);

      if (video) setTrailer(video.key);
      else alert("Trailer not available");
    } catch (error) {
      console.error("Error fetching trailer:", error);
      alert("Trailer not available");
    }
  };

  return (
    <section className="movie-row">
      <h2>{title}</h2>

      <div className="movie-list">
        {loading
          ? Array(8)
              .fill(0)
              .map((_, index) => <div className="skeleton" key={index}></div>)
          : movies.map(
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
                      onClick={() =>
                        (window.location.href = `/movie/${movie.id}`)
                      }
                    />

                    <button
                      className="fav-btn"
                      onClick={(e) => toggleFavorite(movie, e)}
                    >
                      {favorites.find((fav) => fav.id === movie.id)
                        ? "❤️"
                        : "🤍"}
                    </button>

                    <button
                      className="trailer-btn"
                      onClick={() => handleTrailer(movie)}
                    >
                      ▶
                    </button>
                  </div>
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
    </section>
  );
}

export default MovieRow;