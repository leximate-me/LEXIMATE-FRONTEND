import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTask } from '../context/TasksContext';
import Loading from '../components/ui/Loading';
import { useTool } from '../context/ToolContext';
import '../styles/fonts.css'; // Fuente OpenDyslexic
import HighlightLetter from '../components/ui/HighlightLetter';
import CardExtractedText from '../components/CardExtractedText';
import { FaBook, FaFilePdf, FaFileWord, FaFileImage, FaFileAlt } from "react-icons/fa";
import NotFound from '../assets/not-found.svg';
import QualifyTaskModal from '../components/ui/QualifyTaskModal';
import { useForm } from 'react-hook-form';

function TaskPage({ tasks: initialTasks }) {
  const { classId, taskId } = useParams();
  const { getTask, submitTask, getSubmittedTasks } = useTask();
  const [task, setTask] = useState(initialTasks);
  const [taskLoading, setTaskLoading] = useState(true);
  const [submittedTasks, setSubmittedTasks] = useState([]);
  const [submittedLoading, setSubmittedLoading] = useState(true);
  const [qualifyModalOpen, setQualifyModalOpen] = useState(false);

  const { extractText, extractedText, isExtracting, setExtractedText } = useTool();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2,'0')}/${String(date.getDate()).padStart(2,'0')}`;
  };

  const handleExtractText = async (url) => {
    try {
      await extractText(url);
    } catch (error) {
      console.error('Error al extraer el texto:', error);
    }
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return <FaFileAlt size={40} className="text-gray-600" />;
    if (fileType.includes('pdf')) return <FaFilePdf size={40} className="text-red-600" />;
    if (fileType.includes('word') || fileType.includes('msword') || fileType.includes('officedocument')) return <FaFileWord size={40} className="text-blue-600" />;
    if (fileType.includes('image')) return <FaFileImage size={40} className="text-green-600" />;
    return <FaFileAlt size={40} className="text-gray-600" />;
  };

  // Cargar tarea
  useEffect(() => {
    const loadTask = async () => {
      try {
        const fetchedTask = await getTask(classId, taskId);
        setTask(fetchedTask);
      } catch (error) {
        console.error('Error al cargar la tarea:', error);
      } finally {
        setTaskLoading(false);
      }
    };
    loadTask();
  }, [classId, taskId, getTask]);

  // Cargar tareas entregadas
  useEffect(() => {
    const loadSubmittedTasks = async () => {
      try {
        const fetchedSubmittedTasks = await getSubmittedTasks(classId, taskId);
        setSubmittedTasks(fetchedSubmittedTasks);
      } catch (error) {
        console.error('Error al cargar las tareas entregadas:', error);
      } finally {
        setSubmittedLoading(false);
      }
    };
    loadSubmittedTasks();
  }, [classId, taskId, getSubmittedTasks]);

  // Limpiar texto extraído al cambiar de tarea
  useEffect(() => {
    setExtractedText([]);
  }, [taskId, classId, setExtractedText]);

  const hanldeOnSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      formData.append('file', data.file[0]);
      await submitTask(classId, taskId, formData);

      // Refrescar la lista de entregas
      const refreshedSubmitted = await getSubmittedTasks(classId, taskId);
      setSubmittedTasks(refreshedSubmitted);
    } catch (error) {
      console.error('Error al enviar la tarea:', error);
    }
  });

  const isLoading = taskLoading || submittedLoading || isExtracting;

  return (
    <div className="container mx-auto p-6">
      {isLoading ? (
        <div className="h-[500px] flex justify-center items-center">
          {Loading(taskLoading ? 'Cargando tarea...' : 'Extrayendo texto...')}
        </div>
      ) : (
        <>
          {task ? (
            <div className="grid grid-cols-8 grid-rows-[190px] gap-4">

              {/* Información de la tarea */}
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

              {/* Materiales */}
              {task.files && task.files.length > 0 && (
                <div className="h-fit col-start-7 col-span-2 row-span-2 bg-white rounded-lg shadow-md flex flex-col">
                  <div className='p-3 rounded-t-lg bg-gradient-to-r from-yellow-300 to-amber-400'>
                    <HighlightLetter size="text-xl" className="font-opendyslexic">
                      Materiales:
                    </HighlightLetter>
                  </div>
                  <div className="flex flex-col gap-3 p-3">
                    {task.files.map((file) => (
                      <div key={file.id} className="flex flex-col items-center gap-2">
                        <a
                          href={`http://localhost:8080${file.file_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-1"
                        >
                          {getFileIcon(file.file_type)}
                          <p className="text-sm text-gray-700 truncate max-w-[150px] text-center">
                            {file.file_id}
                          </p>
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

              {/* Trabajo del usuario */}
              <div className='h-fit col-start-7 col-span-2 row-start-3 row-span-2 bg-white rounded-lg shadow-md flex flex-col'>
                <div className='p-3 rounded-t-lg bg-gradient-to-r from-yellow-300 to-amber-400'>
                  <HighlightLetter size="text-xl" className="font-opendyslexic">
                    Trabajo:
                  </HighlightLetter>
                </div>
                <div className="p-3">
                  {submittedTasks && submittedTasks.length > 0 ? (
                    // Mostrar archivo entregado
                    submittedTasks.map((sub) => (
                      <div key={sub.id} className="flex flex-col items-center gap-2">
                        <a
                          href={`http://localhost:8080${sub.files[0]?.file_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-1"
                        >
                          {getFileIcon(sub.files[0]?.file_type)}
                          <p className="text-sm text-gray-700 truncate max-w-[150px] text-center">
                            {sub.files[0]?.file_id}
                          </p>
                        </a>
                      </div>
                    ))
                  ) : (
                    // Input para subir archivo si no hay entrega
                    <form onSubmit={hanldeOnSubmit} className="flex flex-col items-center">
                      <div className="flex flex-col gap-3 w-full">
                        <input
                          type="file"
                          name="file"
                          className="w-full p-2 border border-gray-300 rounded mb-4"
                          {...register('file', { required: true })}
                        />
                        {errors.file && <span className="text-red-500">Este campo es requerido</span>}
                      </div>
                      <button type="submit" className="w-1/2 bg-blue-600 text-white rounded p-2 mt-3">
                        Subir archivo
                      </button>
                    </form>
                  )}
                </div>
              </div>

              <QualifyTaskModal
                open={qualifyModalOpen}
                onClose={() => setQualifyModalOpen(false)}
                onSubmit={({ rating, comment }) => {
                  console.log('Calificación enviada:', { rating, comment });
                }}
              />

              {/* Texto extraído */}
              {extractedText && extractedText.length > 0 && (
                <div className="col-span-6 row-start-2 row-span-4">
                  <CardExtractedText extractedText={extractedText} />
                </div>
              )}

            </div>
          ) : (
            <div className='flex flex-col justify-center items-center'>
              <div className='bg-pastelYellow p-10 rounded-lg shadow-md flex flex-col justify-center items-center'>
                <img src={NotFound} alt="Tarea no encontrada" />
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
