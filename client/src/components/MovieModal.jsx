import { useEffect, useRef, useState } from "react";
import { Badge, Button, Avatar } from "../ui/core";
import { useReviews, useCreateReview } from "../tanstack/hooks/review";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const GENRE_MAP = {
  28: "Action",     12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime",      18: "Drama",     27: "Horror",    10749: "Romance",
  878: "Sci-Fi",    53: "Thriller",  10752: "War",    10751: "Family",
  14: "Fantasy",    36: "History",   10762: "Kids",   9648: "Mystery",
  10763: "News",    10764: "Reality",10765: "Sci-Fi & Fantasy",
  10759: "Action & Adventure",
};

const formatRuntime = (mins) => {
  if (!mins) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const MovieModal = ({ movie, onClose, onWatchPlay, inWatchlist: inWatchlistProp, onToggleWatchlist, user, onLoginClick }) => {
  const overlayRef  = useRef(null);
  // Use external state if provided, fallback to local state
  const [localWatchlist, setLocalWatchlist] = useState(false);
  const inWatchlist = inWatchlistProp ?? localWatchlist;
  const handleToggleWatchlist = () => {
    if (onToggleWatchlist) {
      onToggleWatchlist(movie);
    } else {
      setLocalWatchlist((v) => !v);
    }
  };
  const [imgError, setImgError] = useState(false);

  // Cast & crew fetched from TMDB credits
  const [cast,          setCast]          = useState([]);
  const [director,      setDirector]      = useState(null);
  const [loadingCast,   setLoadingCast]   = useState(true);

  // Trailer
  const [trailerKey,    setTrailerKey]    = useState(null);
  const [trailerActive, setTrailerActive] = useState(false);

  // Reviews — via TanStack Query
  const {
    data: reviewData,
    isLoading: loadingReviews,
  } = useReviews(movie?.id);

  const reviews     = reviewData?.reviews      ?? [];
  const reviewAvg   = reviewData?.averageRating ?? null;
  const reviewCount = reviewData?.count         ?? 0;

  const createReview = useCreateReview(movie?.id);

  // Local form state
  const [reviewRating,  setReviewRating]  = useState(0);
  const [reviewHover,   setReviewHover]   = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const hasReviewed = user
    ? reviews.some((r) => r.userId?.toString() === user.id?.toString())
    : false;

  const handleSubmitReview = () => {
    if (!reviewRating) return;
    createReview.mutate(
      { rating: reviewRating, comment: reviewComment.trim(), username: user?.username ?? "Người dùng" },
      {
        onSuccess: () => {
          setSubmitSuccess(true);
          setReviewRating(0);
          setReviewComment("");
        },
      },
    );
  };

  const title      = movie.title || movie.name || "Untitled";
  const year       = (movie.release_date || movie.first_air_date || "").slice(0, 4);
  const rating     = movie.vote_average?.toFixed(1) ?? null;
  const overview   = movie.overview || "";
  const runtime    = formatRuntime(movie.runtime);
  const genres     = (movie.genre_ids || [])
    .map((id) => GENRE_MAP[id])
    .filter(Boolean)
    .slice(0, 3)
    .join(" / ");
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : movie.poster_path
    ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
    : null;

  // ESC to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Fetch cast + director from backend
  useEffect(() => {
    if (!movie?.id) return;
    setLoadingCast(true);
    fetch(`${API_URL}/api/movies/${movie.id}/credits`)
      .then((r) => r.json())
      .then((data) => {
        setCast(data.cast?.slice(0, 8) ?? []);
        const dir = data.crew?.find((c) => c.job === "Director");
        setDirector(dir ?? null);
      })
      .catch(() => { setCast([]); setDirector(null); })
      .finally(() => setLoadingCast(false));
  }, [movie?.id]);

  // Fetch trailer key
  useEffect(() => {
    if (!movie?.id) return;
    setTrailerKey(null);
    setTrailerActive(false);
    fetch(`${API_URL}/api/movies/${movie.id}/videos`)
      .then((r) => r.json())
      .then((data) => setTrailerKey(data.key ?? null))
      .catch(() => setTrailerKey(null));
  }, [movie?.id]);

  // Click outside to close
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="modal">
        {/* Close button */}
        <button className="modal__close" onClick={onClose} aria-label="Đóng">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Backdrop image */}
        <div className="modal__backdrop">
          {backdropUrl && !imgError ? (
            <img
              src={backdropUrl}
              alt={title}
              className="modal__backdrop-img"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="modal__backdrop-fallback">🎬</div>
          )}
          <div className="modal__backdrop-gradient" />
        </div>

        {/* Content */}
        <div className="modal__body">
          {/* Title */}
          <h2 className="modal__title">{title}</h2>

          {/* Meta row */}
          <div className="modal__meta">
            {rating && (
              <span className="modal__rating">
                <span className="modal__rating-star">★</span>
                <strong>{rating}</strong>
                <span className="modal__rating-max">/ 10</span>
              </span>
            )}
            {genres && <Badge variant="genre">{genres.split(" / ")[0]}</Badge>}
            {year   && <Badge>{year}</Badge>}
            {runtime && <Badge>{runtime}</Badge>}
            {genres && <Badge>{genres}</Badge>}
          </div>

          {/* Overview */}
          {overview && (
            <blockquote className="modal__overview">
              <div className="modal__overview-bar" />
              <p>{overview}</p>
            </blockquote>
          )}

          {/* Trailer */}
          <div className="modal__trailer-section">
            <p className="modal__section-label">Trailer</p>
            {trailerKey ? (
              trailerActive ? (
                <div className="modal__trailer-embed">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
                    title="Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div
                  className="modal__trailer modal__trailer--clickable"
                  onClick={() => setTrailerActive(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setTrailerActive(true)}
                  aria-label="Xem trailer"
                >
                  <img
                    className="modal__trailer-thumb"
                    src={`https://img.youtube.com/vi/${trailerKey}/hqdefault.jpg`}
                    alt="Thumbnail trailer"
                  />
                  <div className="modal__trailer-overlay">
                    <button className="modal__trailer-play" aria-label="Phát trailer" tabIndex={-1}>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                    <span className="modal__trailer-label">XEM TRAILER</span>
                  </div>
                </div>
              )
            ) : (
              <div className="modal__trailer modal__trailer--no-video">
                <span className="modal__trailer-label modal__trailer-label--muted">Không có trailer</span>
              </div>
            )}
          </div>

          {/* Director */}
          {director && (
            <div className="modal__director">
              <span className="modal__section-label">Đạo diễn</span>
              <span className="modal__director-name">{director.name}</span>
            </div>
          )}

          {/* Cast */}
          <div className="modal__cast-section">
            <p className="modal__section-label">Dàn diễn viên</p>
            {loadingCast ? (
              <div className="modal__cast-skeleton">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="modal__cast-skel-item">
                    <div className="modal__cast-skel-avatar" />
                    <div className="modal__cast-skel-name" />
                  </div>
                ))}
              </div>
            ) : cast.length > 0 ? (
              <div className="modal__cast-list">
                {cast.map((actor) => (
                  <div key={actor.id} className="modal__cast-item">
                    <div className="modal__cast-avatar">
                      {actor.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                          alt={actor.name}
                        />
                      ) : (
                        <Avatar name={actor.name} size="sm" />
                      )}
                    </div>
                    <p className="modal__cast-name">{actor.name}</p>
                    {actor.character && (
                      <p className="modal__cast-char">{actor.character}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="modal__cast-empty">Không có thông tin diễn viên.</p>
            )}
          </div>

          {/* ── Review Section ── */}
          <div className="modal__reviews">
            <div className="modal__reviews-header">
              <p className="modal__section-label">Đánh giá</p>
              <div className="modal__reviews-scores">
                {/* TMDB score */}
                {rating && (
                  <div className="modal__score-badge modal__score-badge--tmdb">
                    <span className="modal__score-star">★</span>
                    <span className="modal__score-value">{rating}</span>
                    <span className="modal__score-source">TMDB</span>
                  </div>
                )}
                {/* CineVerse score */}
                {!loadingReviews && reviewCount > 0 && (
                  <div className="modal__score-badge modal__score-badge--cv">
                    <span className="modal__score-star">★</span>
                    <span className="modal__score-value">{reviewAvg}</span>
                    <span className="modal__score-source">CINEVERSE ({reviewCount})</span>
                  </div>
                )}
              </div>
            </div>

            {/* Review form / status */}
            {user ? (
              hasReviewed || submitSuccess ? (
                <div className="modal__review-done">
                  <span className="modal__review-done-icon">✓</span>
                  Bạn đã đánh giá bộ phim này
                </div>
              ) : (
                <div className="modal__review-form">
                  <p className="modal__review-form-title">Viết đánh giá của bạn</p>
                  {/* Star selector 1–10 */}
                  <div className="modal__star-row">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        className={`modal__star ${n <= (reviewHover || reviewRating) ? "modal__star--on" : ""}`}
                        onClick={() => setReviewRating(n)}
                        onMouseEnter={() => setReviewHover(n)}
                        onMouseLeave={() => setReviewHover(0)}
                        aria-label={`${n} sao`}
                        type="button"
                      >
                        ★
                      </button>
                    ))}
                    {reviewRating > 0 && (
                      <span className="modal__star-value">{reviewRating}/10</span>
                    )}
                  </div>
                  <textarea
                    className="modal__review-textarea"
                    placeholder="Nhận xét của bạn về bộ phim... (tuỳ chọn)"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    maxLength={1000}
                    rows={3}
                  />
                  {createReview.isError && (
                    <p className="modal__review-error">{createReview.error?.message}</p>
                  )}
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSubmitReview}
                    disabled={createReview.isPending || !reviewRating}
                  >
                    {createReview.isPending ? "Đang gửi..." : "Gửi đánh giá"}
                  </Button>
                </div>
              )
            ) : (
              <button className="modal__review-login-prompt" onClick={onLoginClick} type="button">
                <span>🔐</span> Đăng nhập để viết đánh giá
              </button>
            )}

            {/* Reviews list */}
            {loadingReviews ? (
              <div className="modal__reviews-loading">Đang tải đánh giá...</div>
            ) : reviews.length > 0 ? (
              <div className="modal__reviews-list">
                {reviews.map((rev) => (
                  <div key={rev._id} className="modal__review-item">
                    <div className="modal__review-top">
                      <Avatar name={rev.username} size="sm" />
                      <div className="modal__review-info">
                        <span className="modal__review-username">{rev.username}</span>
                        <span className="modal__review-date">
                          {new Date(rev.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className="modal__review-stars">
                        {"★".repeat(Math.round(rev.rating / 2))}
                        {"☆".repeat(5 - Math.round(rev.rating / 2))}
                        <span className="modal__review-num">{rev.rating}/10</span>
                      </div>
                    </div>
                    {rev.comment && (
                      <p className="modal__review-comment">{rev.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="modal__reviews-empty">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
            )}
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="modal__actions">
          <Button
            variant="primary"
            size="md"
            onClick={() => onWatchPlay?.(movie)}
            leftIcon={
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M8 5v14l11-7z" />
              </svg>
            }
          >
            XEM PHIM
          </Button>
          <Button
            variant={inWatchlist ? "outline" : "ghost"}
            size="md"
            onClick={handleToggleWatchlist}
          >
            {inWatchlist ? "✓ WATCHLIST" : "+ WATCHLIST"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
