import React, { useState } from "react";
import { useClass } from "../context/ClassContext";
import notFound from "../assets/not-found.svg";
import CodeModal from "./ui/CodeModal";
import Dropdown from "./ui/DropDownButton";
import bgClassCard from "../assets/bg-classCard.jpg";
import { useNavigate } from "react-router-dom";
import HighlightLetter from "./ui/HighlightLetter";

// Paleta de colores pastel (igual que la del estudiante)
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

export default function ClassCardTeacher({ classes: initialClasses }) {
  const navigate = useNavigate();
  const { deleteClass } = useClass();
  const [isDeleting, setIsDeleting] = useState(false);
  const [localClasses, setLocalClasses] = useState(initialClasses);
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  // Manejar eliminación de clase
  const handleAbandonClass = async (classId) => {
    setIsDeleting(true);
    try {
      await deleteClass(classId);
      setLocalClasses((prevClasses) =>
        prevClasses.filter((c) => c.id !== classId)
      );
    } catch (error) {
      console.log("Error al eliminar la clase:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Abrir modal de código
  const handleOpenModal = (classItem, e) => {
    e.stopPropagation();
    setSelectedClass(classItem);
    setShowModal(true);
  };

  return (
    <div className="h-fit w-fit">
      {isDeleting ? (
        <div className="w-80 h-52 flex justify-center items-center border border-gray-300 rounded-md shadow-lg">
          <h1 className="font-bold text-gray-600">Eliminando clase...</h1>
        </div>
      ) : localClasses && localClasses.length === 0 ? (
        <div className="w-80 h-52 flex flex-col justify-center items-center m-5 border rounded-md shadow-[0px_9px_15px_-7px_rgba(0,0,0,0.75)] bg-white">
          <img src={notFound} alt="No existen clases" className="w-24" />
          <h1 className="mt-4 font-bold font-opendyslexic tracking-more-wide">NO EXISTEN CLASES</h1>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center h-fit gap-5">
          {localClasses.map((classItem, index) => {
            const bgColor = pastelColors[index % pastelColors.length];

            return (
              <div
                key={index}
                onClick={() => navigate(`/${classItem.id}/tasks`, { state: { bgColor } })}
                className="card card-compact w-72 h-[320px] shadow-xl cursor-pointer hover:scale-105 transition-transform duration-200 flex flex-col"
                style={{ backgroundColor: bgColor }}
              >
                {/* Imagen superior */}
                <figure className="relative h-36 cursor-pointer">
                  <img
                    className="w-full h-full object-cover rounded-t-2xl"
                    src={bgClassCard}
                    alt="Fondo"
                  />
                  <div
                      className="absolute top-2 right-2 z-20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Dropdown
                        classId={classItem.id}
                        onAbandonClass={handleAbandonClass}
                        msg="Eliminar clase"
                      />
                    </div>
                </figure>

                {/* Contenido */}
                <div className="card-body flex flex-col justify-around font-opendyslexic tracking-very-wide">
                  <HighlightLetter
                    color="blue"
                    size="text-lg"
                    className="font-bold truncate"
                  >
                    {classItem.name}
                  </HighlightLetter>

                  <HighlightLetter
                    color="green"
                    size="text-sm"
                    className="text-gray-800 line-clamp-3"
                  >
                    {classItem.description}
                  </HighlightLetter>
                </div>

                {/* Botón para ver código */}
                <div className="card-actions justify-center mb-3">
                  <button
                    onClick={(e) => handleOpenModal(classItem, e)}
                    className="w-4/5 bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition duration-200 font-opendyslexic"
                  >
                    Ver código de clase
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de código */}
      <CodeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        selectedClass={selectedClass}
      />
    </div>
  );
}
