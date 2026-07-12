import styles from "../styles/OfficialStoreModal.module.css";

export default function OfficialStoreModal({ onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <div className={styles.content}>

          <b>
            Important Notice about our Official Store{" "}
            <a
              href="https://www.store18.com"
              target="_blank"
              rel="noreferrer"
              className={styles.link}
            >
              https://www.store18.com
            </a>
          </b>

          <br />
          ---------------------------------
          <br />

          All features from our official store (
          <a
            href="https://www.store18.com"
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            <b>www.store18.com</b>
          </a>
          ) including sign in, create accounts, watch movies,
          check vod library, ...
          <br />
          are not available on www.data18.com pages.
          You can continue viewing your purchased content
          in the official store.

          <br />
          <br />

          <b>Sign in / create account here:</b>
          <br />
          <a
            href="https://www.store18.com/account/signin"
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            https://www.store18.com/account/signin
          </a>
          <br />
          * same email and password you use on www.data18.com

          <br />
          <br />

          <b>
            Watch and download your VOD library
            (including movies and scenes):
          </b>
          <br />
          <a
            href="https://www.store18.com/account/own/vodlibrary"
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            https://www.store18.com/account/own/vodlibrary
          </a>

          <br />
          <br />

          <b>If you have minutes, you can watch all movies here:</b>
          <br />
          <a
            href="https://www.store18.com/new-release-porn-videos.html"
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            https://www.store18.com/new-release-porn-videos.html
          </a>

        </div>
      </div>
    </div>
  );
}
