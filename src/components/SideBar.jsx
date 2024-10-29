import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useClass } from '../context/ClassContext';

export default function SideBar() {
    const { getClasses, classes } = useClass();
    const navigate = useNavigate();

    const handleChangeClass = (classId) => {
        console.log('Cambiando a la clase:', classId);
        navigate(`/${classId}/task`);
    };

    return (
        <div className='dark:bg-[#1a1a1a] border border-gray-400 shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-2 rounded-lg flex flex-col gap-4 bg-white'>
            {classes ? (
                <>
                    <h1 className='dark:text-white'><b>Clases:</b></h1>
                    {classes.map((clase) => (
                        <div
                            onClick={() => handleChangeClass(clase.id)}
                            key={clase.id}
                            className='dark:text-white transition duration-100 rounded-md hover:bg-gray-200 p-2 dark:hover:bg-gray-700 cursor-pointer'>
                                <h1>{clase.name}</h1>
                        </div>
                    ))}
                </>
            ) : (
                console.log('no hay clases')
            )}
        </div>
    );
}
