import { useState, useEffect } from "react";

/**
 * CINEVERSE — Navbar.jsx
 * Màu sắc & font lấy từ CSS Variables định nghĩa trong App.css
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

function useHover() {
  const [hov, setHov] = useState(false);
  return [hov, { onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false) }];
}

/* ─── Logo ─── */
function Logo({ onClick }) {
  const [hov, hovProps] = useHover();
  return (
    <button onClick={onClick} {...hovProps}
      style={{ background:"none", border:"none", cursor:"pointer", padding:0, outline:"none", flexShrink:0 }}>
      <div style={{
        fontFamily: "var(--f-display)",
        fontSize: "26px",
        letterSpacing: "4px",
        color: "var(--c-white)",
        lineHeight: 1,
        userSelect: "none",
      }}>
        CINE
        <span style={{
          color: hov ? "var(--c-crimson-light)" : "var(--c-crimson)",
          transition: "color 0.2s",
        }}>
          VER
        </span>
        SE
      </div>
      <div style={{
        height: "1px",
        background: "linear-gradient(90deg, var(--c-crimson), transparent)",
        marginTop: "3px",
      }} />
    </button>
  );
}

/* ─── Desktop NavLink ─── */
function NavLink({ link, isActive, onClick }) {
  const [hov, hovProps] = useHover();
  const lit = isActive || hov;
  return (
    <li style={{ listStyle: "none" }}>
      <button onClick={onClick} {...hovProps}
        style={{
          position: "relative",
          background: "none", border: "none", cursor: "pointer", outline: "none",
          fontFamily: "var(--f-mono)",
          fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase",
          color: lit ? "var(--c-crimson-light)" : "var(--c-silver)",
          paddingBottom: "4px",
          transition: "color 0.2s",
        }}>
        {link.label}
        <span style={{
          position: "absolute", bottom: 0, left: 0,
          height: "1px",
          width: isActive ? "100%" : hov ? "60%" : "0%",
          background: "var(--c-crimson)",
          transition: "width 0.3s ease",
          display: "block",
        }} />
      </button>
    </li>
  );
}

/* ─── Watchlist Button (desktop) ─── */
function WatchlistBtn({ count, onClick }) {
  const [hov, hovProps] = useHover();
  return (
    <button onClick={onClick} {...hovProps}
      style={{
        display: "flex", alignItems: "center", gap: "8px",
        padding: "8px 20px",
        border: "1px solid var(--c-crimson)",
        background: hov ? "var(--c-crimson)" : "transparent",
        color: hov ? "var(--c-white)" : "var(--c-crimson)",
        fontFamily: "var(--f-mono)",
        fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase",
        cursor: "pointer", transition: "all 0.2s", outline: "none", flexShrink: 0,
      }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      Watchlist
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        minWidth: "18px", height: "18px", padding: "0 4px",
        fontSize: "9px", fontWeight: "700", borderRadius: "2px", transition: "all 0.2s",
        background: count > 0
          ? (hov ? "var(--c-white)"   : "var(--c-crimson)")
          : "var(--c-ash)",
        color: count > 0
          ? (hov ? "var(--c-crimson)" : "var(--c-white)")
          : "var(--c-mist)",
      }}>
        {count}
      </span>
    </button>
  );
}

