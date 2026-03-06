import { useState } from "react";
import "../App.css";

/**
 * CINEVERSE — FeaturedHero.jsx
 * Sử dụng CSS classes từ App.css
 * 
 * Props:
 *  - movie: object { title, backdrop_path, overview, vote_average, release_date, runtime, genres }
 *  - onPlayClick: () => void
 *  - onInfoClick: () => void
 */

/* ─── Play Button ─── */
function PlayButton({ onClick }) {
  return (
    <button onClick={onClick} className="btn-play">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
      </svg>
      Xem ngay
    </button>
  );
}

/* ─── Info Button ─── */
function InfoButton({ onClick }) {
  return (
    <button onClick={onClick} className="btn-info">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
      Thông tin
    </button>
  );
}

/* ─── Meta Info Badge ─── */
function MetaBadge({ icon, text }) {
  return (
    <div className="meta-badge">
      {icon && <span style={{ color: "var(--c-crimson)", fontSize: "11px" }}>{icon}</span>}
      {text}
    </div>
  );
}

/* ══════════════════════════════════════
   FEATURED HERO
══════════════════════════════════════ */
export default function FeaturedHero({
  movie,
  onPlayClick = () => {},
  onInfoClick = () => {},
}) {
  if (!movie) {
    return (
      <div className="featured-hero" style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--c-charcoal)",
      }}>
        <div style={{
          fontFamily: "var(--f-mono)",
          fontSize: "12px", letterSpacing: "2px",
          color: "var(--c-mist)", textTransform: "uppercase",
        }}>
          Đang tải phim nổi bật...
        </div>
      </div>
    );
  }

  const {
    title,
    backdrop_path,
    overview,
    vote_average,
    release_date,
    runtime,
    genres = [],
  } = movie;

  const imageUrl = backdrop_path
    ? `https://image.tmdb.org/t/p/original${backdrop_path}`
    : "";

  const year = release_date ? new Date(release_date).getFullYear() : "";
  const runtimeFormatted = runtime
    ? `${Math.floor(runtime / 60)}h ${runtime % 60}m`
    : "";
  const genreText = Array.isArray(genres) && genres.length > 0
    ? genres.slice(0, 2).map(g => typeof g === "string" ? g : g.name).join(" / ")
    : "";

  return (
    <div className="featured-hero">
      {/* Background Image */}
      {imageUrl && (
        <div 
          className="hero-backdrop"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}

      {/* Gradient Overlays */}
      <div className="hero-gradient-left" />
      <div className="hero-gradient-bottom" />

      {/* Content Container */}
      <div className="hero-content">
        <div style={{ maxWidth: "680px" }}>
          {/* Label */}
          <div className="hero-label">
            <span style={{ width: "32px", height: "1px", background: "var(--c-crimson)" }} />
            Phim nổi bật tuần này
          </div>

          {/* Title */}
          <h1 className="hero-title">
            {title?.split(":")[0] || title}
          </h1>

          {title?.includes(":") && (
            <h2 className="hero-subtitle">
              {title.split(":")[1]?.trim()}
            </h2>
          )}

          {/* Meta Info */}
          <div style={{
            display: "flex", flexWrap: "wrap", alignItems: "center",
            gap: "12px", marginBottom: "20px",
          }}>
            {vote_average && (
              <MetaBadge icon="★" text={vote_average.toFixed(1)} />
            )}
            {year && <MetaBadge text={year} />}
            {runtimeFormatted && <MetaBadge text={runtimeFormatted} />}
            {genreText && <MetaBadge text={genreText} />}
          </div>

          {/* Overview */}
          {overview && (
            <p className="hero-overview">
              {overview}
            </p>
          )}

          {/* Action Buttons */}
          <div style={{
            display: "flex", flexWrap: "wrap", alignItems: "center",
            gap: "16px",
          }}>
            <PlayButton onClick={onPlayClick} />
            <InfoButton onClick={onInfoClick} />
          </div>
        </div>
      </div>

      {/* Bottom Fade Line */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "2px", zIndex: 3,
        background: "linear-gradient(90deg, var(--c-crimson) 0%, transparent 50%, var(--c-crimson) 100%)",
        opacity: 0.3,
      }} />
    </div>
  );
}
