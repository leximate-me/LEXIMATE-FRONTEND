import React, { useState } from 'react';
import { useClass } from '../context/ClassContext';
import notFound from '../assets/not-found.svg';
import CodeModal from './ui/CodeModal';

export default function ClassCardTeacher({ classes }) {
  // Estado para controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);
  
  // Estado para almacenar la clase seleccionada
  const [selectedClass, setSelectedClass] = useState(null);

  const { error } = useClass();

  const handleOpenModal = (classItem) => {
    setSelectedClass(classItem);  // Guardar la clase seleccionada
    setShowModal(true);  // Abrir el modal
  };

  return (
    <>
      {error || (classes && classes.length === 0) ? (
        <div className="w-80 h-52 flex flex-col justify-center items-center m-5 border border-gray-300 rounded-md shadow-[0px_9px_15px_-7px_rgba(0,0,0,0.75)]">
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
          <div className="flex flex-wrap justify-center items-center w-[90%] m-5">
            {classes &&
              classes.map((classItem, index) => (
                <div
                  key={index}
                  className="bg-white shadow-[0px_9px_15px_-7px_rgba(0,0,0,0.75)] rounded border p-4 m-5 w-[300px] flex flex-col items-center gap-3 hover:scale-105 transition duration-500"
                >
                  <h2 className="text-xl font-semibold">
                    {classItem.Class.name}
                  </h2>
                  <p className="text-gray-500">{classItem.Class.description}</p>
                  <button
                    onClick={() => handleOpenModal(classItem)}  // Llamar al abrir modal con la clase seleccionada
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
            selectedClass={selectedClass}  // Pasar la clase seleccionada al modal
          />
        </>
      )}
    </>
  );
}
