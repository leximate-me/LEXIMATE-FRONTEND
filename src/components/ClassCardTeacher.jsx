import React, { useState } from 'react';
import { useClass } from '../context/ClassContext';
import notFound from '../assets/not-found.svg';
import CodeModal from './ui/CodeModal';
import Dropdown from './ui/DropDownButton';
import Loading from './ui/Loading';

export default function ClassCardTeacher({ classes: initialClasses }) {
  // Estado para controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);

  // Estado para almacenar la clase seleccionada
  const [selectedClass, setSelectedClass] = useState(null);

  // Estado de loading para la acción de eliminar clase
  const [isDeleting, setIsDeleting] = useState(false);

  // Estado local para manejar las clases
  const [classes, setClasses] = useState(initialClasses);

  const { deleteClass } = useClass();

  const handleAbandonClass = async (classCode) => {
    setIsDeleting(true); // Mostrar loading al iniciar la eliminación
    try {
      console.log("Clase abandonada:", classCode);
      await deleteClass(classCode);

      // Filtrar la clase eliminada del estado
      setClasses((prevClasses) => prevClasses.filter((c) => c.class_code !== classCode));

    } catch (error) {
      console.log("Error al abandonar la clase:", error);
    } finally {
      setIsDeleting(false); // Ocultar loading cuando termine
    }
  };

  const handleOpenModal = (classItem) => {
    setSelectedClass(classItem); // Guardar la clase seleccionada
    setShowModal(true); // Abrir el modal
  };

  return (
    <div className='h-[100%] flex justify-center'>
      {isDeleting ? (
        <div className="flex justify-center h-[100%]">
          {Loading('Eliminando clase...')}
        </div>
      ) : (
        <>
          {classes.length === 0 ? (
            <div className="w-80 h-52 flex flex-col justify-center items-center border border-gray-300 rounded-md shadow-[0px_9px_15px_-7px_rgba(0,0,0,0.75)]">
              <div className="flex flex-wrap justify-center items-center w-[90%] h-[90%] m-5">
                <img src={notFound} alt="No existen clases" />
              </div>
              <div className="flex flex-wrap justify-center items-center w-[90%] h-[90%] m-5">
                <h1>
                  <b>NO EXISTEN CLASES</b>
                </h1>
              </div>
            </div>
          ) : (

            <>
              <div className="flex flex-wrap h-fit">
                {classes &&
                  classes.map((classItem, index) => (
                    <div
                      key={index}
                      onClick={() => window.location.href = `/${classItem.class_code}/tasks`}  /* Redirigir al hacer clic en la carta */
                      className="bg-white shadow-[0px_9px_15px_-7px_rgba(0,0,0,0.75)] rounded border p-4 m-5  h-fit flex flex-col items-center gap-3 hover:scale-105 transition duration-500 cursor-pointer"
                    >
                      <div className="grid grid-cols-6">
                        <h2 className="col-start-1 col-end-7 row-start-1 text-xl font-semibold text-center">
                          {classItem.name}
                        </h2>

                        <div
                          className="col-start-6 row-start-1"
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();  // Prevenir que el clic en el botón redirija
                          }}>
                          <Dropdown code={classItem.class_code} onAbandonClass={handleAbandonClass} />
                        </div>
                      </div>

                      <p className="text-gray-500">{classItem.description}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();  // Prevenir que el clic en el botón redirija
                          handleOpenModal(classItem);  // Llamar al abrir modal con la clase seleccionada
                        }}
                        className="w-[100%] bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700 transition duration-200"
                      >
                        Ver código de clase
                      </button>
                    </div>
                  ))}
              </div>

              {/* Modal para mostrar el código de la clase seleccionada */}
              <CodeModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                selectedClass={selectedClass} // Pasar la clase seleccionada al modal
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
