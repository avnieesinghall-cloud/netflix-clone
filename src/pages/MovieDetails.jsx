import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_KEY = "93b1722c320eba72fe07bc77a33886c1";
const IMAGE_URL = "https://image.tmdb.org/t/p/original";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
        );

        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie) {
    return <h1 className="details-loading">Loading movie details...</h1>;
  }

  return (
    <div className="details-page">
      <button className="back-btn" onClick={() => window.history.back()}>
        ← Back
      </button>

      <div
        className="details-hero"
        style={{
          backgroundImage: `linear-gradient(to right, #000 35%, rgba(0,0,0,0.4)), url(${IMAGE_URL}${movie.backdrop_path})`,
        }}
      >
        <div className="details-content">
          <h1>{movie.title}</h1>

          <p>{movie.overview}</p>

          <div className="details-info">
            <span>⭐ {movie.vote_average?.toFixed(1)}</span>
            <span>📅 {movie.release_date}</span>
            <span>🔥 {Math.round(movie.popularity)}</span>
            <span>⏱ {movie.runtime} min</span>
          </div>

          <div className="genre-list">
            {movie.genres?.map((genre) => (
              <span key={genre.id}>{genre.name}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;