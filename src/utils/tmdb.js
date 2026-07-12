const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w342";
const BACKDROP = "https://image.tmdb.org/t/p/w1280";

const cache = {};

function cleanTitle(title) {
  if (!title || typeof title !== "string") return "";   // SAFETY FIX

  return title
    .replace(/\(.*?\)/g, "")
    .replace(/[--:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function tmdbFetch(url) {
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  });
  return res.json();
}


export async function fetchMovieInfo(title, year) {
  try {
    if (!title || !year) {
      console.warn("Invalid title/year:", title, year);
      return null;
    }

    const key = title + "_" + year;
    if (cache[key]) return cache[key];

    const cleaned = cleanTitle(title);

    // Search with filters
    let searchUrl = `${BASE_URL}/search/movie?query=${encodeURIComponent(
      cleaned
    )}&primary_release_year=${year}&with_original_language=hi&include_adult=true`;

    let search = await tmdbFetch(searchUrl);

    // Fallback search without year, still Hindi-only
    if (!search.results?.length) {
      searchUrl = `${BASE_URL}/search/movie?query=${encodeURIComponent(
        cleaned
      )}&with_original_language=hi&include_adult=true`;
      search = await tmdbFetch(searchUrl);
    }

    if (!search.results?.length) return null;

    // Filter: Hindi + within year range 2001–2025
    const filtered = search.results.filter((r) => {
      const y = Number(r.release_date?.slice(0, 4));
      return (
        r.original_language === "hi" &&
        y >= 2001 &&
        y <= 2025
      );
    });

    if (!filtered.length) return null;

    // Pick exact match first
    const exact = filtered.find(
      (r) => r.release_date?.slice(0, 4) === String(year)
    );

    const movie = exact || filtered[0];
    const movieId = movie.id;

    const details = await tmdbFetch(
      `${BASE_URL}/movie/${movieId}?language=en-US`
    );

    const credits = await tmdbFetch(
      `${BASE_URL}/movie/${movieId}/credits`
    );

    const result = {
      title: details.title,
      year: details.release_date?.slice(0, 4),
      genre: details.genres?.map((g) => g.name).join(", "),
      director:credits.crew?.find((c) => c.job === "Director")?.name || "Unknown",
      cast: credits.cast?.slice(0, 6).map((c) => c.name),
      studio: details.production_companies?.[0]?.name || "Unknown Studio",
      poster: details.poster_path ? IMG + details.poster_path : null,
      backdrop: details.backdrop_path ? BACKDROP + details.backdrop_path : null,
      rating: details.vote_average,
      runtime: details.runtime,
      tmdbId: movieId,
    };

    cache[key] = result;
    return result;
  } catch (err) {
    console.error("TMDB fetch error:", err);
    return null;
  }
}

// =============================
// 🎬 FETCH MOVIE IMAGES (BACKDROPS)
// =============================
export async function fetchImages(id) {
  try {
    if (!id) return [];

    // optional cache (recommended)
    const key = "images_" + id;
    if (cache[key]) return cache[key];

    const data = await tmdbFetch(`${BASE_URL}/movie/${id}/images`);

    const backdrops = data.backdrops || [];

    cache[key] = backdrops; // ✅ cache it

    return backdrops;
  } catch (err) {
    console.error("TMDB images fetch error:", err);
    return [];
  }
}
// ============================
// Cast
// ============================
export async function fetchCast(id) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}/credits`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    }
  );

  const data = await res.json();

  return (
    data.cast?.slice(0, 3).map((c) => ({
      id: c.id,
      name: c.name,
      profile_path: c.profile_path,
      gender: c.gender,
      popularity: c.popularity,
    })) || []
  );
}