export function Card({ children, className }) {
  return (
    <div
      className={`bg-white max-w-md mx-auto p-10 rounded-lg border border-gray-400 shadow-lg${className}`}
    >
      {children}
    </div>
  );
}
