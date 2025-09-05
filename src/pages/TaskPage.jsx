import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTask } from '../context/TasksContext';
import Loading from '../components/ui/Loading';
import { useTool } from '../context/ToolContext';
import '../styles/fonts.css'; // Fuente OpenDyslexic
import HighlightLetter from '../components/ui/HighlightLetter';
import CardExtractedText from '../components/CardExtractedText';

function TaskPage({ tasks: initialTasks }) {
  const { classId, taskId } = useParams();
  const { getTask } = useTask();
  const [task, setTask] = useState(initialTasks);
  const [isLoading, setIsLoading] = useState(true);
  const { extractText, extractedText, isExtracting, setExtractedText } = useTool();

  // Formatea la fecha en AAAA/MM/DD
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

  // Limpiar el texto extraído al cambiar de tarea
  useEffect(() => {
    setExtractedText([]);
  }, [taskId, classId, setExtractedText]);

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
              <div className="dark:border-[#fffd92] grid grid-cols-1 md:grid-cols-6 gap-6 p-2 md:p-5 border rounded-lg shadow-md bg-pastelYellow">
                <div className="col-span-6 md:col-span-4 flex flex-col items-center md:items-start gap-4">
                  <HighlightLetter size="text-3xl" className="font-opendyslexic">
                    {task.title}
                  </HighlightLetter>
                  <HighlightLetter size="text-xl" className="font-opendyslexic">
                    {task.description}
                  </HighlightLetter>
                  <p className="text-md md:text-2xl text-gray-600 dark:text-gray-400 font-opendyslexic">
                    <b>Fecha de entrega:</b> {formatDate(task.due_date)}
                  </p>
                </div>

                {task.files && task.files.length > 0 && (
                  <div className="col-span-6 md:col-span-2 flex justify-center items-center">
                    <ul>
                      {task.files.map((file) => (
                        <li
                          key={file._id}
                          className="flex flex-col md:flex-row items-end gap-2"
                        >
                          <a
                            href={file.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
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

              {/* Mostrar el texto extraído en una tarjeta con scroll */}
              {extractedText && extractedText.length > 0 && (
                <CardExtractedText extractedText={extractedText} />
              )}
            </div>
          ) : (
            <p
              className="text-gray-500 dark:text-gray-400 text-center"
              style={{ fontFamily: 'OpenDyslexic' }}
            >
              Tarea no encontrada
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default TaskPage;
