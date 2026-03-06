import MovieCard from "./MovieCard";

const MovieRow = ({ title, movies }) => {
  return (
    <div className="mb-8 px-4 md:px-12">
      <h2 className="text-xl md:text-2xl font-bold mb-4">{title}</h2>
      <div className="flex overflow-x-scroll scrollbar-hide space-x-4 p-2">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieRow;