export function Card({ children, className }) {
  return (
    <div
      className={`bg-white max-w-md mx-auto p-10 rounded-lg border border-gray-400  shadow-[-1px_15px_21px_-11px_rgba(0,0,0,0.83)] ${className}`}
    >
      {children}
    </div>
  );
}
