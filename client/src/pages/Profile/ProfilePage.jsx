import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Avatar, Button, Input } from "../../ui/core";
import {
  EditIcon, SaveIcon, BookmarkIcon, UserIcon,
  MailIcon, CalendarIcon, ShieldIcon, LogoutIcon,
} from "../../ui/icon";

/* ── Stat Card ── */
const StatCard = ({ icon, label, value, accent }) => (
  <div className="profile-stat-card">
    <div className={`profile-stat-card__icon ${accent ? "accent" : ""}`}>{icon}</div>
    <div>
      <p className="profile-stat-card__value">{value}</p>
      <p className="profile-stat-card__label">{label}</p>
    </div>
  </div>
);

/* ── Info Row ── */
const InfoRow = ({ icon, label, value }) => (
  <div className="profile-info-row">
    <span className="profile-info-row__icon">{icon}</span>
    <div className="profile-info-row__content">
      <p className="profile-info-row__label">{label}</p>
      <p className="profile-info-row__value">{value || "—"}</p>
    </div>
  </div>
);

/* ══════════════════════════════════
   PROFILE PAGE
══════════════════════════════════ */
const ProfilePage = ({
  onNavigate,
  user,
  onLogout,
  onLoginClick,
  watchlistCount = 0,
  onWatchlistOpen,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState(user?.username || user?.name || "");
  const [savedName, setSavedName]     = useState(user?.username || user?.name || "");
  const [saved, setSaved]             = useState(false);

  const handleSave = () => {
    if (!displayName.trim()) return;
    // Cập nhật localStorage để duy trì qua reload
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    const updated = { ...stored, username: displayName.trim() };
    localStorage.setItem("user", JSON.stringify(updated));
    setSavedName(displayName.trim());
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => {
    setDisplayName(savedName);
    setEditMode(false);
  };

  const joinDate = (() => {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    if (stored.createdAt) {
      return new Date(stored.createdAt).toLocaleDateString("vi-VN", {
        year: "numeric", month: "long", day: "numeric",
      });
    }
    return "Không rõ";
  })();

  if (!user) {
    return (
      <div className="profile-page">
        <Navbar
          watchlistCount={watchlistCount}
          onNavigate={onNavigate}
          onWatchlistOpen={onWatchlistOpen}
          user={user}
          onLogout={onLogout}
          onLoginClick={onLoginClick}
        />
        <main className="profile-main">
          <div className="profile-not-logged-in">
            <div className="profile-not-logged-in__icon">🔒</div>
            <h2 className="profile-not-logged-in__title">Bạn chưa đăng nhập</h2>
            <p className="profile-not-logged-in__sub">Đăng nhập để xem và chỉnh sửa hồ sơ của bạn.</p>
            <Button variant="primary" size="md" onClick={() => onNavigate("/login")}>
              Đăng nhập
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar
        watchlistCount={watchlistCount}
        onNavigate={onNavigate}
        onWatchlistOpen={onWatchlistOpen}
        user={user}
        onLogout={onLogout}
        onLoginClick={onLoginClick}
      />

      <main className="profile-main">
        {/* ── Hero Banner ── */}
        <div className="profile-hero">
          <div className="profile-hero__bg" />
          <div className="profile-hero__noise" />
          <div className="profile-hero__content">
            <p className="profile-hero__label">Tài khoản</p>
            <h1 className="profile-hero__title">Hồ sơ</h1>
          </div>
        </div>

        <div className="profile-body">
          {/* ── Left: Avatar + Edit ── */}
          <div className="profile-sidebar">
            <div className="profile-card">
              <div className="profile-card__avatar-wrap">
                <div className="profile-card__avatar-ring">
                  <Avatar name={savedName || user.email} size="lg" />
                </div>
                {saved && (
                  <div className="profile-card__saved-badge">✓ Đã lưu</div>
                )}
              </div>

              {editMode ? (
                <div className="profile-card__edit-form">
                  <label className="profile-card__edit-label">Tên hiển thị</label>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Nhập tên của bạn…"
                    size="sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSave();
                      if (e.key === "Escape") handleCancel();
                    }}
                  />
                  <div className="profile-card__edit-actions">
                    <Button variant="primary" size="sm" onClick={handleSave} leftIcon={<SaveIcon />}>
                      Lưu
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleCancel}>
                      Huỷ
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="profile-card__name">{savedName}</p>
                  <p className="profile-card__email">{user.email || ""}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditMode(true)}
                    leftIcon={<EditIcon />}
                  >
                    Chỉnh sửa tên
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="profile-stats">
              <StatCard
                icon={<BookmarkIcon size={16} />}
                label="Phim đã lưu"
                value={watchlistCount}
                accent
              />
              <StatCard
                icon={<UserIcon size={16} />}
                label="Loại tài khoản"
                value="Thành viên"
              />
            </div>
          </div>

          {/* ── Right: Info ── */}
          <div className="profile-content">
            {/* Account Info */}
            <section className="profile-section">
              <div className="profile-section__header">
                <h2 className="profile-section__title">Thông tin</h2>
                <div className="profile-section__line" />
              </div>

              <div className="profile-info-list">
                <InfoRow icon={<UserIcon />}     label="Tên"          value={savedName} />
                <InfoRow icon={<MailIcon />}     label="Email"        value={user.email || ""} />
                <InfoRow icon={<CalendarIcon />} label="Tham gia"     value={joinDate} />
              </div>
            </section>

            {/* Security */}
            <section className="profile-section">
              <div className="profile-section__header">
                <h2 className="profile-section__title">Bảo mật</h2>
                <div className="profile-section__line" />
              </div>

              <div className="profile-security">
                <div className="profile-security__row">
                  <div className="profile-security__info">
                    <span className="profile-security__icon"><ShieldIcon /></span>
                    <div>
                      <p className="profile-security__name">Mật khẩu</p>
                      <p className="profile-security__hint">Đổi mật khẩu tài khoản</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onNavigate("/login")}>
                    Đổi mật khẩu
                  </Button>
                </div>
              </div>
            </section>

            {/* Danger zone */}
            <section className="profile-section">
              <div className="profile-section__header">
                <h2 className="profile-section__title" style={{ color: "var(--c-crimson-light)" }}>
                  Đăng xuất
                </h2>
                <div className="profile-section__line" style={{ background: "var(--c-crimson)" }} />
              </div>

              <div className="profile-danger">
                <div className="profile-danger__row">
                  <div>
                    <p className="profile-danger__name">Đăng xuất khỏi tài khoản</p>
                    <p className="profile-danger__hint">Bạn sẽ cần đăng nhập lại để tiếp tục</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLogout}
                    leftIcon={<LogoutIcon />}
                    style={{ color: "var(--c-crimson-light)", borderColor: "var(--c-crimson)" }}
                  >
                    Đăng xuất
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
