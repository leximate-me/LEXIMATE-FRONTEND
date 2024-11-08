import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTask } from '../context/TasksContext';
import Loading from '../components/ui/Loading';

function TaskPage({ tasks: initialTasks }) {
    const { classId, taskId } = useParams();
    const { getTask } = useTask();
    const [task, setTask] = useState(initialTasks);
    const [isLoading, setIsLoading] = useState(true);

    // Función para formatear la fecha en AAAA/MM/DD
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes comienza en 0, se ajusta sumando 1
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    useEffect(() => {
        const loadTask = async () => {
            try {
                const fetchedTask = await getTask(classId, taskId);
                setTask(fetchedTask);
            } catch (error) {
                console.error('Error al cargar la tarea:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadTask();
    }, [classId, taskId, getTask]);

    return (
        <div className="container mx-auto p-6">
            {isLoading ? (
                <div className="h-[500px] flex justify-center items-center">
                    {Loading('Cargando tarea...')}
                </div>
            ) : (
                <>
                    {task ? (
                        <div className="space-y-6">
                            {/* Información de la Tarea */}
                            <div className="grid grid-cols-6 grid-rows-2 p-2 md:p-5 border dark:border-gray-500 rounded-lg shadow-md dark:shadow-[0px_2px_4px_0px_#4a5568]">
                                <div className="col-span-6 col-start-1 row-start-1 md:row-span-2 md:col-span-4 flex flex-col items-center md:gap-10 mb-2 md:items-start">
                                    <h1 className="text-2xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">{task.title}</h1>
                                    <p className="text-md md:text-3xl text-gray-700 dark:text-gray-300 mb-2">{task.description}</p>
                                    <p className="text-md md:text-2xl text-gray-600 dark:text-gray-400">
                                        <b>Fecha de entrega:</b> {formatDate(task.due_date)}
                                    </p>
                                </div>

                                {task.files && task.files.length > 0 && (
                                    <div className="col-span-2 col-start-3 row-start-2 md:col-start-5 md:row-span-2 flex justify-center items-center">
                                        <ul>
                                            {task.files.map((file) => (
                                                <li key={file._id}>
                                                    <a href={file.file_url} target="_blank" rel="noopener noreferrer" download>
                                                        <img
                                                            src={file.file_url}
                                                            alt="Archivo adjunto"
                                                            className="h-[100px] md:h-[300px] object-cover rounded-lg shadow-md hover:opacity-75 transition"
                                                        />
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center">Tarea no encontrada</p>
                    )}
                </>
            )}
        </div>
    );
}

export default TaskPage;
