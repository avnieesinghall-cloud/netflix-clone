// src/pages/MovieDetails.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addToWatchlist } from "../utils/watchlist";

const API_KEY = "93b1722c320eba72fe07bc77a33886c1";
const imageUrl = "https://image.tmdb.org/t/p/original";

function MovieDetails() {
  const { id, mediaType } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [finalMediaType, setFinalMediaType] = useState(mediaType || "movie");
  const [loading, setLoading] = useState(true);
  const [trailer, setTrailer] = useState(null);
  const [noTrailer, setNoTrailer] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);

        let type = mediaType || "movie";

        let res = await fetch(
          `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&language=en-US`
        );

        let data = await res.json();

        if (data.success === false && !mediaType) {
          type = "tv";

          res = await fetch(
            `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`
          );

          data = await res.json();
        }

        if (data.success === false) {
          setMovie(null);
        } else {
          setMovie(data);
          setFinalMediaType(type);
        }
      } catch (error) {
        console.log("Movie Details Error:", error);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, mediaType]);

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  const playTrailer = async () => {
    try {
      setNoTrailer(false);

      const res = await fetch(
        `https://api.themoviedb.org/3/${finalMediaType}/${id}/videos?api_key=${API_KEY}&language=en-US`
      );

      const data = await res.json();

      const trailerVideo = data.results?.find(
        (video) =>
          video.site === "YouTube" &&
          (video.type === "Trailer" || video.type === "Teaser")
      );

      if (trailerVideo) {
        setTrailer(trailerVideo.key);
      } else {
        setNoTrailer(true);
      }
    } catch (error) {
      console.log("Trailer Error:", error);
      setNoTrailer(true);
    }
  };

  const handleAddToWatchlist = () => {
    const result = addToWatchlist({
      ...movie,
      id: Number(id),
      media_type: finalMediaType,
    });

    showToast(result.message);
  };

  if (loading) {
    return (
      <div className="details-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="details-loading">
        <h1>Movie not found</h1>
      </div>
    );
  }

  return (
    <>
      <div
        className="netflix-details-page"
        style={{
          backgroundImage: `
            linear-gradient(
              to right,
              rgba(0,0,0,0.95),
              rgba(0,0,0,0.72),
              rgba(0,0,0,0.25)
            ),
            url(${imageUrl}${movie.backdrop_path || movie.poster_path})
          `,
        }}
      >
        <button className="netflix-close-btn" onClick={() => navigate(-1)}>
          ✕
        </button>

        <div className="netflix-details-content">
          <p className="netflix-label">NETFLIX</p>

          <h1>
            {movie.title ||
              movie.name ||
              movie.original_title ||
              movie.original_name ||
              "Untitled"}
          </h1>

          <div className="netflix-meta">
            <span>⭐ {movie.vote_average?.toFixed(1) || "N/A"}</span>

            <span>
              {movie.release_date?.split("-")[0] ||
                movie.first_air_date?.split("-")[0] ||
                "N/A"}
            </span>

            <span className="meta-badge">
              {finalMediaType === "tv" ? "TV SHOW" : "MOVIE"}
            </span>

            {movie.runtime && <span>{movie.runtime} min</span>}

            {movie.number_of_seasons && (
              <span>{movie.number_of_seasons} Seasons</span>
            )}
          </div>

          <p className="netflix-overview">
            {movie.overview || "No description available."}
          </p>

          <div className="netflix-actions">
            <button className="play-btn" onClick={playTrailer}>
              ▶ Play Trailer
            </button>

            <button className="dark-btn" onClick={handleAddToWatchlist}>
              + My List
            </button>
          </div>

          <div className="netflix-extra">
            <p>
              <strong>Original Language:</strong>{" "}
              {movie.original_language?.toUpperCase() || "N/A"}
            </p>

            <p>
              <strong>Popularity:</strong> {Math.round(movie.popularity || 0)}
            </p>

            <p>
              <strong>Total Votes:</strong> {movie.vote_count || 0}
            </p>

            {movie.genres?.length > 0 && (
              <p>
                <strong>Genres:</strong>{" "}
                {movie.genres.map((genre) => genre.name).join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>

      {trailer && (
        <div className="trailer-modal">
          <button onClick={() => setTrailer(null)}>✕</button>

          <iframe
            src={`https://www.youtube.com/embed/${trailer}?autoplay=1`}
            title="Trailer"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {noTrailer && (
        <div className="trailer-modal">
          <div className="no-trailer-box">
            <button
              className="close-no-trailer"
              onClick={() => setNoTrailer(false)}
            >
              ✕
            </button>

            <h2>No Trailer Available</h2>

            <p>
              Sorry, this title currently does not have an official trailer.
            </p>
          </div>
        </div>
      )}

      {toast && (
        <div className="netflix-toast">
          <div className="toast-icon">✓</div>
          <span>{toast}</span>
        </div>
      )}
    </>
  );
}

export default MovieDetails;