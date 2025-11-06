import { createPortal } from "react-dom";
import swal from 'sweetalert';

function CodeModal({ isOpen, onClose, selectedClass }) {
  if (!isOpen || !selectedClass) return null;

  const modalContent = (
    <>
      {/* Fondo oscuro */}
      <div
        className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Contenedor del modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-[0px_7px_8px_-4px_rgba(0,0,0,0.53)] max-w-md w-full relative">
          <h2 className="text-xl mb-4">Código:</h2>
          <div className="flex justify-center items-center m-5">
            <h1 className="text-xl font-bold">{selectedClass.class_code}</h1>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-700 transition duration-300"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(selectedClass.class_code)
                swal({ title: 'Código copiado al portapapeles', icon: 'success' })
                  .then(() => onClose());
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition duration-300"
            >
              Copiar
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // 🔥 Usa portal: se monta directamente en <body>, no dentro de tu layout
  return createPortal(modalContent, document.body);
}

export default CodeModal;
