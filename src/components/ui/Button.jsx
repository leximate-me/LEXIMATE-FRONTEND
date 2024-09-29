export function Button({ onClick, className, children }) {
  return (
    <button
      onClick={onClick}
      className={`btn rounded-3xl border-none w-full bg-primary hover:bg-secondary  px-4 py-2 rounded-lg${className}`}
    >
      {children}
    </button>
  );
}
