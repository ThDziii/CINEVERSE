const GENRE_LINKS = ["Hành động", "Kinh dị", "Tình cảm", "Hoạt hình"];
const INFO_LINKS  = ["Về chúng tôi", "Liên hệ", "Chính sách", "Trợ giúp"];

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner">

        {/* Left — brand */}
        <div className="footer__brand">
          <div className="footer__logo">
            CINE<span className="footer__logo-accent">VER</span>SE
          </div>
          <p className="footer__tagline">Trải nghiệm điện ảnh đỉnh cao, mọi lúc mọi nơi.</p>

          {/* Social icons */}
          <div className="footer__socials">
            {/* Facebook */}
            <a href="#" className="footer__social-btn" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
            {/* Twitter / X */}
            <a href="#" className="footer__social-btn" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" className="footer__social-btn" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>
            {/* YouTube */}
            <a href="#" className="footer__social-btn" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right — link columns */}
        <div className="footer__links">
          <div className="footer__col">
            <h4 className="footer__col-title">Thể Loại</h4>
            <ul className="footer__col-list">
              {GENRE_LINKS.map((item) => (
                <li key={item}>
                  <a href="#" className="footer__link">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Thông Tin</h4>
            <ul className="footer__col-list">
              {INFO_LINKS.map((item) => (
                <li key={item}>
                  <a href="#" className="footer__link">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Divider */}
      <div className="footer__divider" />

      {/* Bottom bar */}
      <div className="footer__bottom">
        <p className="footer__copy">© 2026 CINEVERSE — ALL RIGHTS RESERVED</p>
        <p className="footer__made">
          <span className="footer__heart">♥</span> MADE FOR CINEMA LOVERS
        </p>
      </div>
    </footer>
  );
};

export default Footer;
