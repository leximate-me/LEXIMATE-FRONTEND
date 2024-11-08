import React from 'react';

function NavbarClass({ onSelect, selectedView }) {
  return (
    <div className='border-b-2 border-gray-300 rounded-lg col-span-8 md:col-span-6 md:col-start-3 md:row-start-1'>
      <ul className='flex gap-5 h-full items-center justify-center md:justify-start p-2'>
        <li
          className={`w-fit px-2 cursor-pointer ${selectedView === 'tasks' ? 'border-b-2 border-blue-500 rounded-lg' : ''}`}
          onClick={() => onSelect('tasks')}
        >
          <h1 className='font-semibold'>Tareas</h1>
        </li>
        <li
          className={`w-fit px-2 cursor-pointer ${selectedView === 'announcements' ? 'border-b-2 border-blue-500 rounded-lg' : ''}`}
          onClick={() => onSelect('announcements')}
        >
          <h1 className='font-semibold'>Anuncios</h1>
        </li>
        <li
          className={`w-fit px-2 cursor-pointer ${selectedView === 'people' ? 'border-b-2 border-blue-500 rounded-lg' : ''}`}
          onClick={() => onSelect('people')}
        >
          <h1 className='font-semibold'>Personas</h1>
        </li>
      </ul>
    </div>
  );
}

export default NavbarClass;
