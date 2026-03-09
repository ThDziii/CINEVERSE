import { useState } from "react";

const GENRE_MAP = {
  28: "Action",   12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime",    18: "Drama",     27: "Horror",     10749: "Romance",
  878: "Sci-Fi",  53: "Thriller",  10752: "War",     10751: "Family",
};

const FILTERS = [
  { id: "week",  label: "Tuần này" },
  { id: "month", label: "Tháng này" },
];

const TrendingSection = ({ movies = [], onPlay, onCardClick }) => {
  const [activeFilter, setActiveFilter] = useState("week");

  // Giả lập sort: "month" → sort theo vote_count desc, "week" → giữ nguyên thứ tự
  const sorted = activeFilter === "month"
    ? [...movies].sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0))
    : movies;

  const list = sorted.slice(0, 5);

  return (
    <section className="trending-section">
      {/* Header */}
      <div className="trending-section__header">
        <div className="trending-section__title-group">
          <span className="trending-section__accent-bar" />
          <span className="trending-section__fire">🔥</span>
          <h2 className="trending-section__title">Xu Hướng</h2>
        </div>

        {/* Filter tabs */}
        <div className="trending-filters">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={`trending-filter${activeFilter === f.id ? " trending-filter--active" : ""}`}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.label}
              {activeFilter === f.id && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <ol className="trending-list">
        {list.map((movie, index) => {
          const posterUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
            : null;
          const title      = movie.title || movie.name || "Untitled";
          const year       = (movie.release_date || movie.first_air_date || "").slice(0, 4);
          const rating     = movie.vote_average?.toFixed(1) ?? null;
          const genreLabel = GENRE_MAP[movie.genre_ids?.[0]] ?? null;
          const rank       = String(index + 1).padStart(2, "0");

          return (
            <li
              key={movie.id}
              className="trending-item"
              onClick={() => onCardClick ? onCardClick(movie) : onPlay?.(movie)}
            >
              {/* Rank number */}
              <span className="trending-item__rank">{rank}</span>

              {/* Thumbnail */}
              <div className="trending-item__thumb">
                {posterUrl ? (
                  <img src={posterUrl} alt={title} loading="lazy" />
                ) : (
                  <div className="trending-item__thumb-fallback">🎬</div>
                )}
                <div className="trending-item__thumb-overlay">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Info */}
              <div className="trending-item__info">
                <p className="trending-item__title">{title}</p>
                <p className="trending-item__meta">
                  {year}
                  {genreLabel && <><span className="trending-item__dot">·</span>{genreLabel}</>}
                  {rating   && <><span className="trending-item__dot">·</span><span className="trending-item__rating">★ {rating}</span></>}
                </p>
              </div>

              {/* Rank glow decoration */}
              <span className="trending-item__rank-bg" aria-hidden="true">{rank}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default TrendingSection;
