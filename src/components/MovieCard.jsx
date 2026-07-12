//MovieCard.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/MovieCard.module.css";

export default function MovieCard({
  id,
  date,
  title,
  image,
  cast = [],
  count = 0,
}) {
  const navigate = useNavigate();
  return (
    <div
      className={styles.card}
      onClick={() => navigate(`/movie/${id}`)} // ✅ card click
    >
      <div className={styles.top}>
        <div className={styles.left}>
          #{id} <span className={styles.date}>{date}</span>
        </div>
        <div className={styles.photos} onClick={(e) => e.stopPropagation()}>
          <Link to={`/movie/${id}/images`} className={styles.photoLink}>
            📷 {count}
          </Link>
        </div>
      </div>

      <div className={styles.posterWrap}>
        <img src={image} alt={title} className={styles.poster} />
      </div>

      <div className={styles.title} title={title}>
        {title}
      </div>

      <div className={styles.cast}>
        <strong>Cast:</strong>{" "}
        {cast.length ? (
          cast.slice(0, 3).map((actor, i) => (
            <span key={actor.id}>
              <Link
                to={`/actor/${actor.id}`}
                state={{ actor }}
                className={styles.castLink}
                onClick={(e) => e.stopPropagation()}
              >
                {actor.name}
              </Link>

              {i < Math.min(2, cast.length - 1) ? ", " : ""}
            </span>
          ))
        ) : (
          <span className={styles.unknown}>Unknown</span>
        )}
      </div>
    </div>
  );
}
