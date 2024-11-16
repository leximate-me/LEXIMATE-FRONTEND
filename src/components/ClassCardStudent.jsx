import React, { useState } from 'react';
import notFound from '../assets/not-found.svg';
import Dropdown from './ui/DropDownButton';
import bgClassCard from '../assets/bg-classCard.jpg';
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate(); // Hook para navegación

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

  const handleAbandonClass = async (classId) => {
    setIsDeleting(true); // Mostrar loading al iniciar la eliminación
    try {
      console.log('Clase abandonada:', classId);
      await deleteClass(classId);

      // Filtrar la clase eliminada del estado
      setClasses((prevClasses) => prevClasses.filter((c) => c.id !== classId));
    } catch (error) {
      console.log('Error al abandonar la clase:', error);
    } finally {
      setIsDeleting(false); // Ocultar loading cuando termine
    }
  };

  return (
    <div className="h-[100%] flex justify-center">
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
          <div className="flex flex-wrap h-fit gap-5">
            {classes &&
              classes.map((classItem, index) => (
                <div
                  key={index}
                  onClick={() =>
                    navigate(`/${classItem.id}/tasks`)
                  } /* Redirigir al hacer clic en la carta */
                  className="card card-compact bg-base-100 w-80 shadow-xl h-fit cursor-pointer"
                >
                  <figure className="relative h-48 cursor-pointer">
                    <img className="h-80" src={bgClassCard} alt="Shoes" />
                    <div
                      className="absolute top-2 right-2"
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevenir que el clic en el botón redirija
                      }}
                    >
                      <Dropdown
                        classId={classItem.id}
                        onAbandonClass={handleAbandonClass}
                      />
                    </div>
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">{classItem.name}</h2>
                    <p className="text-gray-500">{classItem.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
