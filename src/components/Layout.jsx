import Sidebar from "./Sidebar";
import styles from "../styles/HomePage.module.css";

export default function Layout({
  title,
  results,
  filter,
  children,
  pagination,
}) {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>{title}</div>

      <div className={styles.mainArea}>
        <div className={styles.body}>
          <Sidebar />

          <main className={styles.main}>
            <div className={styles.resultsBar}>
              Showing {results.toLocaleString()} results...
            </div>

            {filter && filter}

            {children}

            {pagination}
          </main>
        </div>

        <aside className={styles.rightSidebar}>
          <div className={styles.aboutSection}>
            <div className={styles.aboutHeader}>
              About TMDB.com
            </div>

            <div className={styles.aboutContent}>
              <p>
                <span className={styles.brand}>TMDB.com</span> is a
                <strong> Movie Database</strong> containing thousands of
                movies, actors, directors and studios.
              </p>

              <p>
                We offer different <strong>options</strong> to browse
                movies, posters, cast information and production details.
              </p>

              <p>
                Our goal is to provide accurate movie information in a
                simple, easy-to-use interface.
              </p>

              <p>
                If you have questions or suggestions,
                <br />
                <a href="#">Send us a message</a>
              </p>
            </div>
          </div>

          <div className={styles.bottomPanel}></div>
        </aside>
      </div>
    </div>
  );
}