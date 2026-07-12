//App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import HomePage from "./pages/HomePage";
import StudioMovies from "./pages/StudioMovies";
import StudiosList from "./pages/StudiosList";
import FilteredMovies from "./pages/FilteredMovies";
import DirectorsList from "./pages/DirectorsList";
import GenresList from "./pages/GenresList";
import MovieDetails from "./pages/MovieDetails";
import ActorProfile from "./pages/ActorProfile";
import MoviePhotos from "./pages/MoviePhotos";
import Actors from "./pages/Actors";
import MovieSeries from "./pages/MovieSeries";
import SlideMenu from "./components/SlideMenu";



import styles from "./styles/App.module.css";

export default function App() {
  const [slideMenuOpen, setSlideMenuOpen] = useState(false);

const handleMenuClick = () => {
  setSlideMenuOpen((prev) => !prev);
};
  return (
    <Router>
      <div className={styles.page}>
        <Topbar onMenuClick={handleMenuClick} />

        <SlideMenu
          isOpen={slideMenuOpen}
          
          onClose={() => setSlideMenuOpen(false)}
        />

        <main className={styles.content}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/studios" element={<StudiosList />} />
            <Route path="/studio/:name" element={<StudioMovies />} />
            <Route path="/directors" element={<DirectorsList />} />
            <Route
              path="/director/:name"
              element={<FilteredMovies type="director" />}
            />
            <Route path="/genres" element={<GenresList />} />
            <Route
              path="/genre/:name"
              element={<FilteredMovies type="genre" />}
            />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/actor/:id" element={<ActorProfile />} />
            <Route path="/movie/:id/images" element={<MoviePhotos />} />
            <Route path="/actors" element={<Actors />} />
            <Route path="/series" element={<MovieSeries />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}