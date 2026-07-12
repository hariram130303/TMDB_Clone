//Topbar.jsx
import styles from "../styles/Topbar.module.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import OfficialStoreModal from "./OfficialStoreModal";


export default function Topbar({ onMenuClick }) {
  const [showStoreModal, setShowStoreModal] = useState(false);
  
  return (
    <div className={styles.topbar}>

      {/* MENU BUTTON */}
      <div className={styles.menuButton} onClick={onMenuClick}>
        <span className={styles.menuText}>
          <u>Menu</u>
        </span>
        <br />
        <GiHamburgerMenu size={30}/>
        <div className={styles.menuIcon}>
          <i className={`${styles.sprite} ${styles.spriteMenu}`}></i>
        </div>
      </div>

      {/* LOGO */}
      <div className={styles.logo}>
        <a href="https://www.themoviedb.org/" title="TMDB.com">
          <img
            src="/TMDB.svg"
            alt="TMDB Logo"
            className={styles.logoImage}
          />
        </a>
      </div>

      {/* SEARCH AREA */}
      <div className={styles.searchArea}>

        < div className={styles.searchRow}>
          <select className={styles.selectSearch}>
            <option>Search All TMDB.com</option>
            <option>Actors & Directors</option>
            <option>Studios, Sites & Networks</option>
            <option>Tags & Categories</option>
            <option>Movies & Movie Series</option>
            <option>Scenes</option>
          </select>

          <select className={styles.selectSearch}>
            <option>Contains (Default)</option>
            <option>As Regular Expression</option>
            <option>The exact name</option>
            <option>Starting ...</option>
            <option>... Ending</option>
          </select>
          <span className={styles.advancedBtn}>Advanced Search</span>
        </div>


        <div className={styles.searchInputRow}>
          <input
            className={styles.searchInput}
            type="text"
            maxLength={50}
            placeholder="find Actors, Movies, ..."
          />
          <div className={styles.searchIcon}>
            <img
              src="/public/icon-search-24.png"
              alt="search"
            />
          </div>
        </div>
      </div>

      {/* OFFICIAL STORE */}
      <div
        className={styles.storeBox}
        onClick={() => setShowStoreModal(true)}
      >
        <span className={styles.storeTitle}>
          <u>Official Store</u>
        </span>
        <div className={styles.storeDivider}>------------</div>
        <span className={styles.storeNote}>
          * Important Notice
        </span>
      </div>

      {showStoreModal && (
        <OfficialStoreModal
          onClose={() => setShowStoreModal(false)}
        />
      )}

    </div>
  );
}
