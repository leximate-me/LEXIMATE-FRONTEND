import React, { useState } from 'react';
import notFound from '../assets/not-found.svg';
import Dropdown from './ui/DropDownButton';
import bgClassCard from '../assets/bg-classCard.jpg';
import { useNavigate } from 'react-router-dom';
import { useClass } from '../context/ClassContext';
import HighlightLetter from './ui/HighlightLetter';

// Paleta de colores pastel
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
  const { leaveClass } = useClass();
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
    <div className="h-fit w-fit">
      {localClasses && localClasses.length === 0 ? (
        <div className="w-80 h-52 flex flex-col justify-center items-center m-5 border border-gray-300 rounded-md shadow-[0px_9px_15px_-7px_rgba(0,0,0,0.75)]">
          <img src={notFound} alt="No existen clases" className="w-24" />
          <h1 className="mt-4 font-bold">NO EXISTEN CLASES</h1>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center h-fit gap-5">
          {localClasses &&
            localClasses.map((classItem, index) => {
              const bgColor = pastelColors[index % pastelColors.length];

              return (
                <div
                  key={index}
                  onClick={() =>
                    navigate(`/${classItem.id}/tasks`, { state: { bgColor } })
                  }
                  className="card card-compact w-72 h-[280px] shadow-xl cursor-pointer hover:scale-105 transition-transform duration-200 flex flex-col"
                  style={{ backgroundColor: bgColor }}
                >
                  {/* Imagen superior */}
                  <figure className="relative h-36 cursor-pointer overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={bgClassCard}
                      alt="Fondo"
                    />
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

                  {/* Contenido */}
                  <div className="card-body flex flex-col justify-around tracking-very-wide font-opendyslexic overflow-hidden">
                    <HighlightLetter
                      color="blue"
                      size="text-lg"
                      className="font-opendyslexic font-bold truncate"
                    >
                      {classItem.name}
                    </HighlightLetter>

                    <HighlightLetter
                      color="green"
                      size="text-sm"
                      className="font-opendyslexic text-gray-800 line-clamp-3"
                    >
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
