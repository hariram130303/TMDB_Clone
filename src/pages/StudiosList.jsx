import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import homeStyles from "../styles/HomePage.module.css";
import styles from "../styles/StudiosList.module.css";
import Pagination from "../components/Pagination";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const TMDB_URL = "https://api.themoviedb.org/3";

export default function StudiosList() {
  const [studios, setStudios] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 25;

  const navigate = useNavigate();

  useEffect(() => {
    async function loadStudios() {
      try {
        const res = await fetch(
          `${TMDB_URL}/discover/movie?with_original_language=hi&sort_by=popularity.desc&page=1`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${TMDB_TOKEN}`,
            },
          }
        );

        const data = await res.json();

        const map = {};

        for (const movie of data.results || []) {
          const detail = await fetch(
            `${TMDB_URL}/movie/${movie.id}`,
            {
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${TMDB_TOKEN}`,
              },
            }
          ).then((r) => r.json());


          detail.production_companies?.forEach((company) => {
            if (company.name) {
              map[company.name] =
                (map[company.name] || 0) + 1;
            }
          });
        }


        const arr = Object.entries(map).map(
          ([name, count], index) => ({
            id: index + 1,
            name,
            count,
          })
        );


        setStudios(
          arr.sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        );

      } catch (error) {
        console.log(error);
      }
    }

    loadStudios();

  }, []);


  const filtered = studios.filter((s) =>
    s.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );


  const totalPages = Math.ceil(
    filtered.length / perPage
  );


  const current = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );


  return (

    <div className={homeStyles.pageWrapper}>


      {/* LEFT SIDEBAR */}
      <div className={homeStyles.leftSidebar}>
        <div className={homeStyles.sideBox}>
          <div className={homeStyles.sideItem}>Actors - 21,830</div>
          <div className={homeStyles.sideItem}>Scenes - 507,852</div>
          <div className={homeStyles.sideItem}>Movies - 63,458</div>
          <div className={homeStyles.sideItem}>Directors - 1,493</div>
          <div className={homeStyles.sideItem}>Studios - 1,554</div>
          <div className={homeStyles.sideItem}>Tags - 229</div>
        </div>

        <div className={homeStyles.storeBox}>
          Store18 - Official Store
        </div>

      </div>



      {/* CENTER CONTENT */}
      <div className={homeStyles.centerContent}>


        <div className={homeStyles.mainHeader}>
          Movie Studios
        </div>


        <div className={styles.content}>


          <div className={styles.resultBar}>
            Showing {filtered.length.toLocaleString()} results...
          </div>


          <div className={styles.topRow}>

            <h2>
              {filtered.length} Studios
            </h2>


            <input
              value={search}
              onChange={(e)=>{
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search studio..."
            />

          </div>



          <div className={styles.list}>


            {current.map((s)=>(

              <div
                key={s.id}
                className={styles.row}

                onClick={() =>
                  navigate(
                    `/studio/${encodeURIComponent(s.name)}`
                  )
                }
              >

                #{String(s.id).padStart(4,"0")}
                {" - "}
                {s.name}

                <span className={styles.dashes}>
                  {" ----- "}
                </span>

                {s.count}
                {" "}
                {s.count === 1 ? "movie" : "movies"}


              </div>

            ))}


          </div>



          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPage={setPage}
          />


        </div>


      </div>




      {/* RIGHT SIDEBAR */}
      <div className={homeStyles.rightSidebar}>

        <div className={homeStyles.aboutBox}>

          <div className={homeStyles.aboutTitle}>
            About TMDB.com
          </div>

          <p>
            <b>TMDB.com</b> is a Movie Database.
          </p>

          <p>
            Browse movies by studios and creators.
          </p>

        </div>

      </div>


    </div>

  );
}