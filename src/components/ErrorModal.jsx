export const ErrorModal = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-red-900 text-white p-4 rounded-lg shadow-lg max-w-lg w-full relative">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Error</h2>
          <button onClick={onClose} className="text-white text-2xl">
            &times;
          </button>
        </div>
        <div className="mt-4">
          {error.error.map((err, index) => (
            <div className="py-2" key={index}>
              <span className="font-bold text-red-500">ERROR : </span>
              <span className="text-slate-200">{err}</span>
            </div>
          ))}
        </div>
      </div>
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
    </div>
  );
};
