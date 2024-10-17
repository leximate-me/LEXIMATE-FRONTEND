import swal from 'sweetalert';

function CodeModal({ isOpen, onClose, selectedClass }) {
  const handleCopyCode = () => {
    if (selectedClass) {
      navigator.clipboard
        .writeText(selectedClass.class_code)
        .then(() => {
          // Mostrar la alerta personalizada
          swal({
            title: 'Código copiado al portapapeles',
            icon: 'success',
          }).then(() => {
            // Cerrar el modal después de que la alerta de swal desaparezca
            onClose();
          });
        })
        .catch((err) => {
          console.error('Error al copiar el código:', err);
        });
    }
  };

  // Si el modal no está abierto o no hay clase seleccionada, no se renderiza nada
  if (!isOpen || !selectedClass) return null;

  return (
    <>
      {/* Fondo oscuro */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose} // Cierra el modal cuando haces clic en el fondo oscuro
      ></div>

      {/* Contenedor del modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-[0px_7px_8px_-4px_rgba(0,0,0,0.53)] max-w-md w-full relative">
          <h2 className="text-xl mb-4">Código:</h2>
          <div className="flex justify-center items-center m-5">
            {/* Mostrar el código de la clase seleccionada */}
            <h1 className="text-xl">
              <b>{selectedClass.class_code}</b>
            </h1>
          </div>
          {/* Botones para cancelar o copiar */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose} // Botón para cerrar el modal sin enviar
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-700 transition duration-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleCopyCode} // Botón para copiar el código al portapapeles
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition duration-300"
            >
              Copiar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CodeModal;
