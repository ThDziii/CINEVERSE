/**
 * Button — core reusable button
 *
 * Props:
 *  variant  : "primary" | "outline" | "ghost" | "danger"  (default: "primary")
 *  size     : "sm" | "md" | "lg"                          (default: "md")
 *  loading  : boolean
 *  fullWidth: boolean
 *  leftIcon : ReactNode
 *  rightIcon: ReactNode
 *  + all native <button> props (onClick, disabled, type, …)
 */

import Spinner from "./Spinner";

const VARIANT_CLASS = {
  primary : "btn--primary",
  outline : "btn--outline",
  ghost   : "btn--ghost",
  danger  : "btn--danger",
};

const SIZE_CLASS = {
  sm: "btn--sm",
  md: "btn--md",
  lg: "btn--lg",
};

const Button = ({
  children,
  variant   = "primary",
  size      = "md",
  loading   = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...rest
}) => {
  const classes = [
    "btn",
    VARIANT_CLASS[variant] ?? VARIANT_CLASS.primary,
    SIZE_CLASS[size]        ?? SIZE_CLASS.md,
    fullWidth ? "btn--full" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {loading && <Spinner size={14} />}
      {!loading && leftIcon && <span className="btn__icon btn__icon--left">{leftIcon}</span>}
      {children && <span className="btn__label">{children}</span>}
      {!loading && rightIcon && <span className="btn__icon btn__icon--right">{rightIcon}</span>}
    </button>
  );
};

export default Button;
