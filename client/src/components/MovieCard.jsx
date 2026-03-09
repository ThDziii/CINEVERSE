const MovieCard = ({ movie, onCardClick }) => {
  const hasPoster = Boolean(movie.poster_path);
  const posterUrl = hasPoster ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : null;
  const title = movie.title || movie.name || 'Untitled';
  const year = (movie.release_date || movie.first_air_date || '').slice(0, 4);
  const rating = movie.vote_average?.toFixed(1) ?? null;

  return (
    <div className="movie-card" onClick={() => onCardClick?.(movie)}>
      <div className="movie-card__poster">

        {hasPoster ? (
          <img src={posterUrl} alt={title} className="movie-card__img" loading="lazy" />
        ) : (
          <div className="movie-card__no-poster">
            <span className="movie-card__no-poster-icon">🎬</span>
            <span className="movie-card__no-poster-title">{title}</span>
          </div>
        )}

        {rating && (
          <div className="movie-card__rating">
            <span className="movie-card__rating-star">★</span>
            <span>{rating}</span>
          </div>
        )}

        <div className="movie-card__vignette" />

        <div className="movie-card__overlay">
          <button className="movie-card__play-btn" aria-label={`Play ${title}`}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>

        <div className="movie-card__info">
          <p className="movie-card__info-title">{title}</p>
          {year && <p className="movie-card__info-year">{year}</p>}
        </div>
      </div>

      <p className="movie-card__title">{title}</p>
      {year && <p className="movie-card__year">{year}</p>}
    </div>
  );
};

export default MovieCard;