import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import styles from "../styles/ActorProfile.module.css";

export default function ActorProfile() {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [actor, setActor] = useState(state?.actor || null);
  const [movies, setMovies] = useState([]);
  const [social, setSocial] = useState({});

  const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

  const [movie, setMovie] = useState(state?.movie || null);

  useEffect(() => {
    if (movie) return;

    async function loadMovie() {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        },
      });

      const data = await res.json();
      setMovie(data);
    }

    loadMovie();
  }, [id, movie]);

  useEffect(() => {
    async function load() {
      const headers = {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        accept: "application/json",
      };

      // Actor details
      const a = await fetch(`https://api.themoviedb.org/3/person/${id}`, {
        headers,
      }).then((r) => r.json());
      setActor(a);

      // Social links
      const ext = await fetch(
        `https://api.themoviedb.org/3/person/${id}/external_ids`,
        { headers },
      ).then((res) => res.json());
      setSocial(ext);

      // Movies
      const m = await fetch(
        `https://api.themoviedb.org/3/person/${id}/movie_credits`,
        { headers },
      ).then((r) => r.json());
      setMovies(m.cast || []);
    }

    load();
  }, [id, TMDB_TOKEN]);

  // ⭐ Remove duplicates
  const uniqueMovies = useMemo(() => {
    const map = new Map();
    movies.forEach((m) => {
      if (!map.has(m.id)) map.set(m.id, m);
    });
    return Array.from(map.values());
  }, [movies]);

  // ⭐ Sort by latest year
  const sortedMovies = useMemo(() => {
    return [...uniqueMovies]
      .filter((m) => m.release_date)
      .sort((a, b) =>
        (b.release_date || "").localeCompare(a.release_date || ""),
      );
  }, [uniqueMovies]);

  // ⭐ Known for (top 6 popular)
  const knownFor = useMemo(() => {
    return [...uniqueMovies]
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 6);
  }, [uniqueMovies]);

  if (!actor) return null;

  return (
  <div className={styles.pageWrapper}>
    <div className={styles.centerContent}>
      <div className={styles.mainHeader}>
        Actor: <b>{actor.name}</b>
      </div>

      <div className={styles.content}>
        {/* LEFT PROFILE */}
        <div className={styles.sidebar}>
          <img
            className={styles.profileImg}
            src={
              actor.profile_path
                ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                : "/no-avatar.png"
            }
            alt={actor.name}
          />

          <div className={styles.sideSection}>
            <div className={styles.socialIcons}>
              {social.facebook_id && (
                <a
                  href={`https://facebook.com/${social.facebook_id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaFacebook />
                </a>
              )}

              {social.twitter_id && (
                <a
                  href={`https://twitter.com/${social.twitter_id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaXTwitter />
                </a>
              )}

              {social.instagram_id && (
                <a
                  href={`https://instagram.com/${social.instagram_id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaInstagram />
                </a>
              )}
            </div>

            <h4>Personal Info</h4>

            <p>
              <b>Known For</b>
              <br />
              Acting
            </p>

            <p>
              <b>Known Credits</b>
              <br />
              {uniqueMovies.length}
            </p>

            <p>
              <b>Gender</b>
              <br />
              {actor.gender === 1
                ? "Female"
                : actor.gender === 2
                ? "Male"
                : "N/A"}
            </p>

            <p>
              <b>Birthday</b>
              <br />
              {actor.birthday || "N/A"}
            </p>

            <p>
              <b>Place of Birth</b>
              <br />
              {actor.place_of_birth || "N/A"}
            </p>

            <p>
              <b>Also Known As</b>
            </p>

            <ul className={styles.aliasList}>
              {actor.also_known_as?.length
                ? actor.also_known_as.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))
                : <li>N/A</li>}
            </ul>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className={styles.main}>
          <h1 className={styles.name}>{actor.name}</h1>

          <h3>Biography</h3>

          <p className={styles.bio}>
            {actor.biography || "No biography available"}
          </p>

          <h3>Known For</h3>

          <div className={styles.knownForRow}>
            {knownFor.map((m) => (
              <div
                key={m.id}
                className={styles.movieCard}
                onClick={() =>
                  navigate(`/movie/${m.id}`, {
                    state: { movie: m },
                  })
                }
              >
                <img
                  src={
                    m.poster_path
                      ? `https://image.tmdb.org/t/p/w185${m.poster_path}`
                      : "/no-image.png"
                  }
                  alt={m.title}
                />

                <p>{m.title}</p>
              </div>
            ))}
          </div>

          <h3 className={styles.sectionTitle}>Acting</h3>

          <div className={styles.filmography}>
            {sortedMovies.map((m) => (
              <div
                key={m.id}
                className={styles.creditRow}
                onClick={() =>
                  navigate(`/movie/${m.id}`, {
                    state: { movie: m },
                  })
                }
              >
                <div className={styles.year}>
                  {m.release_date?.slice(0, 4)}
                </div>

                <div className={styles.dot}></div>

                <div className={styles.creditInfo}>
                  <div className={styles.movieTitle}>{m.title}</div>

                  <div className={styles.character}>
                    {m.character && `as ${m.character}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
