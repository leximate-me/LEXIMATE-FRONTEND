import React, { useState } from 'react';
import { useClass } from '../context/ClassContext';
import notFound from '../assets/not-found.svg';
import CodeModal from './ui/CodeModal';

export default function ClassCardStudent({ classes }) {
  // Estado para controlar la visibilidad del modal
  // const [showModal, setShowModal] = useState(false);

  // // Estado para almacenar la clase seleccionada
  // const [selectedClass, setSelectedClass] = useState(null);

  // const { error } = useClass();

  // const handleOpenModal = (classItem) => {
  //   setSelectedClass(classItem); // Guardar la clase seleccionada
  //   setShowModal(true); // Abrir el modal
  // };

  return (
    <div className='h-[100%] flex justify-center'>
      {classes && classes.length === 0 ? (
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
          <div className="flex flex-wrap h-fit">
            {classes &&
              classes.map((classItem, index) => (
                <div
                  key={index}
                  className="bg-white shadow-[0px_9px_15px_-7px_rgba(0,0,0,0.75)] rounded border p-4 m-5  h-fit flex flex-col items-center gap-3 hover:scale-105 transition duration-500 cursor-pointer"
                >
                  <h2 className="text-xl font-semibold">{classItem.name}</h2>
                  <p className="text-gray-500">{classItem.description}</p>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
