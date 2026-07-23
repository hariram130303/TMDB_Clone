import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchYouTubeTrailer } from "../utils/youtube";
import styles from "../styles/MovieDetails.module.css";

export default function MovieDetails() {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = state?.movie;
  const openGallery = state?.openGallery;

  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [galleryImages, setGalleryImages] = useState({
    posters: [],
    backdrops: [],
  });
  const [currentImage, setCurrentImage] = useState(0);

  const [ytTrailer, setYtTrailer] = useState(null);
  const [playTrailer, setPlayTrailer] = useState(false);

  const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

  const [activeGallery, setActiveGallery] = useState(
    openGallery === 0 ? 0 : null,
  );

  const images =
    activeGallery === 0 ? galleryImages.posters : galleryImages.backdrops;
  

  function toggleGallery(id) {
    setActiveGallery((prev) => (prev === id ? null : id));
    setCurrentImage(0);
  }

  function goToActor(actor) {
    navigate(`/actor/${actor.id}`, {
      state: { actor },
    });
  }

  
  useEffect(() => {
    async function load() {
      const movieId = movie?.id || id;

      if (!movieId) return;

      const headers = {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        accept: "application/json",
      };

      const d = await fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {
        headers,
      }).then((r) => r.json());

      const c = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/credits`,
        { headers },
      ).then((r) => r.json());

      const imagesResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/images`,
        { headers },
      ).then((r) => r.json());

      setDetails(d);
      setCredits(c);
      setGalleryImages({
        posters: imagesResponse.posters || [],
        backdrops: imagesResponse.backdrops || [],
      });

      const yt = await fetchYouTubeTrailer(
        d.title,
        d.release_date?.slice(0, 4),
      );

      if (yt) setYtTrailer(yt);
    }

    load();
    
  }, [movie, id, TMDB_TOKEN]);

  if (!details) return null;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.sceneHeader}>
        Movie: <span>{details.title}</span>
      </div>
      <div className={styles.wrapper}>
        {/* LEFT SIDEBAR */}
        <div className={styles.leftSidebar}>
          {/* GALLERY CONTAINER */}
          <div className={styles.galleryContainer}>
            <div className={styles.galleryHeader}>
              Galleries: [{" "}
              {galleryImages.posters.length + galleryImages.backdrops.length}{" "}
              images ]
            </div>

            <div
              className={`${styles.galleryBox} ${
                activeGallery === 0 ? styles.activeGallery : ""
              }`}
              onClick={() => toggleGallery(0)}
            >
              <div className={styles.galleryRow}>
                <span className={styles.galleryName}>Gallery #0</span>

                <span className={styles.galleryMeta}>
                  Posters {galleryImages.posters.length}
                </span>
              </div>
            </div>

            <div
              className={`${styles.galleryBox} ${
                activeGallery === 1 ? styles.activeGallery : ""
              }`}
              onClick={() => toggleGallery(1)}
            >
              <div className={styles.galleryRow}>
                <span className={styles.galleryName}>Gallery #1</span>

                <span className={styles.galleryMeta}>
                  Backdrops {galleryImages.backdrops.length}
                </span>
              </div>
            </div>
          </div>

          {/* ✅ INDEPENDENT BOX BELOW */}
          {activeGallery !== null && (
            <div className={styles.galleryContentBox}>
              <div
                className={styles.closeGallery}
                onClick={() => {
                  setActiveGallery(null);
                  setCurrentImage(0);
                }}
              >
                Close Posters/Backdrops
                <div>[x]</div>
              </div>
            </div>
          )}
        </div>

        {/* CENTER CONTENT */}
        <div className={styles.sceneContainer}>
          {/* ACTION BAR */}
          <div className={styles.actionBar}>
            <div className={styles.actionBtn}>▶ Play</div>
            <div className={styles.actionBtn}>⭐ Rate</div>
            <div className={styles.actionBtn}>📷 Photos</div>
            <div className={styles.actionBtn}>⬇ Download</div>
          </div>

          {/* TRAILER */}
          <div className={styles.trailerBox}>
            {activeGallery === null ? (
              <div className={styles.trailerInner}>
                {ytTrailer ? (
                  playTrailer ? (
                    <iframe
                      className={styles.trailerPlayer}
                      src={`https://www.youtube.com/embed/${ytTrailer.id}?autoplay=1`}
                      title="Trailer"
                      allowFullScreen
                    />
                  ) : (
                    <div
                      className={styles.trailerThumbWrapper}
                      onClick={() => setPlayTrailer(true)}
                    >
                      <img
                        src={ytTrailer.thumbnail}
                        alt=""
                        className={styles.trailerThumb}
                      />
                      <div className={styles.playOverlay}>▶</div>
                    </div>
                  )
                ) : (
                  <div>No Trailer Available</div>
                )}
              </div>
            ) : (
              <div className={styles.galleryViewer}>
                {images.length > 0 ? (
                  <>
                    <button
                      className={styles.arrowLeft}
                      onClick={() =>
                        setCurrentImage((prev) =>
                          prev === 0 ? images.length - 1 : prev - 1,
                        )
                      }
                    >
                      ❮
                    </button>

                    <img
                      src={`https://image.tmdb.org/t/p/original${images[currentImage].file_path}`}
                      alt=""
                      className={styles.galleryImage}
                    />

                    <button
                      className={styles.arrowRight}
                      onClick={() =>
                        setCurrentImage((prev) =>
                          prev === images.length - 1 ? 0 : prev + 1,
                        )
                      }
                    >
                      ❯
                    </button>

                    <div className={styles.imageCounter}>
                      {currentImage + 1} / {images.length}
                    </div>
                  </>
                ) : (
                  <div className={styles.galleryEmpty}>No images available</div>
                )}
              </div>
            )}
          </div>

          {/* INFO */}
          <div className={styles.infoSection}>
            <div className={styles.sectionTitle}>Movie Information</div>

            <div className={styles.infoRow}>
              <b>Release date:</b> {details.release_date}
            </div>

            <div className={styles.infoRow}>
              <b>Duration:</b> {details.runtime} min
            </div>

            <div className={styles.infoHighlight}>
              <b>Network:</b>{" "}
              {details.production_companies?.[0]?.name || "Unknown"}
            </div>

            <div className={styles.storyBlock}>
              <b>Story:</b> {details.overview}
            </div>
          </div>

          {/* CAST */}
          <div className={styles.castSection}>
            <div className={styles.castHeader}>Actors / Cast</div>

            <div className={styles.castSub}>
              This movie is acted by {credits?.cast.length} actors
            </div>

            {credits?.cast.slice(0, 8).map((actor) => (
              <div
                key={actor.id}
                className={styles.castRow}
                onClick={() => goToActor(actor)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") goToActor(actor);
                }}
                tabIndex={0} // ✅ makes it focusable
                role="button" // ✅ accessibility
              >
                <img
                  className={styles.castImage}
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : "/no-avatar.png"
                  }
                  alt={actor.name}
                />

                <div className={styles.castContent}>
                  <div className={styles.castName}>{actor.name}</div>

                  <div className={styles.castMeta}>
                    All Movies [{actor.popularity?.toFixed?.(0) || 50}] [Nav X]
                    ------- w/ Network
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className={styles.rightSidebar}>
          <div className={styles.navBox}>
            <div className={styles.navTitle}>[Nav]</div>
            <div className={styles.navItem}>Previous</div>
            <div className={styles.navItem}>Next</div>
          </div>

          <div className={styles.navBox}>
            <div className={styles.navTitle}>Related</div>
            <div className={styles.navItem}>Movie 1</div>
            <div className={styles.navItem}>Movie 2</div>
          </div>
        </div>
      </div>

      {/* OPTIONS SECTION */}
      <div className={styles.optionsSection}>
        <div className={styles.optionsHeader}>
          #OPTIONS — Compare All & Details
        </div>

        {/* INFO BAR */}
        <div className={styles.optionsInfo}>
          <div className={styles.lockIcon}>🔒</div>
          <div>
            <b>All Options are Secure</b> Personal data is encrypted (SSL
            Connection).
            <br />
            Confidential: Discreet Billing - No adult references appearing on
            statements.
          </div>
        </div>

        {/* ONLINE OPTIONS */}
        <div className={styles.onlineRow}>
          {/* COLUMN 1 */}
          <div className={styles.onlineItem}>
            <div className={styles.onlineTitleGreen}>Online Options</div>
            <div>
              Purchase & Play. <b>Instant Access!</b>
            </div>
          </div>

          {/* COLUMN 2 */}
          <div className={styles.onlineItem}>
            <img src="/drm.png" alt="DRM Free" className={styles.onlineIcon} />
            <div>
              <b>Download Files with Free DRM</b>
              <div>Download & Play Videos in any Device</div>
            </div>
          </div>

          {/* COLUMN 3 */}
          <div className={styles.onlineItem}>
            <img
              src="/devices.png"
              alt="Devices"
              className={styles.onlineIcon}
            />
            <div>
              <b>Play on PC, mobile, tablet</b>
              <div>Android, iOS Apple & MP4 Players</div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className={styles.optionsTable}>
          {/* HEADER */}
          <div className={styles.optionsHeader}>
            <div>Option - Description</div>
            <div>Price</div>
            <div>Movies</div>
            <div>Download</div>
            <div>Video Quality - Files</div>
            <div>How Long</div>
          </div>

          {/* ROW */}
          <div className={styles.optionsRow}>
            <div className={styles.optCol}>
              <div className={styles.membershipTitle}>Official Membership</div>
              Unlimited Streaming & Download <br />
              Join <b>Cherry Pimps</b>
            </div>

            <div className={styles.optCol}>
              Go to Join Page <br />
              for Plans / Prices
            </div>

            <div className={styles.optCol}>
              6,672 <br />+ new content added
            </div>

            <div className={styles.optCol}>Yes</div>

            <div className={styles.optCol}>
              <b>Best Quality!</b> High Bitrate <br />
              <span className={styles.hdBadge}>HD Included</span>
            </div>

            <div className={styles.optCol}>
              As long as you have an active account or until you cancel your
              membership
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
