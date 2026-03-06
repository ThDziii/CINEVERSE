import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import MovieRow from "../../components/MovieRow";

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [action, setAction] = useState([]);
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // Gọi phim xu hướng
    fetch(`${API_URL}/api/movies/popular`)
      .then(res => res.json())
      .then(data => setTrending(data));
      
    // Sau này bạn viết thêm các route như /api/movies/action ở Backend nhé
  }, [API_URL]);

  return (
    <div className="bg-black min-h-screen text-white pb-20">
      <Navbar 
        activePage="home"
        watchlistCount={0}
        onNavigate={() => {}}
        onWatchlistOpen={() => {}}
      />
      
      {/* Hero Section (Phim nổi bật nhất hôm nay) */}
      <div className="relative h-[80vh] w-full mb-10">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10" />
        {trending[0] && (
          <>
            <img 
              src={`https://image.tmdb.org/t/p/original${trending[0].backdrop_path}`} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute bottom-1/4 left-12 z-20 max-w-lg">
              <h1 className="text-5xl font-extrabold mb-4">{trending[0].title}</h1>
              <p className="text-gray-300 text-sm line-clamp-3 mb-6">{trending[0].overview}</p>
              <button className="bg-white text-black px-8 py-2 rounded font-bold hover:bg-opacity-80 transition">Xem ngay</button>
            </div>
          </>
        )}
      </div>

      {/* Các hàng phim theo chủ đề */}
      <MovieRow title="Phim nổi bật hôm nay" movies={trending} />
      <MovieRow title="Phim Hành động" movies={trending} /> {/* Tạm thời dùng chung data để test UI */}
    </div>
  );
};

export default Home;