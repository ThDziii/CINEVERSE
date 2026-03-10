import { useState } from "react";
import Navbar from "../../components/Navbar";
import { Button, Input, Divider } from "../../ui/core";
import { useRegister, useLogin } from "../../tanstack/hooks/auth";
import { EyeOpenIcon, EyeOffIcon, LoginIcon, AlertIcon } from "../../ui/icon";

const LoginPage = ({ onNavigate, onLoginSuccess }) => {
  const [tab,      setTab]      = useState("login");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [name,     setName]     = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [formError, setFormError] = useState("");

  const registerMutation = useRegister();
  const loginMutation    = useLogin();

  const loading  = registerMutation.isPending || loginMutation.isPending;
  const apiError = registerMutation.error?.message || loginMutation.error?.message || "";
  const error    = formError || apiError;

  const resetForm = () => {
    setEmail(""); setPassword(""); setConfirm(""); setName("");
    setFormError("");
    registerMutation.reset();
    loginMutation.reset();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setFormError(err); return; }
    setFormError("");

    if (tab === "register") {
      registerMutation.mutate(
        { username: name, email, password },
        {
          onSuccess: () => {
            // Toast đã hiển thị trong hook, chuyển sang tab đăng nhập
            resetForm();
            setTab("login");
          },
        }
      );
    } else {
      loginMutation.mutate(
        { email, password },
        { onSuccess: (data) => onLoginSuccess(data) }
      );
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
      <Navbar onNavigate={onNavigate} watchlistCount={0} onWatchlistOpen={() => {}} />

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

          <Divider label="hoặc" className="login-divider" />

          <p className="login-social-note">
            Hiện tại chỉ hỗ trợ đăng nhập bằng email &amp; mật khẩu.
          </p>

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
