import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Sidebar.module.css";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export default function Sidebar() {
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    actors: 0,
    movies: 0,
    upcoming_movies:0,
    directors: 0,
    movie_series:0,
    studios: 0,
    genres: 0,
    keywords: 0,
  });


  const menu = [
  {
    label: "Actors",
    count: counts.actors.toLocaleString(),
    path: "/actors",
  },
    {
    label: "Movies",
    count: counts.movies.toLocaleString(),
    path: "/movies",
  },
  {
    label: "Upcoming Movies",
    count: counts.upcoming_movies.toLocaleString(),
    path: "/upcoming",
  },
  {
    label: "Movie Series",
    count: counts.movie_series.toLocaleString(),
    path: "/series",
  },
  {
    label: "Directors",
    count: counts.directors.toLocaleString(),
    path: "/directors",
  },
  {
    label: "Studios",
    count: counts.studios.toLocaleString(),
    path: "/studios",
  },
  {
    label: "Genres",
    count: counts.genres.toLocaleString(),
    path: "/genres",
  },
  {
    label: "Tags",
    count: counts.keywords.toLocaleString(),
    path: "/tags",
  },
];

useEffect(() => {
  let isMounted = true;

  async function loadCounts() {
    const headers = {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_TOKEN}`,
    };

    const actorSet = new Set();
    const directorSet = new Set();
    const genreSet = new Set();
    const studioSet = new Set();
    const movieSeriesSet = new Set();
    const keywordSet = new Set();

    let movieCount = 0;
    let upcomingMovieCount = 0;

    // Fetch upcoming Hindi movies
    const upcomingData = await fetch(
      `https://api.themoviedb.org/3/discover/movie?with_original_language=hi&include_adult=true&sort_by=release_date.asc&release_date.gte=${new Date().toISOString().split('T')[0]}`,
      { headers }
    ).then((r) => r.json());
    upcomingMovieCount = upcomingData.total_results;

    for (let page = 1; page <= 10; page++) {
      const movieData = await fetch(
        `https://api.themoviedb.org/3/discover/movie?with_original_language=hi&include_adult=true&page=${page}`,
        { headers }
      ).then((r) => r.json());

      if (page === 1) {
        movieCount = movieData.total_results;
      }

      for (const movie of movieData.results || []) {
        // Genres
        movie.genre_ids.forEach((id) => genreSet.add(id));

        // Credits
        const credits = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/credits`,
          { headers }
        ).then((r) => r.json());

        credits.cast.forEach((actor) => actorSet.add(actor.id));

        credits.crew
          .filter((c) => c.job === "Director")
          .forEach((d) => directorSet.add(d.id));

        // Studios
        const details = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}`,
          { headers }
        ).then((r) => r.json());

        details.production_companies?.forEach((company) =>
          studioSet.add(company.id)
        );

        if (details.belongs_to_collection?.id) {
          movieSeriesSet.add(details.belongs_to_collection.id);
        }

        // Keywords
        const keywords = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/keywords`,
          { headers }
        ).then((r) => r.json());

        keywords.keywords?.forEach((keyword) =>
          keywordSet.add(keyword.id)
        );
      }
    }

    if (isMounted) {
      setCounts({
        actors: actorSet.size,
        movies: movieCount,
        directors: directorSet.size,
        studios: studioSet.size,
        genres: genreSet.size,
        movie_series: movieSeriesSet.size,
        upcoming_movies: upcomingMovieCount,
        keywords: keywordSet.size,
      });
    }
  }
  loadCounts();

  return () => {
    isMounted = false;
  };
}, []);
  return (
    <div className={styles.sidebar}>
      <div className={styles.sideBox}>
  {menu.map((item, i) => (
    <div
      key={i}
      className={styles.sideItem}
      onClick={() => navigate(item.path)}
    >
      <strong>{item.label}</strong>
      {item.count && ` - ${item.count}`}
    </div>
  ))}
        <div className={styles.storeBox}>
        Store18 - Official Store
      </div>
    </div>
</div>


  );
}