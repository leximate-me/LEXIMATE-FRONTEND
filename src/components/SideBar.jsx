import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useClass } from '../context/ClassContext';
import HighlightLetter from './ui/HighlightLetter';
import { RiBook2Line } from "react-icons/ri";

export default function SideBar({ selectedClassId = '', onSelect = () => { }, onClose }) {
  const { classes } = useClass();
  const navigate = useNavigate();

  const handleChangeClass = (classId) => {
    // Navega y notifica al padre cuál quedó seleccionado, luego cierra el sidebar si corresponde
    navigate(`/${classId}/tasks`);
    onSelect(String(classId));
    if (typeof onClose === 'function') onClose();
  };

  if (!classes || classes.length === 0) {
    return (
      <div className="rounded-lg p-2">
        <p className="text-sm text-gray-500">No hay clases</p>
      </div>
    );
  }

  return (
    <div className="border-l-4 border-yellow-400 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-lg flex flex-col gap-2 bg-pastelVeryLightYellow h-fit">
      <div className='flex gap-2 align-middle bg-gradient-to-r from-yellow-300 to-amber-400 rounded-t-lg mb-2 pt-2 pl-2'>
        <RiBook2Line className="text-3xl opacity-50" />
        <HighlightLetter size="text-xl" className="font-opendyslexic mb-2 ">
          Mis Clases
        </HighlightLetter>
      </div>

      {classes.map((clase) => {
        const isActive = String(clase.id) === String(selectedClassId);

        return (
          <div
            key={clase.id}
            onClick={() => handleChangeClass(clase.id)}
            className={`mx-2 mb-2 transition duration-200 rounded-md p-2 cursor-pointer ${isActive
                ? 'bg-pastelYellow border-l-4 border-yellow-400 shadow-md font-bold'
                : 'hover:bg-pastelYellow'
              }`}
          >
            <HighlightLetter color="green" size="text-md" className="font-opendyslexic">
              {clase.name}
            </HighlightLetter>
          </div>
        );
      })}
    </div>
  );
}
