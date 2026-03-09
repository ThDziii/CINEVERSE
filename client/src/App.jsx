import { useState } from "react";
import Home from "./pages/Home/Home";
import SearchPage from "./pages/Search/SearchPage";
import LoginPage from "./pages/Login/LoginPage";
import WatchlistPage from "./pages/Watchlist/WatchlistPage";
import useAuth from "./hooks/useAuth";
import useWatchlist from "./hooks/useWatchlist";

function App() {
  const [activePage, setActivePage] = useState("home");
  const { user, login, logout } = useAuth();
  const { watchlist, add: addToWatchlist, remove: removeFromWatchlist, toggle: toggleWatchlist, has: inWatchlist, clear: clearWatchlist } = useWatchlist();

  const handleLoginSuccess = async (credentials) => {
    await login(credentials);
    setActivePage("home");
  };

  const renderPage = () => {
    switch (activePage) {
      case "login":
        return (
          <LoginPage
            onNavigate={setActivePage}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case "search":
        return (
          <SearchPage
            onNavigate={setActivePage}
            watchlistCount={watchlist.length}
            onWatchlistOpen={() => setActivePage("watchlist")}
            user={user}
            onLoginClick={() => setActivePage("login")}
          />
        );
      case "watchlist":
        return (
          <WatchlistPage
            onNavigate={setActivePage}
            watchlist={watchlist}
            onRemove={removeFromWatchlist}
            onClear={clearWatchlist}
            watchlistCount={watchlist.length}
            user={user}
            onLogout={logout}
            onLoginClick={() => setActivePage("login")}
          />
        );
      default:
        return (
          <Home
            onNavigate={setActivePage}
            watchlistCount={watchlist.length}
            onWatchlistOpen={() => setActivePage("watchlist")}
            user={user}
            onLogout={logout}
            onLoginClick={() => setActivePage("login")}
            onToggleWatchlist={toggleWatchlist}
            inWatchlist={inWatchlist}
          />
        );
    }
  };

  return <div className="App">{renderPage()}</div>;
}

export default App;