export function Button({ className, children }) {
  return (
    <button className={`btn rounded-3xl border-none ${className}`}>
      {children}
    </button>
  );
}
