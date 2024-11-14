import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTask } from '../context/TasksContext';
import Loading from '../components/ui/Loading';
import { useTool } from '../context/ToolContext';

function TaskPage({ tasks: initialTasks }) {
    const { classId, taskId } = useParams();
    const { getTask } = useTask();
    const [task, setTask] = useState(initialTasks);
    const [isLoading, setIsLoading] = useState(true);
    const { extractText, extractedText, isExtracting } = useTool();

    // Función para formatear la fecha en AAAA/MM/DD
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    const handleExtractText = async (url) => {
        try {
            await extractText(url);
        } catch (error) {
            console.error('Error al extraer el texto:', error);
        }
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

    // Función para procesar el texto extraído
    const renderExtractedText = (extractedText) => {
        let titleWords = []; // Para acumular las palabras de tipo title
        let subtitleAndParagraph = []; // Para acumular todo el contenido (title, subtitle y paragraph)
        let output = []; // Array final para contener los bloques de texto

        extractedText.forEach((item, index) => {
            
            //haz que si se encuentran palabras que sean de tipo susbtitle o paragraph se acumulen en un array y se unan en un solo parrafo
            if(item.classification !== 'title'){
                subtitleAndParagraph.push(item.text);
            } else {
                if(subtitleAndParagraph.length > 0){
                    output.push(
                        <p key={`subtitleAndParagraph-${index}`} className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                            {subtitleAndParagraph.join(' ')}
                        </p>
                    );
                    subtitleAndParagraph = [];
                }
            }

            if (item.classification === 'title') {
                // Si encontramos una palabra de tipo 'title', la agregamos al array de 'title'
                titleWords.push(item.text); 
            } else {
                // Si encontramos una palabra que no es de tipo title (subtitle o paragraph)
                if (titleWords.length > 0) {
                    // Si hay palabras de tipo 'title' acumuladas, las imprimimos en un solo párrafo
                    output.push(
                        <p key={`title-${index}`} className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            {titleWords.join(' ')} {/* Unimos todas las palabras de tipo title */}
                        </p>
                    );
                    titleWords = []; // Reseteamos el array de palabras 'title' después de imprimirlas
                }
            }
        });

        // Si al final quedan palabras de tipo title, las mostramos
        if (titleWords.length > 0) {
            output.push(
                <p key="title-final" className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {titleWords.join(' ')} {/* Unimos las palabras de tipo title */}
                </p>
            );
        }

        if (subtitleAndParagraph.length > 0) {
            output.push(
                <p key="subtitleAndParagraph-final" className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                    {subtitleAndParagraph.join(' ')} {/* Unimos las palabras de tipo subtitle y paragraph */}
                </p>
            );
        }

        return output;
    };

    return (
        <div className="container mx-auto p-6">
            {isLoading || isExtracting ? (
                <div className="h-[500px] flex justify-center items-center">
                    {Loading(isLoading ? 'Cargando tarea...' : 'Extrayendo texto...')}
                </div>
            ) : (
                <>
                    {task ? (
                        <div className="space-y-6">
                            {/* Información de la Tarea */}
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 p-2 md:p-5 border dark:border-gray-500 rounded-lg shadow-md dark:shadow-[0px_2px_4px_0px_#4a5568]">
                                <div className="col-span-6 md:col-span-4 flex flex-col items-center md:items-start gap-4">
                                    <h1 className="text-2xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">{task.title}</h1>
                                    <p className="text-md md:text-3xl text-gray-700 dark:text-gray-300 mb-2">{task.description}</p>
                                    <p className="text-md md:text-2xl text-gray-600 dark:text-gray-400">
                                        <b>Fecha de entrega:</b> {formatDate(task.due_date)}
                                    </p>
                                </div>

                                {task.files && task.files.length > 0 && (
                                    <div className="col-span-6 md:col-span-2 flex justify-center items-center ">
                                        <ul>
                                            {task.files.map((file) => (
                                                <li key={file._id} className='flex flex-col md:flex-row items-end gap-2'>
                                                    <a href={file.file_url} target="_blank" rel="noopener noreferrer" download>
                                                        <img
                                                            src={file.file_url}
                                                            alt="Archivo adjunto"
                                                            className="border-2 border-gray-300 h-[200px] md:h-[300px] object-cover rounded-lg shadow-[0px_5px_20px_-8px_#4a5568] hover:opacity-75 transition"
                                                        />
                                                    </a>
                                                    <button
                                                        onClick={() => handleExtractText(file.file_url)}
                                                        className="h-fit mt-3 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                                                    >
                                                        Convertir Texto
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Mostrar el texto extraído en una tarjeta */}
                            {extractedText && extractedText.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border">
                                    <div className="text-lg font-sans leading-relaxed text-gray-700 dark:text-gray-300">
                                        {renderExtractedText(extractedText)}
                                    </div>
                                </div>
                            )}
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
