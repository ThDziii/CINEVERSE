import { useRef } from "react";
import MovieCard from "./MovieCard";

const MovieRow = ({ title, movies, onCardClick }) => {
  const rowRef = useRef(null);

  const scroll = (dir) => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({ left: dir * rowRef.current.clientWidth * 0.7, behavior: 'smooth' });
  };

  return (
    <section className="movie-row">
      {/* Header */}
      <div className="movie-row__header">
        <div className="movie-row__title-group">
          <span className="movie-row__accent-bar" />
          <h2 className="movie-row__title">{title}</h2>
        </div>
        <button className="movie-row__see-all">
          <span>Xem tất cả</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Scroll area */}
      <div className="movie-row__track-wrapper">
        <div className="movie-row__fade movie-row__fade--left" />
        <div className="movie-row__fade movie-row__fade--right" />

        <div ref={rowRef} className="movie-row__track scrollbar-hide">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onCardClick={onCardClick} />
          ))}
        </div>

        <button className="movie-row__arrow movie-row__arrow--left" aria-label="Scroll left" onClick={() => scroll(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="movie-row__arrow movie-row__arrow--right" aria-label="Scroll right" onClick={() => scroll(1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default MovieRow;