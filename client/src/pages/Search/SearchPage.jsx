import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import MovieModal from "../../components/MovieModal";
import useMovieModal from "../../hooks/useMovieModal";
import useSearchHistory from "../../hooks/useSearchHistory";
import { Badge, SectionHeading, Spinner } from "../../ui/core";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const GENRE_TAGS = [
  { id: 28,    label: "Hành động" },
  { id: 27,    label: "Kinh dị"   },
  { id: 10749, label: "Tình cảm"  },
  { id: 16,    label: "Hoạt hình" },
  { id: 878,   label: "Sci-Fi"    },
  { id: 35,    label: "Hài"       },
];

const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime",  18: "Drama",     27: "Horror",     10749: "Romance",
  878: "Sci-Fi", 53: "Thriller", 10752: "War",     10751: "Family",
};

// A movie is "new" if released within the last 6 months
const isNew = (movie) => {
  const d = movie.release_date || movie.first_air_date;
  if (!d) return false;
  const diff = (Date.now() - new Date(d).getTime()) / (1000 * 60 * 60 * 24 * 30);
  return diff <= 6;
};

// ── Debounce hook ──
const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

const SearchPage = ({ onNavigate, watchlistCount, onWatchlistOpen, user, onLoginClick }) => {
  const [query,        setQuery]        = useState("");
  const [results,      setResults]      = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [activeGenre,  setActiveGenre]  = useState(null);
  // "idle" | "search" | "genre"
  const [mode,         setMode]         = useState("idle");

  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(query.trim(), 400);

  const { selectedMovie, openModal, closeModal } = useMovieModal();
  const { history, addHistory, removeHistory, clearHistory } = useSearchHistory();

  // Auto-focus input on mount
  useEffect(() => { inputRef.current?.focus(); }, []);

  // ── Fetch by text query ──
  const doSearch = useCallback(async (q) => {
    if (!q) { setResults([]); setMode("idle"); return; }
    setLoading(true);
    setMode("search");
    try {
      const res  = await fetch(`${API_URL}/api/movies/search?query=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : data.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch by genre ──
  const doGenre = useCallback(async (genreId) => {
    setLoading(true);
    setMode("genre");
    try {
      const res  = await fetch(`${API_URL}/api/movies/genre?genre_id=${genreId}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : data.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Run text search on debounced query change
  useEffect(() => {
    if (activeGenre) return; // genre mode takes priority
    doSearch(debouncedQuery);
  }, [debouncedQuery, doSearch, activeGenre]);

  const handleGenreClick = (genreId) => {
    if (activeGenre === genreId) {
      // Deselect — go back to text search or idle
      setActiveGenre(null);
      const q = query.trim();
      if (q) { doSearch(q); } else { setResults([]); setMode("idle"); }
    } else {
      setActiveGenre(genreId);
      setQuery("");
      doGenre(genreId);
    }
  };

  const handleCardClick = (movie) => {
    addHistory(movie);
    openModal(movie);
  };

  const handleHistoryClick = (movie) => {
    openModal(movie);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeGenre) { setActiveGenre(null); }
    doSearch(query.trim());
  };

  const showResults  = mode === "search" || mode === "genre";
  const showHistory  = mode === "idle" && history.length > 0;
  const showIdle     = mode === "idle" && history.length === 0;

  const resultsTitle = loading
    ? "Đang tải..."
    : mode === "genre"
      ? GENRE_TAGS.find((g) => g.id === activeGenre)?.label ?? "Kết quả"
      : `Kết quả${query ? ` cho "${query}"` : ""}`;

  return (
    <div className="search-page">
      <Navbar
        activePage="search"
        watchlistCount={watchlistCount ?? 0}
        onNavigate={onNavigate}
        onWatchlistOpen={onWatchlistOpen}
        user={user}
        onLoginClick={onLoginClick}
      />

      <main className="search-main">
        {/* ── Centered search hero ── */}
        <div className={`search-hero${showResults ? " search-hero--compact" : ""}`}>
          <form className="search-form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              className="search-input"
              type="text"
              placeholder="Nhập tên phim, diễn viên, đạo diễn..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (activeGenre) setActiveGenre(null);
              }}
              autoComplete="off"
            />
            <button className="search-btn" type="submit" aria-label="Tìm kiếm">
              {loading ? (
                <Spinner size={18} color="currentColor" />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
              )}
            </button>
          </form>

          {/* Genre tags */}
          <div className="search-genre-tags">
            {GENRE_TAGS.map((g) => (
              <button
                key={g.id}
                className={`search-genre-tag${activeGenre === g.id ? " search-genre-tag--active" : ""}`}
                onClick={() => handleGenreClick(g.id)}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Results ── */}
        {showResults && (
          <section className="search-results">
            <div className="search-results__header">
              <SectionHeading
                title={resultsTitle}
                rightSlot={!loading && <span className="search-results__count">{results.length} phim</span>}
              />
            </div>

            {!loading && results.length === 0 ? (
              <div className="search-empty">
                <span className="search-empty__icon">🔍</span>
                <p className="search-empty__text">Không tìm thấy phim phù hợp.</p>
                <p className="search-empty__sub">Thử tên khác hoặc chọn thể loại khác.</p>
              </div>
            ) : (
              <div className="search-grid">
                {results.map((movie) => {
                  const posterUrl  = movie.poster_path
                    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                    : null;
                  const title      = movie.title || movie.name || "Untitled";
                  const year       = (movie.release_date || movie.first_air_date || "").slice(0, 4);
                  const rating     = movie.vote_average?.toFixed(1) ?? null;
                  const genreLabel = GENRE_MAP[movie.genre_ids?.[0]] ?? null;
                  const _isNew     = isNew(movie);

                  return (
                    <div key={movie.id} className="search-card" onClick={() => handleCardClick(movie)}>
                      <div className="search-card__poster">
                        {posterUrl ? (
                          <img src={posterUrl} alt={title} loading="lazy" className="search-card__img" />
                        ) : (
                          <div className="search-card__no-poster">🎬</div>
                        )}
                        {rating && (
                          <div className="search-card__rating">
                            <span className="search-card__star">★</span>{rating}
                          </div>
                        )}
                        {_isNew && <Badge variant="new">MỚI</Badge>}
                        <div className="search-card__vignette" />
                        <div className="search-card__overlay">
                          <div className="search-card__play">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <p className="search-card__title">{title}</p>
                      <p className="search-card__meta">
                        {year}{genreLabel && <><span> · </span>{genreLabel}</>}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ── Search history ── */}
        {showHistory && (
          <section className="search-history">
            <div className="search-history__header">
              <SectionHeading
                title="Lịch sử tìm kiếm"
                rightSlot={
                  <button className="search-history__clear" onClick={clearHistory}>
                    Xoá tất cả
                  </button>
                }
              />
            </div>

            <div className="search-history__list">
              {history.map((movie) => {
                const posterUrl = movie.poster_path
                  ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                  : null;
                const title     = movie.title || movie.name || "Untitled";
                const year      = (movie.release_date || movie.first_air_date || "").slice(0, 4);
                const genre     = GENRE_MAP[movie.genre_ids?.[0]] ?? null;
                const rating    = movie.vote_average?.toFixed(1) ?? null;

                return (
                  <div
                    key={movie.id}
                    className="search-history__item"
                    onClick={() => handleHistoryClick(movie)}
                  >
                    <div className="search-history__thumb">
                      {posterUrl ? (
                        <img src={posterUrl} alt={title} />
                      ) : (
                        <span>🎬</span>
                      )}
                    </div>
                    <div className="search-history__info">
                      <p className="search-history__title">{title}</p>
                      <p className="search-history__meta">
                        {year}{genre && <><span> · </span>{genre}</>}
                        {rating && <><span> · </span><span className="search-history__rating">★ {rating}</span></>}
                      </p>
                    </div>
                    <button
                      className="search-history__remove"
                      onClick={(e) => { e.stopPropagation(); removeHistory(movie.id); }}
                      aria-label="Xoá khỏi lịch sử"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Empty state (no query, no history) ── */}
        {showIdle && (
          <div className="search-empty search-empty--idle">
            <span className="search-empty__icon">🎬</span>
            <p className="search-empty__text">Tìm kiếm phim yêu thích của bạn</p>
            <p className="search-empty__sub">Nhập tên phim hoặc chọn thể loại bên trên</p>
          </div>
        )}
      </main>

      <Footer />

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={closeModal}
          onWatchPlay={(movie) => console.log("Watch:", movie.title)}
        />
      )}
    </div>
  );
};

export default SearchPage;
