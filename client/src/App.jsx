import { useEffect, useState } from 'react'

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Gọi đến server Node.js của bạn ở cổng 5000
fetch(`${import.meta.env.VITE_API_BASE_URL}/api/movies/popular`)
  .then(res => res.json())
      .then(data => setMovies(data))
      .catch(err => console.error("Lỗi kết nối Backend:", err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-red-600 mb-8 text-center uppercase tracking-widest">
        Cineverse
      </h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map(movie => (
          <div key={movie.id} className="group bg-gray-800 rounded-xl overflow-hidden shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="relative">
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
                className="w-full h-auto object-cover"
              />
              <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-yellow-400 text-xs font-bold">
                ⭐ {movie.vote_average.toFixed(1)}
              </div>
            </div>
            <div className="p-3">
              <h2 className="font-semibold text-sm truncate group-hover:text-red-500 transition-colors">
                {movie.title}
              </h2>
              <p className="text-gray-400 text-xs mt-1">{movie.release_date?.split('-')[0]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App