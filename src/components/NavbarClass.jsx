import React from 'react';
import { useLocation } from "react-router-dom";
import HighlightLetter from './ui/HighlightLetter';
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { HiOutlineUsers } from "react-icons/hi2";

function NavbarClass({ onSelect, selectedView }) {
  const location = useLocation();
  const bgColor = location.state?.bgColor || "#fef195"; // fallback por si no llega nada

  return (
    <div className='row-start-2 col-start-3 col-span-7'>
      <ul
        className='grid grid-cols-3 grid-rows-1 rounded-md shadow-md bg-pastelYellow'
      >
        <li
          className={`flex justify-center items-center gap-2 p-[1px] text-center col-start-1 cursor-pointer ${selectedView === 'tasks' ? `border-2 border-yellow-400 rounded-lg shadow-[0px_0px_10px_1px_rgba(234,_179,_8,_0.5)]` : ''}`}
          onClick={() => onSelect('tasks')}
        >
          <HiOutlineClipboardDocumentList className="text-xl h-full" />
          <HighlightLetter size="text-lg" className="font-opendyslexic flex justify-center items-center gap-2">
            Tareas
          </HighlightLetter>
        </li>
        <li
          className={`flex justify-center items-start gap-2 p-[1px] text-center col-start-2 cursor-pointer ${selectedView === 'announcements' ? `border-2 border-yellow-400 rounded-lg shadow-[0px_0px_10px_1px_rgba(234,_179,_8,_0.5)]` : ''}`}
          onClick={() => onSelect('announcements')}
        >
          <HiOutlineBellAlert className="text-xl h-full" />
          <HighlightLetter size="text-lg" className="font-opendyslexic">
            Anuncios
          </HighlightLetter>
        </li>
        <li
          className={`flex justify-center items-start gap-2 p-[1px] text-center col-start-3 cursor-pointer ${selectedView === 'people' ? `border-2 border-yellow-400 rounded-lg shadow-[0px_0px_10px_1px_rgba(234,_179,_8,_0.5)]` : ''}`}
          onClick={() => onSelect('people')}
        >
          <HiOutlineUsers className="text-xl h-full" />
          <HighlightLetter size="text-lg" className="font-opendyslexic">
            Personas
          </HighlightLetter>
        </li>
      </ul>
    </div>
  );
}

export default NavbarClass;
