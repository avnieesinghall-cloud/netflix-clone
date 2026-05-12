import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import IntroAnimation from "../components/IntroAnimation";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import MovieRow from "../components/MovieRow";
import LoginModal from "../components/LoginModal";
import ContinueWatching from "../components/ContinueWatching";

import { auth } from "../firebase/firebase";
import { requests, searchMovies, imageUrl, fetchTrailer } from "../api/tmdb";
import { addToWatchlist } from "../utils/watchlist";

function Home() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [trailer, setTrailer] = useState(null);
  const [noTrailer, setNoTrailer] = useState(false);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (search.trim()) {
        const results = await searchMovies(search);

        const fixedResults = results.map((movie) => ({
          ...movie,
          media_type: movie.media_type || (movie.first_air_date ? "tv" : "movie"),
        }));

        setSearchResults(fixedResults);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [search]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const saveContinueWatching = (movie) => {
    const movieData = {
      ...movie,
      media_type: movie.media_type || (movie.first_air_date ? "tv" : "movie"),
    };

    const watched = JSON.parse(localStorage.getItem("continueWatching")) || [];
    const filtered = watched.filter((item) => Number(item.id) !== Number(movie.id));

    localStorage.setItem(
      "continueWatching",
      JSON.stringify([movieData, ...filtered].slice(0, 8))
    );
  };

  const openDetails = (movie) => {
    const mediaType = movie.media_type || (movie.first_air_date ? "tv" : "movie");
    saveContinueWatching(movie);
    navigate(`/movie/${movie.id}/${mediaType}`);
  };

  const handleAddToList = (movie, e) => {
    e.stopPropagation();

    const mediaType = movie.media_type || (movie.first_air_date ? "tv" : "movie");

    const result = addToWatchlist({
      ...movie,
      media_type: mediaType,
    });

    showToast(result.message);
  };

  const openTrailer = async (movie, e) => {
    if (e) e.stopPropagation();

    try {
      const mediaType = movie.media_type || (movie.first_air_date ? "tv" : "movie");
      const video = await fetchTrailer(movie.id, mediaType);

      if (video) {
        setTrailer(video.key);
        setNoTrailer(false);
      } else {
        setTrailer(null);
        setNoTrailer(true);
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
      setTrailer(null);
      setNoTrailer(true);
    }
  };

  return (
    <>
      <IntroAnimation />

      <Navbar
        search={search}
        setSearch={setSearch}
        setShowLogin={setShowLogin}
        user={user}
      />

      {showLogin && <LoginModal setShowLogin={setShowLogin} />}

      {searchResults.length > 0 ? (
        <main className="search-section">
          <h2>Search Results</h2>

          <div className="search-grid">
            {searchResults.map(
              (movie) =>
                movie.poster_path && (
                  <div
                    className="search-card"
                    key={`${movie.id}-${movie.media_type}`}
                    onClick={() => openDetails(movie)}
                  >
                    <img
                      src={`${imageUrl}${movie.poster_path}`}
                      alt={movie.title || movie.name}
                    />

                    <div className="search-overlay">
                      <h3>{movie.title || movie.name}</h3>

                      <div className="search-buttons">
                        <button
                          className="search-play-btn"
                          onClick={(e) => openTrailer(movie, e)}
                        >
                          ▶
                        </button>

                        <button
                          className="search-add-btn"
                          onClick={(e) => handleAddToList(movie, e)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
        </main>
      ) : (
        <>
          <Banner />
          <ContinueWatching />

          <main>
            <MovieRow title="Netflix Originals" fetchUrl={requests.netflixOriginals} large mediaType="tv" />
            <MovieRow title="Trending Now" fetchUrl={requests.trending} mediaType="mixed" />
            <MovieRow title="Top Rated" fetchUrl={requests.topRated} mediaType="movie" />
            <MovieRow title="Action Movies" fetchUrl={requests.action} mediaType="movie" />
            <MovieRow title="Comedy Movies" fetchUrl={requests.comedy} mediaType="movie" />
            <MovieRow title="Horror Movies" fetchUrl={requests.horror} mediaType="movie" />
            <MovieRow title="Romance Movies" fetchUrl={requests.romance} mediaType="movie" />
          </main>
        </>
      )}

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

      {noTrailer && (
        <div className="trailer-modal">
          <div className="no-trailer-box">
            <button className="close-no-trailer" onClick={() => setNoTrailer(false)}>
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
    </>
  );
}

export default Home;