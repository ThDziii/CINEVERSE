import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import FeaturedHero from "../../components/FeaturedHero";
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
    <div style={{ background: "var(--c-void)", minHeight: "100vh" }}>
      <Navbar 
        activePage="home"
        watchlistCount={0}
        onNavigate={() => {}}
        onWatchlistOpen={() => {}}
      />
      
      {/* Featured Hero Section */}
      <FeaturedHero 
        movie={trending[0]}
        onPlayClick={() => console.log("Play clicked")}
        onInfoClick={() => console.log("Info clicked")}
      />

      {/* Các hàng phim theo chủ đề */}
      <div style={{ padding: "48px 0" }}>
        <MovieRow title="Phim nổi bật hôm nay" movies={trending} />
        <MovieRow title="Phim Hành động" movies={trending} />
      </div>
    </div>
  );
};

export default Home;