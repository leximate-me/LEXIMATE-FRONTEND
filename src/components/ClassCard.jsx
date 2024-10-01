import React from 'react'
import { useClass } from '../context/ClassContext';

export default function ClassCard({ classes }) {

    const { getClasses } = useClass();

    return (
        <div className='flex flex-wrap justify-center items-center w-[90%] m-5'>
            {classes && classes.map((classItem, index) => (
                <div key={index} className="bg-white shadow-[0px_9px_15px_-7px_rgba(0,0,0,0.75)] rounded border p-4 m-5 w-[300px] flex flex-col items-center gap-3 hover:scale-110 transition duration-300">
                    <h2 className="text-xl font-semibold">{classItem.Class.name}</h2>
                    <p className="text-gray-500">{classItem.Class.description}</p>
                    <button onClick={() => getClasses()} className="w-[100%] bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700 transition duration-200">Actualizar</button>
                </div>
            ))}
        </div>
    )
}
