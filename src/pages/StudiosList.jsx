import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import styles from "../styles/StudiosList.module.css";
import Pagination from "../components/Pagination";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const TMDB_URL = "https://api.themoviedb.org/3";

export default function StudiosList() {
  const [studios, setStudios] = useState([]);
  const [search] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 25;

  const navigate = useNavigate();

  useEffect(() => {
    async function loadStudios() {
      try {
        const res = await fetch(
          `${TMDB_URL}/discover/movie?with_original_language=hi&sort_by=popularity.desc&page=1`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${TMDB_TOKEN}`,
            },
          }
        );

        const data = await res.json();

        const map = {};

        for (const movie of data.results || []) {
          const detail = await fetch(
            `${TMDB_URL}/movie/${movie.id}`,
            {
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${TMDB_TOKEN}`,
              },
            }
          ).then((r) => r.json());


          detail.production_companies?.forEach((company) => {
            if (company.name) {
              map[company.name] =
                (map[company.name] || 0) + 1;
            }
          });
        }


        const arr = Object.entries(map).map(
          ([name, count], index) => ({
            id: index + 1,
            name,
            count,
          })
        );


        setStudios(
          arr.sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        );

      } catch (error) {
        console.log(error);
      }
    }

    loadStudios();

  }, []);


  const filtered = studios.filter((s) =>
    s.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );


  const totalPages = Math.ceil(
    filtered.length / perPage
  );


  const current = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );


  return (
    <Layout
        title="Movie Studios"
        results={filtered.length}
        pagination={
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPage={setPage}
          />
        }
      >
        <div className={styles.topRow}>
          <h2>{filtered.length.toLocaleString()} Studios</h2>
        </div>
    
        <div className={styles.list}>
          {current.map((d) => (
            <div
              key={d.id}
              className={styles.row}
              onClick={() =>
                navigate(`/studio/${encodeURIComponent(d.name)}`)
              }
            >
              #{String(d.id).padStart(4, "0")} - {d.name}
              <span className={styles.dashes}> ---- </span>
              {d.count} {d.count === 1 ? "movie" : "movies"}
            </div>
          ))}
        </div>
      </Layout>
  );
}