import React, { useState } from "react";
import styles from "../styles/Pagination.module.css";

export default function Pagination({
  currentPage,
  totalPages,
  onPage,
  onReset
}) {
  const [jumpPage, setJumpPage] = useState("");

  if (totalPages <= 1) return null;

  const visiblePages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 4) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const handleJump = () => {
    const p = Number(jumpPage);
    if (p >= 1 && p <= totalPages) {
      onPage(p);
      setJumpPage("");
    }
  };

  return (
    <div className={styles.wrapper}>

      {/* MAIN PAGINATION */}
      <div className={styles.pagination}>
        <button
          className={styles.btn}
          disabled={currentPage === 1}
          onClick={() => onPage(currentPage - 1)}
        >
          Prev
        </button>

        {visiblePages().map((p, i) =>
          p === "..." ? (
            <span key={i} className={styles.ellipsis}>…</span>
          ) : (
            <button
              key={`${p}-${i}`}
              onClick={() => onPage(p)}
              className={`${styles.page} ${
                p === currentPage ? styles.active : ""
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          className={styles.btn}
          onClick={() => onPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {/* SECOND ROW */}
      <div className={styles.tools}>
        <button className={styles.toolBtn} onClick={() => onPage(1)}>
          Back to 1st Page
        </button>

        <div className={styles.jump}>
          …
          <input
            type="number"
            placeholder="Enter Page"
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
          />
          …
        </div>

        <button className={styles.toolBtn} onClick={onReset}>
          Reset list
        </button>
      </div>

    </div>
  );
}
