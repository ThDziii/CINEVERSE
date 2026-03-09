/**
 * Divider — horizontal rule, optionally with centered text
 *
 * Props:
 *  label : string   (optional)
 */

const Divider = ({ label, className = "" }) => (
  <div className={`divider${label ? " divider--labeled" : ""} ${className}`.trim()}>
    <span className="divider__line" />
    {label && <span className="divider__label">{label}</span>}
    {label && <span className="divider__line" />}
  </div>
);

export default Divider;
