//FilteredMovies.jsx
import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import { fetchImages, fetchCast } from "../utils/tmdb";
import Layout from "../components/Layout";
import styles from "../styles/HomePage.module.css";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const TMDB_URL = "https://api.themoviedb.org/3";

export default function FilteredMovies({ type }) {
  const { name } = useParams();

  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [imageCounts, setImageCounts] = useState({});
  const [casts, setCasts] = useState({});

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;


  // =========================
  // FETCH MOVIES
  // =========================
  useEffect(() => {
    async function load() {
      const headers = {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
      };

      let url = "";

      if (type === "studio") {
        const company = await fetch(
          `${TMDB_URL}/search/company?query=${encodeURIComponent(name)}`,
          { headers }
        ).then((r) => r.json());

        const id = company.results?.[0]?.id;

        url = `${TMDB_URL}/discover/movie?with_companies=${id}&with_original_language=hi&page=${currentPage}`;
      }

      if (type === "director") {
        const person = await fetch(
          `${TMDB_URL}/search/person?query=${encodeURIComponent(name)}`,
          { headers }
        ).then((r) => r.json());

        const id = person.results?.[0]?.id;

        const credits = await fetch(
          `${TMDB_URL}/person/${id}/movie_credits`,
          { headers }
        ).then((r) => r.json());

        const directed = credits.crew.filter((m) => m.job === "Director");

        setMovies(directed);
        setTotalPages(1);
        return;
      }

      if (type === "genre") {
        const genres = await fetch(
          `${TMDB_URL}/genre/movie/list`,
          { headers }
        ).then((r) => r.json());

        const genre = genres.genres.find(
          (g) => g.name.toLowerCase() === name.toLowerCase()
        );

        url = `${TMDB_URL}/discover/movie?with_genres=${genre.id}&with_original_language=hi&page=${currentPage}`;
      }

      const data = await fetch(url, { headers }).then((r) => r.json());

      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
    }

    load();
  }, [type, name, currentPage]);

  // =========================
  // FETCH IMAGES
  // =========================
  useEffect(() => {
    async function loadImages() {
      if (!movies.length) return;

      const res = await Promise.all(
        movies.map(async (m) => {
          const imgs = await fetchImages(m.id);
          return { id: m.id, count: imgs.length };
        })
      );

      const map = {};
      res.forEach((r) => (map[r.id] = r.count));
      setImageCounts(map);
    }

    loadImages();
  }, [movies]);

  // =========================
  // FETCH CAST
  // =========================
  useEffect(() => {
    async function loadCast() {
      if (!movies.length) return;

      const res = await Promise.all(
        movies.map(async (m) => {
          const cast = await fetchCast(m.id);
          return { id: m.id, cast };
        })
      );

      const map = {};
      res.forEach((r) => (map[r.id] = r.cast));
      setCasts(map);
    }

    loadCast();
  }, [movies]);

  return (
  <Layout
    title={
      type === "studio"
        ? `Studio: ${decodeURIComponent(name)}`
        : type === "director"
        ? `Director: ${decodeURIComponent(name)}`
        : `Genre: ${decodeURIComponent(name)}`
    }
    results={movies.length}
    pagination={
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPage={(p) => setSearchParams({ page: p })}
      />
    }
  >
    <div className={styles.movieSection}>
      <div className={styles.movieHeader}>
        <b>{movies.length.toLocaleString()} Movies</b>
      </div>

      <div className={styles.grid}>
        {movies.map((m) => (
          <MovieCard
            key={m.id}
            id={m.id}
            date={m.release_date?.slice(0, 4)}
            title={m.title}
            image={
              m.poster_path
                ? `https://image.tmdb.org/t/p/w342${m.poster_path}`
                : "https://placehold.co/300x450?text=No+Poster"
            }
            count={imageCounts[m.id] || 0}
            cast={casts[m.id] || []}
          />
        ))}
      </div>
    </div>
  </Layout>
);
}