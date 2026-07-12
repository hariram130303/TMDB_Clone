// Actors.jsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import Pagination from "../components/Pagination";
import styles from "../styles/Actors.module.css";

export default function Actors() {
  const [actors, setActors] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams] = useSearchParams();

  const pageFromUrl = Number(searchParams.get("page")) || 1;

  const [currentPage, setCurrentPage] = useState(pageFromUrl);

  const navigate = useNavigate();

  const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

  const menu = [
    { label: "Actors - 21,830", path: "/actors" },
    { label: "Series - 507,852", path: "/series" },
    { label: "Upcoming Scenes - 133", path: "/upcoming" },
    { label: "Movies - 63,458", path: "/movies" },
    { label: "Movie Series - 6,963", path: "/series" },
    { label: "Studios - 1,493", path: "/studios" },
    { label: "Tags - 229", path: "/tags" },
  ];

  useEffect(() => {
    async function loadActors() {
      try {
        // ✅ FETCH HINDI MOVIES
        const movieUrl =
          `https://api.themoviedb.org/3/discover/movie?` +
          `with_original_language=hi&sort_by=popularity.desc&page=${currentPage}`;

        const movieRes = await fetch(movieUrl, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${TMDB_TOKEN}`,
          },
        });

        const movieData = await movieRes.json();

        const movies = movieData.results || [];

        // ✅ FETCH CASTS
        const creditsResults = await Promise.all(
          movies.slice(0, 10).map(async (movie) => {
            const creditRes = await fetch(
              `https://api.themoviedb.org/3/movie/${movie.id}/credits`,
              {
                headers: {
                  accept: "application/json",
                  Authorization: `Bearer ${TMDB_TOKEN}`,
                },
              },
            );

            const creditData = await creditRes.json();

            return creditData.cast || [];
          }),
        );

        // ✅ REMOVE DUPLICATES
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

        const uniqueActors = Array.from(uniqueActorsMap.values());

        setActors(uniqueActors);

        setTotalPages(movieData.total_pages || 1);
      } catch (err) {
        console.error(err);
      }
    }

    loadActors();
  }, [currentPage, TMDB_TOKEN]);

  return (
    <div className={styles.pageWrapper}>
      {/* LEFT SIDEBAR */}
      <div className={styles.leftSidebar}>
        <div className={styles.sideBox}>
          {menu.map((item, i) => (
            <div
              key={i}
              className={styles.sideItem}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </div>
          ))}
        </div>

        <div className={styles.storeBox}>Store18 - Official Store</div>
      </div>

      {/* CENTER CONTENT */}
      <div className={styles.centerContent}>
        <div className={styles.mainHeader}>TMDB.com - Bollywood Actors</div>

        <div className={styles.movieSection}>
          <div className={styles.movieHeader}>
            <b>{actors.length.toLocaleString()} Actors</b>
          </div>

          {/* GRID */}
          <div className={styles.grid}>
            {actors.map((actor, i) => (
              <Link
                key={`${actor.id}-${i}`}
                to={`/actor/${actor.id}`}
                state={{ actor }}
                className={styles.actorLink}
              >
                <div className={styles.actorCard}>
                  {/* TOP BAR */}
                  <div className={styles.cardTop}>
                    <span className={styles.actorId}>#{actor.id}</span>

                    <span className={styles.actorDate}>Popular</span>

                    <span className={styles.navBadge}>[Nav]</span>
                  </div>

                  {/* IMAGE */}
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

                  {/* NAME */}
                  <div className={styles.actorName}>{actor.name}</div>

                  {/* META */}
                  <div className={styles.actorMeta}>
                    <b>{actor.movieCount}</b> Movies - Photos [
                    {actor.gender === 1 ? "F" : "M"}]
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* PAGINATION */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPage={(p) => setCurrentPage(p)}
        />
      </div>

      {/* RIGHT SIDEBAR */}
      <div className={styles.rightSidebar}>
        <div className={styles.aboutBox}>
          <div className={styles.aboutTitle}>About TMDB.com</div>

          <p>
            <b>TMDB.com</b> is a Movie & Actor Database.
          </p>

          <p>Browse Bollywood actors, movies, photos and cast details.</p>
        </div>
      </div>
    </div>
  );
}
