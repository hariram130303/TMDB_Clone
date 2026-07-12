import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import styles from "../styles/DirectorsList.module.css";

export default function DirectorsList() {
  const [directors, setDirectors] = useState([]);
  const [search] = useState("");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const menu = [
    { label: "Actors - 21,830", path: "/actors" },
    { label: "Scenes - 507,852", path: "/scenes" },
    { label: "Upcoming Scenes - 133", path: "/upcoming" },
    { label: "Movies - 63,458", path: "/movies" },
    { label: "Movie Series - 6,963", path: "/series" },
    { label: "Directors - 1,493", path: "/directors" },
    { label: "Studios - 1,493", path: "/studios" },
    { label: "Genres - 229", path: "/genres" },
    { label: "Tags - 229", path: "/tags" },
  ];

  const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

  useEffect(() => {
    async function loadDirectors() {
      const headers = {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
      };

      const directorMap = {};

      // Load first 10 pages of Hindi movies
      for (let page = 1; page <= 10; page++) {
        const movieRes = await fetch(
          `https://api.themoviedb.org/3/discover/movie?with_original_language=hi&sort_by=primary_release_date.desc&page=${page}`,
          { headers },
        );

        const movieData = await movieRes.json();

        for (const movie of movieData.results || []) {
          const creditRes = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/credits`,
            { headers },
          );

          const creditData = await creditRes.json();

          const directors = creditData.crew.filter((c) => c.job === "Director");

          // 👇 Replace your old forEach with this block
          for (const d of directors) {
            if (!directorMap[d.id]) {
              const personRes = await fetch(
                `https://api.themoviedb.org/3/person/${d.id}/movie_credits`,
                { headers },
              );

              const personData = await personRes.json();

              const directedMovies = personData.crew.filter(
                (movie) =>
                  movie.job === "Director"
              );

              directorMap[d.id] = {
                id: d.id,
                name: d.name,
                count: directedMovies.length,
              };
            }
          }
        }
      }

      const arr = Object.values(directorMap).sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      setDirectors(arr);
    }

    loadDirectors();
  }, [TMDB_TOKEN]);

  const filtered = directors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );

  const perPage = 30;

  const totalPages = Math.ceil(filtered.length / perPage);

  const current = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className={styles.pageWrapper}>
      {/* PAGE HEADER */}
      <div className={styles.pageHeader}>Movie Directors</div>

      {/* BODY */}
      <div className={styles.body}>
        {/* LEFT SIDEBAR */}
        <aside className={styles.leftSidebar}>
          <div className={styles.sideBox}>
            {menu.map((m, i) => (
              <div
                key={i}
                className={styles.sideItem}
                onClick={() => navigate(m.path)}
              >
                {m.label}
              </div>
            ))}
          </div>

          <div className={styles.storeBox}>Store18 - Official Store</div>
        </aside>

        {/* CENTER */}
        <main className={styles.centerContent}>
          <div className={styles.resultBar}>
            Showing {filtered.length.toLocaleString()} results...
          </div>

          <div className={styles.topRow}>
            <h2>{filtered.length} Directors</h2>
          </div>

          <div className={styles.list}>
            {current.map((d) => (
              <div
                key={d.id}
                className={styles.row}
                onClick={() =>
                  navigate(`/director/${encodeURIComponent(d.name)}`)
                }
              >
                #{String(d.id).padStart(4, "0")} - {d.name}
                <span className={styles.dashes}> ---- </span>
                {d.count} {d.count === 1 ? "movie" : "movies"}
              </div>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPage={setPage}
          />
        </main>

        {/* RIGHT */}
        <aside className={styles.rightSidebar}>
          <div className={styles.aboutBox}>
            <div className={styles.aboutTitle}>About TMDB.com</div>

            <p>Browse all movie directors available in the database.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
