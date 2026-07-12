import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import styles from "../styles/GenresList.module.css";

export default function GenresList() {
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    Papa.parse("/hindi.csv", {
      download: true,
      header: true,
      complete: (res) => {
        const genreSet = {};
        res.data.forEach((m) => {
          if (m.Genre) {
            m.Genre.split(/[,/]/).forEach((g) => {
              const name = g.trim();
              if (name) genreSet[name] = (genreSet[name] || 0) + 1;
            });
          }
        });
        const arr = Object.entries(genreSet).map(([name, count], i) => ({
          id: i + 1,
          name,
          count,
        }));
        setGenres(arr.sort((a, b) => a.name.localeCompare(b.name)));
      },
    });
  }, []);

  const filtered = genres.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>🎭 Genres</h1>

      <div className={styles.filterBar}>
        <div className={styles.resultsText}>Showing {filtered.length.toLocaleString()} results…</div>

        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search genre..." className={styles.searchInput} />
      </div>

      <div className={styles.listWrapper}>
        <div className={styles.listHeader}>{genres.length} Genres</div>

        <ul className={styles.list}>
          {filtered.map((g) => (
            <li key={g.id} onClick={() => navigate(`/genre/${encodeURIComponent(g.name)}`)} className={styles.listItem}>
              <span className={styles.leftText}>#{g.id.toString().padStart(4, "0")} — {g.name}</span>
              <span className={styles.rightText}>{g.count} movies</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
