import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import FeaturedHero from "../../components/FeaturedHero";
import MovieRow from "../../components/MovieRow";
import GenreSection from "../../components/GenreSection";
import TrendingSection from "../../components/TrendingSection";
import Footer from "../../components/Footer";
import MovieModal from "../../components/MovieModal";
import useMovieModal from "../../hooks/useMovieModal";

const Home = ({ onNavigate, user, onLogout, onLoginClick, watchlistCount, onWatchlistOpen, onToggleWatchlist, inWatchlist }) => {
  const [trending, setTrending] = useState([]);
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const { selectedMovie, openModal, closeModal } = useMovieModal();

  useEffect(() => {
    fetch(`${API_URL}/api/movies/popular`)
      .then(res => res.json())
      .then(data => setTrending(data));
  }, [API_URL]);

  return (
    <div style={{ background: "var(--c-void)", minHeight: "100vh" }}>
      <Navbar
        watchlistCount={watchlistCount ?? 0}
        onNavigate={onNavigate ?? (() => {})}
        onWatchlistOpen={onWatchlistOpen ?? (() => {})}
        user={user}
        onLogout={onLogout}
        onLoginClick={onLoginClick}
      />

      <FeaturedHero
        movie={trending[0]}
        onPlayClick={() => openModal(trending[0])}
        onInfoClick={() => openModal(trending[0])}
      />

      <div style={{ padding: "48px 0" }}>
        <MovieRow
          title="Phim mới cập nhật"
          movies={trending}
          onCardClick={openModal}
        />

        <TrendingSection
          movies={trending}
          onCardClick={openModal}
        />

        <GenreSection
          title="Khám Phá Theo Thể Loại"
          movies={trending}
          onCardClick={openModal}
          onWatchlist={(id) => console.log("Watchlist:", id)}
        />
      </div>

      <Footer />

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={closeModal}
          onWatchPlay={(movie) => console.log("Watch:", movie.title)}
          inWatchlist={inWatchlist?.(selectedMovie?.id)}
          onToggleWatchlist={onToggleWatchlist}
        />
      )}
    </div>
  );
};

export default Home;