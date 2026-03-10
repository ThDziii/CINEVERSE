import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import SearchPage from "./pages/Search/SearchPage";
import LoginPage from "./pages/Login/LoginPage";
import WatchlistPage from "./pages/Watchlist/WatchlistPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import useAuth from "./hooks/useAuth";
import useWatchlist from "./hooks/useWatchlist";

function App() {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const {
    watchlist,
    remove: removeFromWatchlist,
    toggle: toggleWatchlist,
    has: inWatchlist,
    clear: clearWatchlist,
  } = useWatchlist();

  const handleLoginSuccess = (data) => {
    login(data);
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Shared props dùng lại ở nhiều trang
  const navProps = {
    watchlistCount: watchlist.length,
    onWatchlistOpen: () => navigate("/watchlist"),
    user,
    onLogout: handleLogout,
    onLoginClick: () => navigate("/login"),
    onNavigate: navigate,
  };

  return (
    <Routes>
      <Route path="/" element={
        <Home
          {...navProps}
          onToggleWatchlist={toggleWatchlist}
          inWatchlist={inWatchlist}
        />
      } />

      <Route path="/search" element={
        <SearchPage {...navProps} />
      } />

      <Route path="/watchlist" element={
        user
          ? <WatchlistPage
              {...navProps}
              watchlist={watchlist}
              onRemove={removeFromWatchlist}
              onClear={clearWatchlist}
            />
          : <Navigate to="/login" replace />
      } />

      <Route path="/profile" element={
        user
          ? <ProfilePage {...navProps} />
          : <Navigate to="/login" replace />
      } />

      <Route path="/login" element={
        user
          ? <Navigate to="/" replace />
          : <LoginPage onNavigate={navigate} onLoginSuccess={handleLoginSuccess} />
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
