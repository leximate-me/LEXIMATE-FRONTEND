import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTask } from '../context/TasksContext';
import Loading from '../components/ui/Loading';

function TaskPage({ tasks: initialTasks }) {
    const { classId, taskId } = useParams(); // Obtener classId y taskId desde la URL
    const { getTask } = useTask();
    const [task, setTask] = useState(initialTasks);
    const [isLoading, setIsLoading] = useState(true);
    const [comments, setComments] = useState([]); // Estado para los comentarios
    const [newComment, setNewComment] = useState(''); // Estado para el comentario nuevo

    useEffect(() => {
        const loadTask = async () => {
            try {
                const fetchedTask = await getTask(classId, taskId);
                setTask(fetchedTask);
                // Aquí puedes cargar comentarios de la base de datos si los tienes
                setComments(fetchedTask.comments || []);
            } catch (error) {
                console.error('Error al cargar la tarea:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadTask();
    }, [classId, taskId, getTask]);

    const handleAddComment = () => {
        if (newComment.trim()) {
            const updatedComments = [...comments, newComment];
            setComments(updatedComments);
            setNewComment('');
            // Aquí puedes agregar la lógica para enviar el comentario al servidor
        }
    };

    return (
        <div className="container mx-auto p-6">
            {isLoading ? (
                <div className="h-[500px] flex justify-center items-center">
                    {Loading('Cargando tarea...')}
                </div>
            ) : (
                <>
                    {task ? (
                        <div className="space-y-6 ">
                            {/* Información de la Tarea */}
                            <div className="grid grid-cols-6 grid-rows-2 p-5 border dark:border-gray-500 rounded-lg shadow-md dark:shadow-[0px_2px_4px_0px_#4a5568]">
                                
                                <div className='row-start-1 md:row-span-2 w-fit flex flex-col md:gap-10'>
                                    <h1 className="text-2xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">{task.title}</h1>
                                    <p className="text-md md:text-3xl text-gray-700 dark:text-gray-300 mb-2">{task.description}</p>
                                    <p className="text-md md:text-2xl text-gray-600 dark:text-gray-400">
                                        <b>Fecha de entrega:</b> {task.due_date}
                                    </p>
                                </div>

                                {task.files && task.files.length > 0 && (
                                    <div className="col-span-2 col-start-3 row-start-2 md:col-start-5 md:row-span-2 flex justify-center items-center">
                                        <ul className="">
                                            {task.files.map((file) => (
                                                <li key={file._id}>
                                                    <img
                                                        src={file.file_url}
                                                        alt="Archivo adjunto"
                                                        className="h-[100px] md:h-[300px] object-cover rounded-lg shadow-md"
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Caja de Comentarios */}
                            <div className="border dark:border-gray-500 p-6 rounded-lg shadow-md dark:shadow-[0px_2px_4px_0px_#4a5568]">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Comentarios</h2>

                                {/* Lista de Comentarios */}
                                <div className="space-y-4 mb-6">
                                    {comments.length > 0 ? (
                                        comments.map((comment, index) => (
                                            <div key={index} className="bg-gray-100 dark:bg-gray-600 p-4 rounded-md shadow-sm">
                                                <p className="text-gray-700 dark:text-gray-200">{comment}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400">No hay comentarios aún.</p>
                                    )}
                                </div>

                                {/* Formulario de Comentario */}
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="text"
                                        placeholder="Escribe un comentario..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <button
                                        onClick={handleAddComment}
                                        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                                    >
                                        Comentar
                                    </button>
                                </div>
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
