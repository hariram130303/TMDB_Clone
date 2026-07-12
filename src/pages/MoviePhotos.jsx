import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MoviePhotos() {
  const { id } = useParams();
  const [images, setImages] = useState([]);

  const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

  useEffect(() => {
    async function load() {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/images`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_TOKEN}`,
          },
        }
      );

      const data = await res.json();
      setImages(data.backdrops || []);
    }

    load();
  }, [id, TMDB_TOKEN]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Photos</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))",
        gap: "10px"
      }}>
        {images.map((img, i) => (
          <img
            key={i}
            src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
            style={{ width: "100%", borderRadius: "6px" }}
          />
        ))}
      </div>
    </div>
  );
}