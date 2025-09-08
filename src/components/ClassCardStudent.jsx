import React, { useState } from 'react';
import notFound from '../assets/not-found.svg';
import Dropdown from './ui/DropDownButton';
import bgClassCard from '../assets/bg-classCard.jpg';
import { useNavigate } from 'react-router-dom';
import { useClass } from '../context/ClassContext';
import HighlightLetter from './ui/HighlightLetter';

// Paleta de colores pastel que combinan con amarillo pastel
const pastelColors = [
  "#fef195", // amarillo pastel
  "#FFB6B9", // rosa pastel
  "#A0E7E5", // celeste pastel
  "#B5EAD7", // verde menta pastel
  "#C7CEEA", // lavanda pastel
  "#F9D5E5", // rosa claro
  "#E2F0CB", // verde pastel
  "#FFF5BA", // amarillo muy claro
];

export default function ClassCardStudent({ classes: initialClasses }) {
  const navigate = useNavigate();
  const { leaveClass, setClasses } = useClass();
  const [isDeleting, setIsDeleting] = useState(false);
  const [localClasses, setLocalClasses] = useState(initialClasses);

  const handleAbandonClass = async (classId) => {
    setIsDeleting(true);
    try {
      await leaveClass(classId);
      setLocalClasses((prevClasses) =>
        prevClasses.filter((c) => c.id !== classId)
      );
    } catch (error) {
      console.log("Error al abandonar la clase:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="h-full flex justify-center">
      {localClasses && localClasses.length === 0 ? (
        <div className="w-80 h-52 flex flex-col justify-center items-center m-5 border border-gray-300 rounded-md shadow-[0px_9px_15px_-7px_rgba(0,0,0,0.75)]">
          <img src={notFound} alt="No existen clases" className="w-24" />
          <h1 className="mt-4 font-bold">NO EXISTEN CLASES</h1>
        </div>
      ) : (
        <div className="flex flex-wrap h-fit gap-5">
          {localClasses &&
            localClasses.map((classItem, index) => {
              // Elegir un color de la paleta
              const bgColor =
                pastelColors[index % pastelColors.length]; // para que sea cíclico

              return (
                <div
                  key={index}
                  onClick={() => navigate(`/${classItem.id}/tasks`)}
                  className="card card-compact w-80 shadow-xl h-fit cursor-pointer hover:scale-105 transition-transform duration-200"
                  style={{ backgroundColor: bgColor }} // <-- color pastel aplicado
                >
                  <figure className="relative h-48 cursor-pointer">
                    <img className="h-80" src={bgClassCard} alt="Fondo" />
                    <div
                      className="absolute top-2 right-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Dropdown
                        classId={classItem.id}
                        onAbandonClass={handleAbandonClass}
                        msg="Abandonar clase"
                      />
                    </div>
                  </figure>
                  <div className="card-body tracking-very-wide font-opendyslexic">
                    <HighlightLetter color="blue" size="text-xl" className="font-opendyslexic font-bold">
                      {classItem.name}
                    </HighlightLetter>
                    <HighlightLetter color="green" size="text-lg" className="font-opendyslexic text-gray-800">
                      {classItem.description}
                    </HighlightLetter>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
