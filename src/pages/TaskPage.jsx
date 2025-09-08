import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTask } from '../context/TasksContext';
import Loading from '../components/ui/Loading';
import { useTool } from '../context/ToolContext';
import '../styles/fonts.css'; // Fuente OpenDyslexic
import HighlightLetter from '../components/ui/HighlightLetter';
import CardExtractedText from '../components/CardExtractedText';
import { FaBook } from "react-icons/fa6";
import NotFound from '../assets/not-found.svg';

function TaskPage({ tasks: initialTasks }) {
  const { classId, taskId } = useParams();
  const { getTask } = useTask();
  const [task, setTask] = useState(initialTasks);
  const [isLoading, setIsLoading] = useState(true);
  const { extractText, extractedText, isExtracting, setExtractedText } = useTool();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
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

  useEffect(() => {
    setExtractedText([]);
  }, [taskId, classId, setExtractedText]);

  return (
    <div className="container mx-auto p-6 ">
      {isLoading || isExtracting ? (
        <div className="h-[500px] flex justify-center items-center">
          {Loading(isLoading ? 'Cargando tarea...' : 'Extrayendo texto...')}
        </div>
      ) : (
        <>
          {task ? (
            <div className="grid grid-cols-8 grid-rows-[190px] gap-4">

              {/* Información (fila 1, col 1-4, menos alta) */}
              <div className="col-span-6 row-span-1 bg-white rounded-lg shadow-md flex flex-col">
                <div className='p-3 rounded-t-lg flex justify-between bg-gradient-to-r from-yellow-300 to-amber-400'>
                  <HighlightLetter size="text-2xl" className="font-opendyslexic mb-2">
                    {task.title}
                  </HighlightLetter>
                  <p className="self-center text-gray-600 dark:text-gray-400 font-opendyslexic text-md">
                    <b>Fecha de entrega:</b> {formatDate(task.due_date)}
                  </p>
                </div>
                <div className='m-5 flex bg-pastelVeryLightYellow rounded-lg p-2'>
                  <FaBook className="text-4xl text-black p-2" />
                  <HighlightLetter color='green' size="text-lg" className="font-opendyslexic mb-2">
                    {task.description}
                  </HighlightLetter>
                </div>
              </div>

              {/* Materiales (fila 1-2, col 5-6, más alta) */}
              {task.files && task.files.length > 0 && (
                <div className="h-fit col-start-7 col-span-2 row-span-2 bg-white rounded-lg shadow-md flex flex-col">
                  <div className='p-3 rounded-t-lg bg-gradient-to-r from-yellow-300 to-amber-400'>
                    <HighlightLetter size="text-xl" className="font-opendyslexic">
                      Materiales:
                    </HighlightLetter>
                  </div>
                  <div className="flex flex-col gap-3 p-3">
                    {task.files.map((file) => (
                      <div key={file._id} className="flex flex-col items-center gap-2">
                        <a
                          href={file.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          <img
                            src={file.file_url}
                            alt="Archivo adjunto"
                            className="h-[150px] md:h-[180px] object-cover rounded-lg shadow-lg hover:opacity-80 transition"
                          />
                        </a>
                        <button
                          onClick={() => handleExtractText(file.file_url)}
                          className="w-1/2 bg-gradient-to-r from-yellow-400 to-amber-500 font-semibold p-1 rounded-xl hover:from-yellow-500 hover:to-amber-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          <HighlightLetter color="green" className='font-opendyslexic' size='text-[14px]'>
                            Convertir Texto
                          </HighlightLetter>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Texto extraído (fila 3-6, col 1-6) */}
              {extractedText && extractedText.length > 0 && (
                <div className="col-span-6 row-start-2 row-span-4">
                  <CardExtractedText extractedText={extractedText} />
                </div>
              )}

            </div>
          ) : (
            <div className='flex flex-col justify-center items-center'>
              <div className='bg-pastelYellow p-10 rounded-lg shadow-md flex flex-col justify-center items-center'>
                <img src={NotFound} alt="Tarea no encontrada"   />
                <HighlightLetter color='red' size="text-lg" className="font-opendyslexic mt-4">
                  Tarea no encontrada
                </HighlightLetter>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TaskPage;
