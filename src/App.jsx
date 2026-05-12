// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Watchlist from "./pages/Watchlist";
import MovieDetails from "./pages/MovieDetails";

import "./index.css";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* HOME PAGE */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* WATCHLIST PAGE */}
        <Route
          path="/watchlist"
          element={<Watchlist />}
        />

        {/* NEW MOVIE DETAILS ROUTE */}
        <Route
          path="/movie/:id/:mediaType"
          element={<MovieDetails />}
        />

        {/* OLD FALLBACK ROUTE */}
        <Route
          path="/movie/:id"
          element={<MovieDetails />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;