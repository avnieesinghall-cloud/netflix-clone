import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import MovieRow from "../components/MovieRow";
import LoginModal from "../components/LoginModal";

import { auth } from "../firebase/firebase";
import {
  requests,
  searchMovies,
  imageUrl,
  fetchTrailer,
} from "../api/tmdb";

function Home() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [trailer, setTrailer] = useState(null);
  const [user, setUser] = useState(null);

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
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [search]);

  const openTrailer = async (movie) => {
    try {
      const mediaType =
        movie.media_type ||
        (movie.first_air_date ? "tv" : "movie");

      const video = await fetchTrailer(movie.id, mediaType);

      if (video) setTrailer(video.key);
      else alert("Trailer not available");
    } catch (error) {
      alert("Trailer not available");
    }
  };

  return (
    <>
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
                  <img
                    key={movie.id}
                    src={`${imageUrl}${movie.poster_path}`}
                    alt={movie.title}
                    onClick={() => openTrailer(movie)}
                  />
                )
            )}
          </div>
        </main>
      ) : (
        <>
          <Banner />

          <main>
            <MovieRow
              title="Netflix Originals"
              fetchUrl={requests.netflixOriginals}
              large
            />
            <MovieRow title="Trending Now" fetchUrl={requests.trending} />
            <MovieRow title="Top Rated" fetchUrl={requests.topRated} />
            <MovieRow title="Action Movies" fetchUrl={requests.action} />
            <MovieRow title="Comedy Movies" fetchUrl={requests.comedy} />
            <MovieRow title="Horror Movies" fetchUrl={requests.horror} />
            <MovieRow title="Romance Movies" fetchUrl={requests.romance} />
          </main>
        </>
      )}

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
    </>
  );
}

export default Home;