import { addToWatchlist } from "../utils/watchlist";

const imageUrl = "https://image.tmdb.org/t/p/w500";

function SearchResults({ movies = [], query = "", playTrailer }) {
  return (
    <div className="search-section">
      <div className="search-top-fade"></div>

      <h2>
        {query ? `Results for "${query}"` : "Search Results"}
      </h2>

      <div className="search-grid">
        {movies.map((movie) => (
          <div className="search-card" key={movie.id}>
            <img
              src={
                movie.poster_path
                  ? `${imageUrl}${movie.poster_path}`
                  : movie.backdrop_path
                  ? `${imageUrl}${movie.backdrop_path}`
                  : "https://via.placeholder.com/500x750?text=No+Image"
              }
              alt={movie.title || movie.name}
            />

            <div className="search-overlay">
              <h3>{movie.title || movie.name}</h3>

              <div className="search-buttons">
                <button
                  className="search-play-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    playTrailer(movie);
                  }}
                >
                  ▶
                </button>

                <button
                  className="search-add-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToWatchlist(movie);
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;