//Homepage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { fetchImages, fetchCast } from "../utils/tmdb";
import MovieCard from "../components/MovieCard";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import styles from "../styles/HomePage.module.css";

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams] = useSearchParams();
  const [imageCounts, setImageCounts] = useState({});
  const [casts, setCasts] = useState({});

  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromUrl);

  const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
  const [directors, setDirectors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [studios, setStudios] = useState([]);
  const navigate = useNavigate();

  const headers = useMemo(() => ({
    accept: "application/json",
    Authorization: `Bearer ${TMDB_TOKEN}`,
  }), [TMDB_TOKEN]);

  useEffect(() => {
    async function loadStudios() {
      const map = {};

      for (let page = 1; page <= 5; page++) {
        const movies = await fetch(
          `https://api.themoviedb.org/3/discover/movie?with_original_language=hi&page=${page}`,
          { headers },
        ).then((r) => r.json());

        for (const movie of movies.results || []) {
          const detail = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}`,
            { headers },
          ).then((r) => r.json());

          detail.production_companies?.forEach((company) => {
            if (!map[company.id]) {
              map[company.id] = {
                id: company.id,
                name: company.name,
                count: 1,
              };
            } else {
              map[company.id].count++;
            }
          });
        }
      }

      setStudios(
        Object.values(map).sort((a, b) => a.name.localeCompare(b.name)),
      );
    }

    loadStudios();
  }, [TMDB_TOKEN, headers]);

  useEffect(() => {
    async function loadDirectors() {
      const map = {};

      for (let page = 1; page <= 5; page++) {
        const movies = await fetch(
          `https://api.themoviedb.org/3/discover/movie?with_original_language=hi&page=${page}`,
          { headers },
        ).then((r) => r.json());

        for (const movie of movies.results || []) {
          const credits = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/credits`,
            { headers },
          ).then((r) => r.json());

          credits.crew
            .filter((c) => c.job === "Director")
            .forEach((d) => {
              if (!map[d.id]) {
                map[d.id] = {
                  id: d.id,
                  name: d.name,
                  count: 1,
                };
              } else {
                map[d.id].count++;
              }
            });
        }
      }

      setDirectors(
        Object.values(map).sort((a, b) => a.name.localeCompare(b.name)),
      );
    }

    loadDirectors();
  }, [TMDB_TOKEN, headers]);

  useEffect(() => {
    async function loadGenres() {
      const res = await fetch("https://api.themoviedb.org/3/genre/movie/list", {
        headers,
      });

      const data = await res.json();
      setGenres(data.genres || []);
    }

    loadGenres();
  }, [TMDB_TOKEN, headers]);

  // 🔥 Fetch Hindi movies directly from TMDB
  useEffect(() => {
    async function loadMovies() {
      const url =
        `https://api.themoviedb.org/3/discover/movie?with_original_language=hi&include_adult=true&sort_by=primary_release_date.desc&page=${currentPage}`.replace(
          /\s+/g,
          "",
        );

      const res = await fetch(url, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_TOKEN}`,
        },
      });

      const data = await res.json();

      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
    }

    loadMovies();
  }, [currentPage, TMDB_TOKEN]);

  useEffect(() => {
    async function loadImages() {
      if (!movies.length) return;

      const results = await Promise.all(
        movies.map(async (m) => {
          const backdrops = await fetchImages(m.id);
          return { id: m.id, count: backdrops.length };
        }),
      );

      // convert to object { movieId: count }
      const map = {};
      results.forEach((r) => {
        map[r.id] = r.count;
      });

      setImageCounts(map);
    }

    loadImages();
  }, [movies]);
  // cast
  useEffect(() => {
    async function loadCasts() {
      const results = await Promise.all(
        movies.map(async (m) => {
          const cast = await fetchCast(m.id);
          return {
            id: m.id,
            cast,
          };
        }),
      );

      const map = {};

      results.forEach((r) => {
        map[r.id] = r.cast;
      });

      setCasts(map);
    }

    if (movies.length) {
      loadCasts();
    }
  }, [movies]);
  return (
    <div className={styles.page}>
      {/* Page Title */}
      <div className={styles.pageHeader}>TMDB.com</div>
      {/* Main Area */}
      <div className={styles.mainArea}>
        <div className={styles.body}>
          <Sidebar />
          <main className={styles.main}>
            {/* Results */}

            <div className={styles.resultsBar}>
              Showing {movies.length} results...
            </div>

            <div className={styles.filterWrapper}>
              <div className={styles.filterPanel}>
                <div className={styles.filterColumn}>
                  <h4>- by studios:</h4>

                  <div className={styles.filterList}>
                    {studios.map((s) => (
                      <div
                        key={s.id}
                        className={styles.filterItem}
                        onClick={() =>
                          navigate(`/studio/${encodeURIComponent(s.name)}`)
                        }
                      >
                        {s.name} [{s.count}]
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.filterColumn}>
                  <h4>- by directors:</h4>

                  <div className={styles.filterList}>
                    {directors.map((d) => (
                      <div
                        key={d.id}
                        className={styles.filterItem}
                        onClick={() =>
                          navigate(`/director/${encodeURIComponent(d.name)}`)
                        }
                      >
                        {d.name} [{d.count}]
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.filterColumn}>
                  <h4>- by genres:</h4>

                  <div className={styles.filterList}>
                    {genres.map((g) => (
                      <div
                        key={g.id}
                        className={styles.filterItem}
                        onClick={() =>
                          navigate(`/genre/${encodeURIComponent(g.name)}`)
                        }
                      >
                        {g.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.expandBar}>Expand Filter</div>

            {/* Movies */}
            <div className={styles.movieSection}>
              <div className={styles.movieHeader}>
                <b>{movies.length.toLocaleString()} Movies</b> hide tab
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
              <button className={styles.showMore}>Show More Results</button>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPage={(p) => setCurrentPage(p)}
              />
            </div>
          </main>
        </div>
        {/* RIGHT SIDEBAR */}
        <aside className={styles.rightSidebar}>
          <div className={styles.aboutSection}>
            <div className={styles.aboutHeader}>About TMDB.com</div>

            <div className={styles.aboutContent}>
              <p>
                <span className={styles.brand}>TMDB.com</span> is a
                <strong> Movie Database</strong> containing thousands of movies,
                actors, directors and studios.
              </p>

              <p>
                We offer different <strong>options</strong> to browse movies,
                posters, cast information and production details.
              </p>

              <p>
                Our goal is to provide accurate movie information in a simple,
                easy-to-use interface.
              </p>

              <p>
                If you have questions or suggestions,
                <br />
                <a href="#">Send us a message</a>
              </p>
            </div>
          </div>

          <div className={styles.bottomPanel}>{/* Future widgets / ads */}</div>
        </aside>
      </div>
    </div>
  );
}
