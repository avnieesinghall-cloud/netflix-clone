import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { fetchTrailer, imageUrl } from "../api/tmdb";

const API_KEY = "93b1722c320eba72fe07bc77a33886c1";
const BASE_URL = "https://api.themoviedb.org/3";

function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [noTrailer, setNoTrailer] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieRes = await axios.get(
          `${BASE_URL}/movie/${id}?api_key=${API_KEY}`
        );

        const similarRes = await axios.get(
          `${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`
        );

        setMovie(movieRes.data);
        setSimilarMovies(similarRes.data.results || []);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const openTrailer = async () => {
    try {
      const video = await fetchTrailer(id, "movie");

      if (video) {
        setTrailer(video.key);
        setNoTrailer(false);
      } else {
        setTrailer(null);
        setNoTrailer(true);
      }
    } catch (error) {
      setTrailer(null);
      setNoTrailer(true);
    }
  };

  const addToContinueWatching = (item) => {
    const watched = JSON.parse(localStorage.getItem("continueWatching")) || [];
    const filtered = watched.filter((movie) => movie.id !== item.id);

    localStorage.setItem(
      "continueWatching",
      JSON.stringify([item, ...filtered].slice(0, 8))
    );
  };

  if (!movie) {
    return <h1 className="details-loading">Loading movie details...</h1>;
  }

  return (
    <section
      className="netflix-details-page"
      style={{
        backgroundImage: `linear-gradient(to right, #000 0%, rgba(0,0,0,0.82) 32%, rgba(0,0,0,0.35) 62%, rgba(0,0,0,0.05) 100%), 
        linear-gradient(to top, #000 0%, rgba(0,0,0,0.15) 45%, transparent 100%), 
        url(${imageUrl}${movie.backdrop_path})`,
      }}
    >
      <button className="netflix-close-btn" onClick={() => window.history.back()}>
        ✕
      </button>

      <div className="netflix-details-content">
        <p className="netflix-label">N FILM</p>

        <h1>{movie.title || movie.name}</h1>

        <div className="netflix-meta">
          <span>{movie.release_date?.slice(0, 4) || "N/A"}</span>
          <span className="meta-badge">U/A 13+</span>
          <span>{movie.runtime ? `${movie.runtime} min` : "N/A"}</span>
          <span className="meta-badge">HD</span>
          <span className="meta-badge">
            ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
          </span>
        </div>

        <p className="netflix-overview">
          {movie.overview || "No overview available."}
        </p>

        <div className="netflix-actions">
          <button
            className="play-btn"
            onClick={() => {
              addToContinueWatching(movie);
              openTrailer();
            }}
          >
            ▶ Play
          </button>

          <button className="dark-btn" onClick={openTrailer}>
            ▶ Trailer
          </button>

          <button className="circle-action">＋</button>
          <button className="circle-action">♡</button>
        </div>

        <div className="netflix-extra">
          <p>
            <strong>Genres:</strong>{" "}
            {movie.genres?.length
              ? movie.genres.map((genre) => genre.name).join(", ")
              : "N/A"}
          </p>

          <p>
            <strong>This movie is:</strong> Cinematic, Emotional, Entertaining
          </p>
        </div>
      </div>

      <div className="more-like-this">
        <h2>More Like This</h2>

        <div className="more-row">
          {similarMovies.slice(0, 8).map(
            (item) =>
              item.backdrop_path && (
                <div className="more-card" key={item.id}>
                  <img
                    src={`${imageUrl}${item.backdrop_path}`}
                    alt={item.title || item.name}
                    onClick={() => {
                      addToContinueWatching(item);
                      window.location.href = `/movie/${item.id}`;
                    }}
                  />
                </div>
              )
          )}
        </div>
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

      {noTrailer && (
        <div className="trailer-modal">
          <button onClick={() => setNoTrailer(false)}>✕</button>

          <div className="no-trailer-box">
            <h2>Trailer Coming Soon 🎬</h2>
            <p>This movie does not have an available trailer right now.</p>
          </div>
        </div>
      )}
    </section>
  );
}

export default MovieDetails;