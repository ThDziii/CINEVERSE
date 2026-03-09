import { useState } from "react";
import Navbar from "../../components/Navbar";
import { Button, Input, Divider } from "../../ui/core";

const EyeOpenIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const LoginIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const LoginPage = ({ onNavigate, onLoginSuccess }) => {
  const [tab,      setTab]      = useState("login");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [name,     setName]     = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [showPwd,  setShowPwd]  = useState(false);

  const resetForm = () => {
    setEmail(""); setPassword(""); setConfirm(""); setName(""); setError("");
  };

  const handleTabSwitch = (t) => { setTab(t); resetForm(); };

  const validate = () => {
    if (!email.trim())               return "Vui lòng nhập email.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Email không hợp lệ.";
    if (!password)                   return "Vui lòng nhập mật khẩu.";
    if (password.length < 6)         return "Mật khẩu phải có ít nhất 6 ký tự.";
    if (tab === "register") {
      if (!name.trim())              return "Vui lòng nhập tên hiển thị.";
      if (password !== confirm)      return "Mật khẩu xác nhận không khớp.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);
    try {
      await onLoginSuccess({ email, password, name, tab });
    } catch (err) {
      setError(err.message || "Đã có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Eye-toggle button dùng trong Input rightSlot ── */
  const EyeToggle = (
    <button
      type="button"
      className="login-eye-btn"
      onClick={() => setShowPwd((v) => !v)}
      aria-label={showPwd ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
    >
      {showPwd ? <EyeOffIcon /> : <EyeOpenIcon />}
    </button>
  );

  return (
    <div className="login-page">
      <Navbar activePage="" onNavigate={onNavigate} watchlistCount={0} onWatchlistOpen={() => {}} />

      <main className="login-main">
        <div className="login-bg">
          <div className="login-bg__gradient" />
          <div className="login-bg__noise" />
        </div>

        <div className="login-card">
          {/* Logo */}
          <div className="login-card__logo">
            CINE<span className="login-card__logo-accent">VER</span>SE
          </div>
          <p className="login-card__tagline">Điện ảnh không giới hạn</p>

          {/* Tabs */}
          <div className="login-tabs">
            <button className={`login-tab${tab === "login"    ? " login-tab--active" : ""}`} onClick={() => handleTabSwitch("login")}>Đăng nhập</button>
            <button className={`login-tab${tab === "register" ? " login-tab--active" : ""}`} onClick={() => handleTabSwitch("register")}>Đăng ký</button>
            <div className={`login-tabs__indicator login-tabs__indicator--${tab}`} />
          </div>

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {tab === "register" && (
              <Input
                label="Tên hiển thị"
                type="text"
                placeholder="Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            )}

            <Input
              label="Email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <Input
              label="Mật khẩu"
              type={showPwd ? "text" : "password"}
              placeholder="Tối thiểu 6 ký tự"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={tab === "login" ? "current-password" : "new-password"}
              rightSlot={EyeToggle}
            />

            {tab === "register" && (
              <Input
                label="Xác nhận mật khẩu"
                type={showPwd ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
              />
            )}

            {tab === "login" && (
              <div className="login-forgot">
                <button type="button" className="login-forgot-btn">Quên mật khẩu?</button>
              </div>
            )}

            {error && (
              <div className="login-error">
                <AlertIcon />
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              leftIcon={!loading ? <LoginIcon /> : undefined}
            >
              {tab === "login" ? "Đăng nhập" : "Tạo tài khoản"}
            </Button>
          </form>

          <Divider label="hoặc tiếp tục với" className="login-divider" />

          {/* Social */}
          <div className="login-social">
            <button className="login-social-btn" type="button">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="login-social-btn" type="button">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              GitHub
            </button>
          </div>

          <p className="login-note">
            {tab === "login"
              ? <>Chưa có tài khoản? <button type="button" className="login-note-link" onClick={() => handleTabSwitch("register")}>Đăng ký ngay</button></>
              : <>Đã có tài khoản? <button type="button" className="login-note-link" onClick={() => handleTabSwitch("login")}>Đăng nhập</button></>
            }
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
