/**
 * Avatar — initials avatar
 *
 * Props:
 *  name   : string   (used to derive initials)
 *  size   : "sm" | "md" | "lg"  (default: "md")
 *  src    : string   (optional image URL)
 */

const initials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

const SIZE_CLASS = {
  sm: "avatar--sm",
  md: "avatar--md",
  lg: "avatar--lg",
};

const Avatar = ({ name = "", size = "md", src, className = "", ...rest }) => {
  const classes = [
    "avatar",
    SIZE_CLASS[size] ?? SIZE_CLASS.md,
    className,
  ].filter(Boolean).join(" ");

  if (src) {
    return (
      <div className={classes} {...rest}>
        <img src={src} alt={name} className="avatar__img" />
      </div>
    );
  }

  return (
    <div className={classes} aria-label={name} {...rest}>
      {initials(name)}
    </div>
  );
};

export default Avatar;
