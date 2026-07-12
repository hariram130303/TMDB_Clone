import styles from "../styles/SlideMenu.module.css";
import {
  FaUserFriends,
  FaFilm,
  FaVideo,
  FaBuilding,
  FaTags,
  FaTimes,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function SlideMenu({ isOpen, onClose }) {
  if (!isOpen) return null;
  
  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
          <div className={styles.topSpacer}></div>

          <div className={styles.scrollArea}>
            {/* Actors */}
            <div className={styles.box}>
              <div className={styles.imageColumn}>
                <FaUserFriends size={22} />
              </div>

              <div className={styles.contentColumn}>
                <div className={styles.header}>
                  <b>Actors</b> 21,830
                </div>

                <Link to="/actors/female">Female 12,280</Link>
                <Link to="/actors/male">Male 1,242</Link>
              </div>
            </div>

            {/* Scenes */}

            <div className={styles.box}>
              <div className={styles.imageColumn}>
                <FaFilm size={22} />
              </div>

              <div className={styles.contentColumn}>
                <div className={styles.header}>
                  <b>Scenes</b> 507,852
                </div>

                <Link to="/scenes/upcoming">Upcoming Scenes 92</Link>

                <Link to="/scenes/virtual-reality">Virtual Reality 17,051</Link>
              </div>
            </div>

            {/* Movies */}
<div className={styles.box}>
  <div className={styles.imageColumn}>
    <FaVideo size={22} />
  </div>
  <div className={styles.contentColumn}>
    <div className={styles.header}>
      <b>Movies</b> 64,234
    </div>
    <Link to="/movies/series">- Movie Series 7,009</Link>
    <Link to="/movies/directors">- Movie Directors 1,141</Link>
  </div>
</div>

            {/* Studios */}

            <div className={styles.simpleBox}>
              <div className={styles.header}>
                <FaBuilding />
                <b>Studios</b> 1,554
              </div>
            </div>

            {/* Tags */}

            <div className={styles.simpleBox}>
              <div className={styles.header}>
                <FaTags />
                <b>Tags</b> 229
              </div>
            </div>
          </div>

          <div className={styles.close} onClick={onClose}>
            CLOSE&nbsp;&nbsp;[x]
          </div>
        </div>
      </div>
    </>
  );
}