/* ─── Mobile Watchlist Icon ─── */
function WatchlistIcon({ count, onClick }) {
  const [hov, hovProps] = useHover();
  return (
    <button onClick={onClick} {...hovProps}
      style={{
        position: "relative", background: "none", border: "none",
        cursor: "pointer", padding: "8px", outline: "none",
        color: hov ? "var(--c-crimson-light)" : "var(--c-silver)",
        transition: "color 0.2s",
      }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      {count > 0 && (
        <span style={{
          position: "absolute", top: "2px", right: "2px",
          width: "16px", height: "16px",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "var(--c-crimson)", color: "var(--c-white)",
          fontSize: "8px", fontWeight: "700",
          fontFamily: "var(--f-mono)", borderRadius: "2px",
        }}>
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}

/* ─── Hamburger Bar ─── */
function Bar({ style }) {
  return (
    <span style={{
      display: "block", width: "20px", height: "1.5px",
      background: "var(--c-silver)",
      transition: "all 0.3s ease", transformOrigin: "center",
      ...style,
    }} />
  );
}

/* ─── Mobile Menu Item ─── */
function MobileItem({ link, isActive, onClick }) {
  const [hov, hovProps] = useHover();
  return (
    <li style={{ listStyle: "none" }}>
      <button onClick={onClick} {...hovProps}
        style={{
          display: "flex", alignItems: "center", gap: "14px",
          width: "100%", padding: "14px 0",
          background: "none", border: "none",
          borderBottom: "1px solid var(--c-charcoal)",
          cursor: "pointer", outline: "none",
          fontFamily: "var(--f-mono)",
          fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase",
          color: isActive ? "var(--c-crimson-light)" : hov ? "var(--c-silver)" : "var(--c-mist)",
          transition: "color 0.2s", textAlign: "left",
        }}>
        <span style={{
          width: "3px", height: "16px", flexShrink: 0, transition: "background 0.2s",
          background: isActive ? "var(--c-crimson)" : hov ? "var(--c-ash)" : "transparent",
        }} />
        {link.label}
        {isActive && (
          <span style={{ marginLeft: "auto", color: "var(--c-crimson)", fontSize: "8px" }}>●</span>
        )}
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
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        height: "68px",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        background: scrolled
          ? "rgba(6,6,8,0.98)"
          : "linear-gradient(180deg, rgba(6,6,8,0.98) 0%, rgba(6,6,8,0.80) 100%)",
        borderBottom: scrolled
          ? "1px solid rgba(192,21,42,0.25)"
          : "1px solid rgba(192,21,42,0.1)",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.6)" : "none",
        transition: "all 0.3s ease",
      }}>
        {/* inner container */}
        <div style={{
          maxWidth: "1600px", margin: "0 auto", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: isMobile ? "0 20px" : "0 48px",
        }}>

          <Logo onClick={() => handleNav("home")} />

          {/* desktop links */}
          {!isMobile && (
            <ul style={{ display: "flex", alignItems: "center", gap: "36px", margin: 0, padding: 0 }}>
              {NAV_LINKS.map(link => (
                <NavLink key={link.id} link={link}
                  isActive={activePage === link.id}
                  onClick={() => handleNav(link.id)} />
              ))}
            </ul>
          )}

          {/* right side */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {!isMobile ? (
              <WatchlistBtn count={watchlistCount} onClick={onWatchlistOpen} />
            ) : (
              <>
                <WatchlistIcon count={watchlistCount} onClick={onWatchlistOpen} />
                <button
                  onClick={() => setMobileOpen(v => !v)}
                  aria-label="Menu" aria-expanded={mobileOpen}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    padding: "8px", display: "flex", flexDirection: "column",
                    gap: "5px", outline: "none",
                  }}>
                  <Bar style={mobileOpen ? { transform: "rotate(45deg) translate(4px,4px)",  background: "var(--c-crimson-light)" } : {}} />
                  <Bar style={mobileOpen ? { opacity: 0, transform: "scaleX(0)" } : {}} />
                  <Bar style={mobileOpen ? { transform: "rotate(-45deg) translate(4px,-4px)", background: "var(--c-crimson-light)" } : {}} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* bottom glow line */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "1px", pointerEvents: "none",
          background: "linear-gradient(90deg, transparent 0%, rgba(192,21,42,0.35) 30%, rgba(192,21,42,0.65) 50%, rgba(192,21,42,0.35) 70%, transparent 100%)",
        }} />
      </nav>

      {/* ── MOBILE DROPDOWN ── */}
      {isMobile && (
        <div style={{
          position: "fixed", top: "68px", left: 0, right: 0, zIndex: 999,
          overflow: "hidden",
          maxHeight: mobileOpen ? "400px" : "0px",
          opacity:   mobileOpen ? 1 : 0,
          transition: "max-height 0.35s ease, opacity 0.25s ease",
        }}>
          <div style={{
            background: "rgba(6,6,8,0.98)",
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--c-ash)",
          }}>
            <ul style={{ margin: 0, padding: "8px 24px 16px", listStyle: "none" }}>
              {NAV_LINKS.map(link => (
                <MobileItem key={link.id} link={link}
                  isActive={activePage === link.id}
                  onClick={() => handleNav(link.id)} />
              ))}

              {/* watchlist row */}
              <li style={{ listStyle:"none", borderTop: "1px solid var(--c-ash)", marginTop: "8px", paddingTop: "8px" }}>
                <button
                  onClick={() => { onWatchlistOpen(); setMobileOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    width: "100%", padding: "14px 0",
                    background: "none", border: "none", cursor: "pointer", outline: "none",
                    fontFamily: "var(--f-mono)",
                    fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase",
                    color: "var(--c-crimson)", textAlign: "left",
                  }}>
                  <span style={{ width: "3px", height: "16px", background: "var(--c-crimson)", flexShrink: 0 }} />
                  Watchlist
                  {watchlistCount > 0 && (
                    <span style={{
                      marginLeft: "auto",
                      background: "var(--c-crimson)", color: "var(--c-white)",
                      fontSize: "9px", fontWeight: "700", padding: "2px 8px", borderRadius: "2px",
                    }}>
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
        <div onClick={() => setMobileOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 998 }} />
      )}
    </>
  );
}