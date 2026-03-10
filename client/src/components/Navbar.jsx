import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "../App.css";
import { Button, Avatar } from "../ui/core";
import { BookmarkIcon, LoginIcon, LogoutIcon, UserIcon, ChevronDown } from "../ui/icon";

/**
 * CINEVERSE — Navbar.jsx
 *
 * Props:
 *  - watchlistCount  : number
 *  - onNavigate      : react-router navigate fn
 *  - onWatchlistOpen : () => void
 *  - user            : { username, email } | null
 *  - onLogout        : () => void
 *  - onLoginClick    : () => void
 */

const NAV_LINKS = [
  { id: "home",     label: "Trang chủ", path: "/"           },
  { id: "trending", label: "Xu hướng",  path: "/#trending"  },
  { id: "search",   label: "Tìm kiếm",  path: "/search"     },
];

/* ─── Mobile Watchlist Icon ─── */
function WatchlistIcon({ count, onClick }) {
  return (
    <button onClick={onClick} className="watchlist-icon-btn">
      <BookmarkIcon size={20} />
      {count > 0 && <span className="watchlist-icon-badge">{count > 9 ? "9+" : count}</span>}
    </button>
  );
}

/* ─── Desktop Watchlist Button ─── */
function WatchlistBtn({ count, onClick }) {
  return (
    <button onClick={onClick} className="watchlist-btn">
      <BookmarkIcon />
      Watchlist
      <span className={`watchlist-count ${count > 0 ? "has-items" : "empty"}`}>{count}</span>
    </button>
  );
}

/* ─── Logo ─── */
function Logo({ onClick }) {
  return (
    <button onClick={onClick} className="logo-btn">
      <div className="logo-text">CINE<span className="logo-accent">VER</span>SE</div>
      <div className="logo-underline" />
    </button>
  );
}

/* ─── Desktop NavLink ─── */
function NavLink({ link, isActive, onClick }) {
  return (
    <li>
      <button onClick={onClick} className={`nav-link ${isActive ? "active" : ""}`}>
        {link.label}
      </button>
    </li>
  );
}

/* ─── Mobile Menu Item ─── */
function MobileItem({ link, isActive, onClick }) {
  return (
    <li className="mobile-menu-item">
      <button onClick={onClick} className={`mobile-menu-btn ${isActive ? "active" : ""}`}>
        <span className="mobile-menu-indicator" />
        {link.label}
        {isActive && <span className="mobile-menu-dot">●</span>}
      </button>
    </li>
  );
}

/* ─── User Avatar Dropdown ─── */
function UserMenu({ user, onLogout, onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const displayName = user.username || user.name || user.email;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="user-menu" ref={ref}>
      <button className="user-avatar-btn" onClick={() => setOpen((v) => !v)} aria-label="Tài khoản">
        <Avatar name={displayName} size="sm" />
        <ChevronDown open={open} />
      </button>

      {open && (
        <div className="user-dropdown">
          <div className="user-dropdown__header">
            <Avatar name={displayName} size="md" />
            <div>
              <p className="user-dropdown__name">{displayName}</p>
              <p className="user-dropdown__email">{user.email || ""}</p>
            </div>
          </div>
          <div className="user-dropdown__divider" />
          <button className="user-dropdown__item" onClick={() => { setOpen(false); onNavigate("/profile"); }}>
            <UserIcon size={14} />
            Hồ sơ
          </button>
          <button className="user-dropdown__item" onClick={() => { setOpen(false); onNavigate("/watchlist"); }}>
            <BookmarkIcon size={14} />
            Watchlist
          </button>
          <div className="user-dropdown__divider" />
          <button className="user-dropdown__item user-dropdown__item--danger" onClick={() => { setOpen(false); onLogout(); }}>
            <LogoutIcon size={14} />
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   NAVBAR
══════════════════════════════════════ */
export default function Navbar({
  watchlistCount = 0,
  onNavigate = () => {},
  onWatchlistOpen = () => {},
  user = null,
  onLogout = () => {},
  onLoginClick = () => {},
}) {
  const location = useLocation();
  const activePage = location.pathname === "/"         ? "home"
                   : location.pathname === "/search"   ? "search"
                   : location.pathname === "/watchlist" ? "watchlist"
                   : location.pathname === "/profile"   ? "profile"
                   : "home";

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

  const handleNav = (path) => {
    if (path === "/#trending") {
      if (location.pathname === "/") {
        const el = document.getElementById("trending");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          setMobileOpen(false);
          return;
        }
      }
      onNavigate("/");
      setMobileOpen(false);
      setTimeout(() => {
        const el = document.getElementById("trending");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
      return;
    }
    onNavigate(path);
    setMobileOpen(false);
  };

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-inner" style={{ padding: isMobile ? "0 20px" : "0 48px" }}>
          <Logo onClick={() => handleNav("/")} />

          {/* desktop links */}
          {!isMobile && (
            <ul className="nav-list">
              {NAV_LINKS.map(link => (
                <NavLink
                  key={link.id}
                  link={link}
                  isActive={activePage === link.id}
                  onClick={() => handleNav(link.path)}
                />
              ))}
            </ul>
          )}

          {/* right side */}
          <div className="navbar-right">
            {!isMobile ? (
              <div className="navbar-right__desktop">
                <WatchlistBtn count={watchlistCount} onClick={onWatchlistOpen} />
                {user
                  ? <UserMenu user={user} onLogout={onLogout} onNavigate={onNavigate} />
                  : (
                    <Button variant="outline" size="sm" onClick={onLoginClick} leftIcon={<LoginIcon />}>
                      Đăng nhập
                    </Button>
                  )
                }
              </div>
            ) : (
              <>
                <WatchlistIcon count={watchlistCount} onClick={onWatchlistOpen} />
                <button
                  onClick={() => setMobileOpen(v => !v)}
                  aria-label="Menu"
                  aria-expanded={mobileOpen}
                  className={`hamburger-btn ${mobileOpen ? "open" : ""}`}
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
        <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
          <div className="mobile-menu-content">
            <ul className="mobile-menu-list">
              {NAV_LINKS.map(link => (
                <MobileItem
                  key={link.id}
                  link={link}
                  isActive={activePage === link.id}
                  onClick={() => handleNav(link.path)}
                />
              ))}

              {/* watchlist row */}
              <li className="mobile-watchlist-item">
                <button
                  onClick={() => { onWatchlistOpen(); setMobileOpen(false); }}
                  className="mobile-watchlist-btn"
                >
                  <span className="mobile-menu-indicator" style={{ background: "var(--c-crimson)" }} />
                  Watchlist
                  {watchlistCount > 0 && (
                    <span className="mobile-watchlist-badge">{watchlistCount}</span>
                  )}
                </button>
              </li>

              {/* login / logout row */}
              <li className="mobile-watchlist-item">
                {user ? (
                  <button
                    onClick={() => { onLogout(); setMobileOpen(false); }}
                    className="mobile-watchlist-btn"
                    style={{ color: "var(--c-crimson-light)" }}
                  >
                    <span className="mobile-menu-indicator" style={{ background: "var(--c-crimson)" }} />
                    Đăng xuất ({user.username || user.email})
                  </button>
                ) : (
                  <button
                    onClick={() => { onLoginClick(); setMobileOpen(false); }}
                    className="mobile-watchlist-btn"
                  >
                    <span className="mobile-menu-indicator" style={{ background: "var(--c-crimson)" }} />
                    Đăng nhập
                  </button>
                )}
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
