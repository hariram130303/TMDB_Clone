const YT_KEY = import.meta.env.VITE_YT_KEY;

export async function fetchYouTubeTrailer(title, year) {
  const query = `${title} ${year} official trailer`;

  const searchUrl = `https://www.googleapis.com/youtube/v3/search
    ?part=snippet
    &q=${encodeURIComponent(query)}
    &maxResults=1
    &key=${YT_KEY}
    &type=video`.replace(/\s+/g, "");

  const res = await fetch(searchUrl);
  const data = await res.json();

  if (!data.items?.length) return null;

  const video = data.items[0];

  return {
    id: video.id.videoId,
    title: video.snippet.title,
    thumbnail: video.snippet.thumbnails.high.url,
  };
}
