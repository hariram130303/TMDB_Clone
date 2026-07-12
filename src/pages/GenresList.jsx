import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import styles from "../styles/GenresList.module.css";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export default function GenresList() {
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadGenres() {
      const headers = {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
      };

      const res = await fetch(
        "https://api.themoviedb.org/3/genre/movie/list",
        { headers }
      );

      const data = await res.json();

      setGenres(
        (data.genres || []).sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );
    }

    loadGenres();
  }, []);

  return (
    <Layout
      title="Movie Genres"
      results={genres.length}
    >
      <div className={styles.topRow}>
        <h2>{genres.length} Genres</h2>
      </div>

      <div className={styles.list}>
        {genres.map((genre) => (
          <div
            key={genre.id}
            className={styles.row}
            onClick={() =>
              navigate(`/genre/${encodeURIComponent(genre.name)}`)
            }
          >
            #{genre.id} - {genre.name}
          </div>
        ))}
      </div>
    </Layout>
  );
}