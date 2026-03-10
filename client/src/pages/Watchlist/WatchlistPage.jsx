import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import MovieModal from "../../components/MovieModal";
import useMovieModal from "../../hooks/useMovieModal";
import { SectionHeading, Badge, Button } from "../../ui/core";

const GENRE_MAP = {
  28: "Action",     12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime",      18: "Drama",     27: "Horror",     10749: "Romance",
  878: "Sci-Fi",    53: "Thriller",  10752: "War",     10751: "Family",
  14: "Fantasy",    36: "History",   10762: "Kids",    9648: "Mystery",
};

const isNew = (movie) => {
  const d = movie.release_date || movie.first_air_date;
  if (!d) return false;
  return (Date.now() - new Date(d).getTime()) / (1000 * 60 * 60 * 24 * 30) <= 6;
};

/* ── Sort options ── */
const SORT_OPTIONS = [
  { id: "added",   label: "Mới thêm nhất" },
  { id: "rating",  label: "Đánh giá cao"  },
  { id: "year",    label: "Mới nhất"      },
  { id: "title",   label: "Tên A → Z"     },
];

const sortMovies = (list, key) => {
  const copy = [...list];
  switch (key) {
    case "rating": return copy.sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0));
    case "year":   return copy.sort((a, b) => {
      const ya = (b.release_date || b.first_air_date || "").slice(0, 4);
      const yb = (a.release_date || a.first_air_date || "").slice(0, 4);
      return ya.localeCompare(yb);
    });
    case "title":  return copy.sort((a, b) =>
      (a.title || a.name || "").localeCompare(b.title || b.name || "")
    );
    default: return copy; // "added" — giữ thứ tự thêm vào
  }
};

/* ── Watchlist Card ── */
const WatchlistCard = ({ movie, onPlay, onRemove }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : null;
  const title     = movie.title || movie.name || "Untitled";
  const year      = (movie.release_date || movie.first_air_date || "").slice(0, 4);
  const rating    = movie.vote_average?.toFixed(1) ?? null;
  const genre     = GENRE_MAP[movie.genre_ids?.[0]] ?? null;
  const _isNew    = isNew(movie);

  return (
    <div className="wl-card" onClick={() => onPlay(movie)}>
      <div className="wl-card__poster">
        {posterUrl ? (
          <img src={posterUrl} alt={title} loading="lazy" className="wl-card__img" />
        ) : (
          <div className="wl-card__no-poster">🎬</div>
        )}

        {/* badges */}
        {_isNew && (
          <div className="wl-card__badge-new">
            <Badge variant="new">MỚI</Badge>
          </div>
        )}
        {rating && (
          <div className="wl-card__rating">
            <span className="wl-card__star">★</span>{rating}
          </div>
        )}

        {/* hover overlay */}
        <div className="wl-card__overlay">
          <div className="wl-card__play-btn">
            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        <div className="wl-card__vignette" />
      </div>

      <div className="wl-card__info">
        <p className="wl-card__title">{title}</p>
        <p className="wl-card__meta">
          {year}
          {genre && <><span className="wl-card__dot">·</span>{genre}</>}
        </p>
      </div>

      {/* Remove button — stop propagation so it doesn't open modal */}
      <button
        className="wl-card__remove"
        onClick={(e) => { e.stopPropagation(); onRemove(movie.id); }}
        aria-label="Xoá khỏi Watchlist"
        title="Xoá"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

/* ── Empty state ── */
const EmptyState = ({ onBrowse }) => (
  <div className="wl-empty">
    <div className="wl-empty__icon">🎬</div>
    <h3 className="wl-empty__title">Watchlist trống</h3>
    <p className="wl-empty__sub">
      Thêm phim vào đây để xem sau bất cứ lúc nào.
    </p>
    <Button variant="primary" size="md" onClick={onBrowse}>
      Khám phá phim
    </Button>
  </div>
);

/* ── Main Page ── */
const WatchlistPage = ({
  onNavigate,
  watchlist     = [],
  onRemove,
  onClear,
  watchlistCount,
  user,
  onLogout,
  onLoginClick,
}) => {
  const [sortKey, setSortKey] = useState("added");
  const { selectedMovie, openModal, closeModal } = useMovieModal();

  const sorted = sortMovies(watchlist, sortKey);

  return (
    <div className="wl-page">
      <Navbar
        watchlistCount={watchlistCount ?? watchlist.length}
        onNavigate={onNavigate}
        onWatchlistOpen={() => {}}
        user={user}
        onLogout={onLogout}
        onLoginClick={onLoginClick}
      />

      <main className="wl-main">
        {/* ── Hero strip ── */}
        <div className="wl-hero">
          <div className="wl-hero__bg" />
          <div className="wl-hero__content">
            <p className="wl-hero__label">Danh sách của bạn</p>
            <h1 className="wl-hero__title">WATCHLIST</h1>
            {watchlist.length > 0 && (
              <p className="wl-hero__count">
                <span className="wl-hero__count-num">{watchlist.length}</span> phim
              </p>
            )}
          </div>
        </div>

        <div className="wl-content">
          {watchlist.length === 0 ? (
            <EmptyState onBrowse={() => onNavigate("home")} />
          ) : (
            <>
              {/* ── Toolbar ── */}
              <div className="wl-toolbar">
                <SectionHeading
                  title="Danh sách phim"
                  rightSlot={
                    <div className="wl-toolbar__right">
                      {/* Sort select */}
                      <div className="wl-sort">
                        <svg className="wl-sort__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                          <path strokeLinecap="round" d="M3 6h18M7 12h10M11 18h2" />
                        </svg>
                        <select
                          className="wl-sort__select"
                          value={sortKey}
                          onChange={(e) => setSortKey(e.target.value)}
                        >
                          {SORT_OPTIONS.map((o) => (
                            <option key={o.id} value={o.id}>{o.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Clear all */}
                      <Button variant="ghost" size="sm" onClick={onClear}>
                        Xoá tất cả
                      </Button>
                    </div>
                  }
                />
              </div>

              {/* ── Grid ── */}
              <div className="wl-grid">
                {sorted.map((movie) => (
                  <WatchlistCard
                    key={movie.id}
                    movie={movie}
                    onPlay={openModal}
                    onRemove={onRemove}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={closeModal}
          onWatchPlay={(movie) => console.log("Watch:", movie.title)}
          user={user}
          onLoginClick={onLoginClick}
        />
      )}
    </div>
  );
};

export default WatchlistPage;
