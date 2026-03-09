import { useState, useRef, useEffect, useCallback } from "react";
import { SectionHeading } from "../ui/core";

const GENRES = [
  { id: null,  label: "TẤT CẢ" },
  { id: 28,    label: "SIÊU ANH HÙNG" },
  { id: 10752, label: "CHIẾN TRANH" },
  { id: 10543, label: "GIÁN ĐIỆP" },
  { id: 10763, label: "THỂ THAO" },
];

const isNew = (movie) => {
  const date = movie.release_date || movie.first_air_date;
  if (!date) return false;
  const diff = (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24 * 30);
  return diff <= 6;
};

const GENRE_MAP = {
  28:    "Action",   10752: "War",     10543: "Spy",
  10763: "Sport",   35:    "Comedy",  18:    "Drama",
  27:    "Horror",  10749: "Romance", 878:   "Sci-Fi",
  12:    "Adventure",
};

const ROWS_STEP = 2; // số hàng hiện mỗi lần bấm "Hiển thị thêm"

const GenreSection = ({ title = "Thể Loại", movies = [], onPlay, onWatchlist, onCardClick }) => {
  const [activeGenre, setActiveGenre]   = useState(null);
  const [watchlisted, setWatchlisted]   = useState({});
  const [visibleRows, setVisibleRows]   = useState(ROWS_STEP);
  const [cols, setCols]                 = useState(6); // ước tính ban đầu
  const gridRef                         = useRef(null);

  // Đo số cột thực tế từ grid layout
  const measureCols = useCallback(() => {
    if (!gridRef.current) return;
    const gridStyle = window.getComputedStyle(gridRef.current);
    const colCount  = gridStyle.getPropertyValue("grid-template-columns").split(" ").length;
    setCols(colCount || 6);
  }, []);

  useEffect(() => {
    measureCols();
    const ro = new ResizeObserver(measureCols);
    if (gridRef.current) ro.observe(gridRef.current);
    return () => ro.disconnect();
  }, [measureCols]);

  // Reset về 2 hàng khi đổi thể loại
  const handleGenreChange = (id) => {
    setActiveGenre(id);
    setVisibleRows(ROWS_STEP);
  };

  const filtered     = activeGenre
    ? movies.filter((m) => m.genre_ids?.includes(activeGenre))
    : movies;

  const visibleCount = visibleRows * cols;
  const visible      = filtered.slice(0, visibleCount);
  const hasMore      = filtered.length > visibleCount;

  const toggleWatchlist = (e, id) => {
    e.stopPropagation();
    setWatchlisted((prev) => ({ ...prev, [id]: !prev[id] }));
    onWatchlist?.(id);
  };

  return (
    <section className="genre-section">
      {/* Heading */}
      <SectionHeading title={title} />

      {/* Genre tabs */}
      <div className="genre-tabs">
        {GENRES.map((g) => (
          <button
            key={g.id ?? "all"}
            className={`genre-tab${activeGenre === g.id ? " genre-tab--active" : ""}`}
            onClick={() => handleGenreChange(g.id)}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="genre-section__empty">Không có phim cho thể loại này.</p>
      ) : (
        <>
          <div className="genre-grid" ref={gridRef}>
            {visible.map((movie) => {
              const posterUrl  = movie.poster_path
                ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                : null;
              const t          = movie.title || movie.name || "Untitled";
              const year       = (movie.release_date || movie.first_air_date || "").slice(0, 4);
              const rating     = movie.vote_average?.toFixed(1) ?? null;
              const genreLabel = GENRE_MAP[movie.genre_ids?.[0]] ?? null;
              const _isNew     = isNew(movie);
              const inList     = watchlisted[movie.id];

              return (
                <div key={movie.id} className="genre-card" onClick={() => onCardClick?.(movie)}>
                  <div className="genre-card__poster">
                    {posterUrl ? (
                      <img src={posterUrl} alt={t} className="genre-card__img" loading="lazy" />
                    ) : (
                      <div className="genre-card__no-poster">
                        <span>🎬</span>
                        <span>{t}</span>
                      </div>
                    )}

                    {rating && (
                      <div className="genre-card__rating">
                        <span className="genre-card__rating-star">★</span>
                        <span>{rating}</span>
                      </div>
                    )}

                    {_isNew && <span className="genre-card__new-badge">MỚI</span>}

                    <div className="genre-card__vignette" />

                    <div className="genre-card__overlay">
                      <button
                        className="genre-card__play-btn"
                        onClick={() => onPlay?.(movie)}
                        aria-label={`Xem ${t}`}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        XEM
                      </button>
                      <button
                        className={`genre-card__wishlist-btn${inList ? " genre-card__wishlist-btn--active" : ""}`}
                        onClick={(e) => toggleWatchlist(e, movie.id)}
                        aria-label="Thêm vào danh sách"
                      >
                        <svg viewBox="0 0 24 24" fill={inList ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <p className="genre-card__title">{t}</p>
                  <p className="genre-card__meta">
                    {year}
                    {genreLabel && (
                      <>
                        <span className="genre-card__meta-dot">·</span>
                        {genreLabel}
                      </>
                    )}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Load more / collapse buttons */}
          <div className="genre-section__load-more">
            {hasMore && (
              <button
                className="genre-section__load-btn"
                onClick={() => setVisibleRows((r) => r + ROWS_STEP)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                Hiển thị thêm
              </button>
            )}

            {visibleRows > ROWS_STEP && (
              <button
                className="genre-section__load-btn genre-section__load-btn--collapse"
                onClick={() => setVisibleRows(ROWS_STEP)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
                Ẩn bớt
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default GenreSection;
