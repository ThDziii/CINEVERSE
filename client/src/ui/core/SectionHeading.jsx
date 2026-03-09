/**
 * SectionHeading — tiêu đề section có thanh đỏ bên trái
 *
 * Props:
 *  title     : string
 *  rightSlot : ReactNode  (ví dụ: nút "Xem tất cả", bộ đếm kết quả)
 */

const SectionHeading = ({ title, rightSlot, className = "" }) => (
  <div className={`section-heading${className ? ` ${className}` : ""}`}>
    <div className="section-heading__title-group">
      <span className="section-heading__accent" aria-hidden="true" />
      <h2 className="section-heading__title">{title}</h2>
    </div>
    {rightSlot && (
      <div className="section-heading__right">{rightSlot}</div>
    )}
  </div>
);

export default SectionHeading;
