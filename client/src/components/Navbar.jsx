import { useState, useEffect } from "react";
import "../App.css";

/**
 * CINEVERSE — Navbar.jsx
 * Sử dụng CSS classes từ App.css
 *
 * Props:
 *  - activePage      : "home" | "search" | "trending" | "action"
 *  - watchlistCount  : number
 *  - onNavigate      : (page: string) => void
 *  - onWatchlistOpen : () => void
 */

const NAV_LINKS = [
  { id: "home",     label: "Trang chủ" },
  { id: "search",   label: "Tìm kiếm"  },
  { id: "trending", label: "Xu hướng"  },
  { id: "action",   label: "Hành động" },
];

/* ─── Logo ─── */
function Logo({ onClick }) {
  return (
    <button onClick={onClick} className="logo-btn">
      <div className="logo-text">
        CINE
        <span className="logo-accent">VER</span>
        SE
      </div>
      <div className="logo-underline" />
    </button>
  );
}

/* ─── Desktop NavLink ─── */
function NavLink({ link, isActive, onClick }) {
  return (
    <li>
      <button 
        onClick={onClick}
        className={`nav-link ${isActive ? 'active' : ''}`}
      >
        {link.label}
      </button>
    </li>
  );
}

/* ─── Watchlist Button (desktop) ─── */
function WatchlistBtn({ count, onClick }) {
  return (
    <button onClick={onClick} className="watchlist-btn">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      Watchlist
      <span className={`watchlist-count ${count > 0 ? 'has-items' : 'empty'}`}>
        {count}
      </span>
    </button>
  );
}

/* ─── Mobile Watchlist Icon ─── */
function WatchlistIcon({ count, onClick }) {
  return (
    <button onClick={onClick} className="watchlist-icon-btn">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      {count > 0 && (
        <span className="watchlist-icon-badge">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}

/* ─── Mobile Menu Item ─── */
function MobileItem({ link, isActive, onClick }) {
  return (
    <li className="mobile-menu-item">
      <button 
        onClick={onClick}
        className={`mobile-menu-btn ${isActive ? 'active' : ''}`}
      >
        <span className="mobile-menu-indicator" />
        {link.label}
        {isActive && <span className="mobile-menu-dot">●</span>}
      </button>
    </li>
  );
}

/* ══════════════════════════════════════
   NAVBAR
══════════════════════════════════════ */
export default function Navbar({
  activePage = "home",
  watchlistCount = 0,
  onNavigate = () => {},
  onWatchlistOpen = () => {},
}) {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile,   setIsMobile]   = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  const handleNav = (page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner" style={{ padding: isMobile ? "0 20px" : "0 48px" }}>
          <Logo onClick={() => handleNav("home")} />

          {/* desktop links */}
          {!isMobile && (
            <ul className="nav-list">
              {NAV_LINKS.map(link => (
                <NavLink 
                  key={link.id} 
                  link={link}
                  isActive={activePage === link.id}
                  onClick={() => handleNav(link.id)} 
                />
              ))}
            </ul>
          )}

          {/* right side */}
          <div className="navbar-right">
            {!isMobile ? (
              <WatchlistBtn count={watchlistCount} onClick={onWatchlistOpen} />
            ) : (
              <>
                <WatchlistIcon count={watchlistCount} onClick={onWatchlistOpen} />
                <button
                  onClick={() => setMobileOpen(v => !v)}
                  aria-label="Menu" 
                  aria-expanded={mobileOpen}
                  className={`hamburger-btn ${mobileOpen ? 'open' : ''}`}
                >
                  <span className="hamburger-bar" />
                  <span className="hamburger-bar" />
                  <span className="hamburger-bar" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* bottom glow line */}
        <div className="navbar-glow" />
      </nav>

      {/* ── MOBILE DROPDOWN ── */}
      {isMobile && (
        <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            <ul className="mobile-menu-list">
              {NAV_LINKS.map(link => (
                <MobileItem 
                  key={link.id} 
                  link={link}
                  isActive={activePage === link.id}
                  onClick={() => handleNav(link.id)} 
                />
              ))}

              {/* watchlist row */}
              <li className="mobile-watchlist-item">
                <button
                  onClick={() => { onWatchlistOpen(); setMobileOpen(false); }}
                  className="mobile-watchlist-btn"
                >
                  <span className="mobile-menu-indicator" style={{ background: 'var(--c-crimson)' }} />
                  Watchlist
                  {watchlistCount > 0 && (
                    <span className="mobile-watchlist-badge">
                      {watchlistCount}
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* click-away backdrop */}
      {isMobile && mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="mobile-backdrop" />
      )}
    </>
  );
}