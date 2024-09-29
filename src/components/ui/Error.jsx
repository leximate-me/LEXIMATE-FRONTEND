export function Error({ children }) {
  return (
    <div className="bg-red-100 text-red-900 border border-red-400 rounded-lg p-4">
      {children}
    </div>
  );
}
