import { useEffect, useRef } from 'react';

export const ErrorModal = ({ error, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (error && modalRef.current) {
      modalRef.current.showModal();
    }
  }, [error]);

  if (!error) return null;

  return (
    <dialog ref={modalRef} className="modal sm:modal-middle">
      <div className="modal-box bg-slate-200">
        <h3 className="font-bold text-lg text-red-600">ERROR!</h3>
        {error.error.map((err, index) => (
          <p className="py-4" key={index}>{err}</p>
        ))}
        <div className="modal-action">
          <button
            className="btn bg-red-600 text-white hover:bg-red-700 transition-all duration-200"
            onClick={() => {
              modalRef.current.close();
              onClose();
            }}
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};