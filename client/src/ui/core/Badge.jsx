/**
 * Badge — small label/tag
 *
 * Props:
 *  variant : "default" | "crimson" | "new" | "genre"  (default: "default")
 *  + children, className
 */

const VARIANT_CLASS = {
  default : "badge--default",
  crimson : "badge--crimson",
  new     : "badge--new",
  genre   : "badge--genre",
};

const Badge = ({ children, variant = "default", className = "", ...rest }) => {
  const classes = [
    "badge",
    VARIANT_CLASS[variant] ?? VARIANT_CLASS.default,
    className,
  ].filter(Boolean).join(" ");

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
};

export default Badge;
