export function Card({ children, className }) {
  return (
    <div
      className={` mx-auto rounded-lg border border-gray-400  shadow-[-1px_15px_21px_-11px_rgba(0,0,0,0.83)] ${className}`}
    >
      {children}
    </div>
  );
}
