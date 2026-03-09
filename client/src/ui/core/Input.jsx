/**
 * Input — reusable text / email / password field
 *
 * Props:
 *  label      : string
 *  error      : string
 *  hint       : string
 *  leftIcon   : ReactNode
 *  rightSlot  : ReactNode   (e.g. show-password toggle button)
 *  fullWidth  : boolean
 *  + all native <input> props (type, value, onChange, placeholder, …)
 */

const Input = ({
  label,
  error,
  hint,
  leftIcon,
  rightSlot,
  fullWidth = true,
  className = "",
  id,
  ...rest
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className={`input-field${fullWidth ? " input-field--full" : ""}${className ? ` ${className}` : ""}`}>
      {label && (
        <label className="input-field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className={`input-field__wrap${error ? " input-field__wrap--error" : ""}`}>
        {leftIcon && (
          <span className="input-field__left-icon" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={`input-field__input${leftIcon ? " input-field__input--indent" : ""}${rightSlot ? " input-field__input--pad-right" : ""}`}
          {...rest}
        />
        {rightSlot && (
          <span className="input-field__right-slot">
            {rightSlot}
          </span>
        )}
      </div>
      {error && <p className="input-field__error">{error}</p>}
      {!error && hint && <p className="input-field__hint">{hint}</p>}
    </div>
  );
};

export default Input;
