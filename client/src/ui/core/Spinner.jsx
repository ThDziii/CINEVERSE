/**
 * Spinner — loading indicator
 *
 * Props:
 *  size  : number (px)   default: 16
 *  color : string        default: "currentColor"
 */

const Spinner = ({ size = 16, color = "currentColor", className = "" }) => (
  <svg
    className={`spinner ${className}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
    />
  </svg>
);

export default Spinner;
