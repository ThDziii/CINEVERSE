import { useState, useEffect, useRef } from "react";
import "../App.css";
import { Button, Avatar } from "../ui/core";

/**
 * CINEVERSE — Navbar.jsx
 *
 * Props:
 *  - activePage      : "home" | "search" | "trending"
 *  - watchlistCount  : number
 *  - onNavigate      : (page: string) => void
 *  - onWatchlistOpen : () => void
 *  - user            : { name, email } | null
 *  - onLogout        : () => void
 *  - onLoginClick    : () => void
 */

const NAV_LINKS = [
  { id: "home",     label: "Trang chủ" },
  { id: "trending", label: "Xu hướng"  },
  { id: "search",   label: "Tìm kiếm"  },
];

/* ─── SVG icons ─── */
const BookmarkIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const LoginIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

const ChevronDown = ({ open }) => (
  <svg className={`user-avatar-chevron${open ? " open" : ""}`} width="10" height="10"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

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

/* ─── User Avatar Dropdown ─── */
function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="user-menu" ref={ref}>
      <button className="user-avatar-btn" onClick={() => setOpen((v) => !v)} aria-label="Tài khoản">
        <Avatar name={user.name || user.email} size="sm" />
        <ChevronDown open={open} />
      </button>

      {open && (
        <div className="user-dropdown">
          <div className="user-dropdown__header">
            <Avatar name={user.name || user.email} size="md" />
            <div>
              <p className="user-dropdown__name">{user.name || "Người dùng"}</p>
              <p className="user-dropdown__email">{user.email}</p>
            </div>
          </div>
          <div className="user-dropdown__divider" />
          <button className="user-dropdown__item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            Hồ sơ
          </button>
          <button className="user-dropdown__item">
            <BookmarkIcon />
            Watchlist
          </button>
          <div className="user-dropdown__divider" />
          <button className="user-dropdown__item user-dropdown__item--danger" onClick={onLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Watchlist Button (desktop) ─── */
function WatchlistBtn({ count, onClick }) {
  return (
    <button onClick={onClick} className="watchlist-btn">
      <BookmarkIcon />
      Watchlist
      <span className={`watchlist-count ${count > 0 ? "has-items" : "empty"}`}>{count}</span>
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
      {count > 0 && <span className="watchlist-icon-badge">{count > 9 ? "9+" : count}</span>}
    </button>
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

/* ══════════════════════════════════════
   NAVBAR
══════════════════════════════════════ */
export default function Navbar({
  activePage = "home",
  watchlistCount = 0,
  onNavigate = () => {},
  onWatchlistOpen = () => {},
  user = null,
  onLogout = () => {},
  onLoginClick = () => {},
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
    if (page === "trending") {
      // Nếu đang ở home → scroll xuống #trending
      if (activePage === "home") {
        const el = document.getElementById("trending");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          setMobileOpen(false);
          return;
        }
      }
      // Đang ở trang khác → về home, sau đó scroll
      onNavigate("home");
      setMobileOpen(false);
      // Đợi DOM render xong rồi scroll
      setTimeout(() => {
        const el = document.getElementById("trending");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
      return;
    }
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
              <div className="navbar-right__desktop">
                <WatchlistBtn count={watchlistCount} onClick={onWatchlistOpen} />
                {user
                  ? <UserMenu user={user} onLogout={onLogout} />
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

              {/* login / logout row */}
              <li className="mobile-watchlist-item">
                {user ? (
                  <button
                    onClick={() => { onLogout(); setMobileOpen(false); }}
                    className="mobile-watchlist-btn"
                    style={{ color: 'var(--c-crimson-light)' }}
                  >
                    <span className="mobile-menu-indicator" style={{ background: 'var(--c-crimson)' }} />
                    Đăng xuất ({user.name || user.email})
                  </button>
                ) : (
                  <button
                    onClick={() => { onLoginClick(); setMobileOpen(false); }}
                    className="mobile-watchlist-btn"
                  >
                    <span className="mobile-menu-indicator" style={{ background: 'var(--c-crimson)' }} />
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