const MovieCard = ({ movie }) => {
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  
  return (
    <div className="min-w-[160px] md:min-w-[200px] group cursor-pointer transition-transform duration-300 hover:scale-105">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
        <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="bg-white text-black p-2 rounded-full font-bold">▶</button>
        </div>
      </div>
      <h3 className="text-sm mt-2 font-medium truncate">{movie.title || movie.name}</h3>
      <p className="text-xs text-yellow-400">⭐ {movie.vote_average?.toFixed(1)}</p>
    </div>
  );
};

export default MovieCard;