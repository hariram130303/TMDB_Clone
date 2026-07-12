import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Pagination from "../components/Pagination";
import styles from "../styles/MovieSeries.module.css";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export default function MovieSeries() {
  const [collections, setCollections] = useState([]);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadCollections() {
      const headers = {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
      };

      const collectionMap = {};

      // Scan first 10 pages of Hindi movies
      for (let p = 1; p <= 10; p++) {
        const movieRes = await fetch(
          `https://api.themoviedb.org/3/discover/movie?with_original_language=hi&include_adult=true&page=${p}`,
          { headers }
        );

        const movieData = await movieRes.json();

        for (const movie of movieData.results || []) {
          const detail = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}`,
            { headers }
          ).then((r) => r.json());

          if (detail.belongs_to_collection) {
            const c = detail.belongs_to_collection;

            if (!collectionMap[c.id]) {
              collectionMap[c.id] = {
                id: c.id,
                name: c.name.replace(" Collection", ""),
                poster: c.poster_path,
                count: 1,
              };
            } else {
              collectionMap[c.id].count++;
            }
          }
        }
      }

      const arr = Object.values(collectionMap).sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setCollections(arr);
    }

    loadCollections();
  }, []);

  const perPage = 30;

  const totalPages = Math.ceil(collections.length / perPage);

  const current = collections.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <Layout
      title="Movie Series"
      results={collections.length}
      pagination={
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPage={setPage}
        />
      }
    >
      <div className={styles.content}>
        <div className={styles.topRow}>
          <h4>{collections.length} Movie Series</h4>
        </div>

        <div className={styles.list}>
          {current.map((series) => (
            <div
              key={series.id}
              className={styles.row}
              onClick={() => navigate(`/series/${series.id}`)}
            >
              #{String(series.id).padStart(4, "0")} - {series.name}
              <span className={styles.dashes}> ----- </span>
              {series.count} {series.count === 1 ? "movie" : "movies"}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}