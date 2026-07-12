import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import Pagination from "../components/Pagination";
import styles from "../styles/Actors.module.css";

export default function Actors() {
  const [actors, setActors] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams] = useSearchParams();
  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromUrl);

  const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

  useEffect(() => {
    async function loadActors() {
      try {
        const movieUrl =
          `https://api.themoviedb.org/3/discover/movie?with_original_language=hi&sort_by=popularity.desc&page=${currentPage}`;

        const movieRes = await fetch(movieUrl, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${TMDB_TOKEN}`,
          },
        });

        const movieData = await movieRes.json();
        const movies = movieData.results || [];

        const creditsResults = await Promise.all(
          movies.slice(0, 10).map(async (movie) => {
            const creditRes = await fetch(
              `https://api.themoviedb.org/3/movie/${movie.id}/credits`,
              {
                headers: {
                  accept: "application/json",
                  Authorization: `Bearer ${TMDB_TOKEN}`,
                },
              }
            );

            const creditData = await creditRes.json();
            return creditData.cast || [];
          })
        );

        const uniqueActorsMap = new Map();

        creditsResults.forEach((cast) => {
          cast.forEach((actor) => {
            if (!actor.profile_path) return;

            if (!uniqueActorsMap.has(actor.id)) {
              uniqueActorsMap.set(actor.id, {
                ...actor,
                movieCount: 1,
              });
            } else {
              uniqueActorsMap.get(actor.id).movieCount++;
            }
          });
        });

        setActors(Array.from(uniqueActorsMap.values()));
        setTotalPages(movieData.total_pages || 1);
      } catch (err) {
        console.error(err);
      }
    }

    loadActors();
  }, [currentPage, TMDB_TOKEN]);

  return (
    <Layout
      title="TMDB.com - Bollywood Actors"
      results={actors.length}
      pagination={
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPage={setCurrentPage}
        />
      }
    >
      <div className={styles.movieSection}>
        <div className={styles.movieHeader}>
          <b>{actors.length.toLocaleString()} Actors</b>
        </div>

        <div className={styles.grid}>
          {actors.map((actor) => (
            <Link
              key={actor.id}
              to={`/actor/${actor.id}`}
              state={{ actor }}
              className={styles.actorLink}
            >
              <div className={styles.actorCard}>
                <div className={styles.cardTop}>
                  <span className={styles.actorId}>#{actor.id}</span>
                  <span className={styles.actorDate}>Popular</span>
                  <span className={styles.navBadge}>[Nav]</span>
                </div>

                <div className={styles.imageWrap}>
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                        : "https://placehold.co/300x450?text=No+Image"
                    }
                    alt={actor.name}
                    className={styles.actorImage}
                  />
                </div>

                <div className={styles.actorName}>
                  {actor.name}
                </div>

                <div className={styles.actorMeta}>
                  <b>{actor.movieCount}</b> Movies - Photos [
                  {actor.gender === 1 ? "F" : "M"}]
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}