import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTask } from '../context/TasksContext';
import { useClass } from '../context/ClassContext';
import Loading from '../components/ui/Loading';
import { useAuth } from '../context/AuthContext';
import { useTool } from '../context/ToolContext';
import '../styles/fonts.css'; // Fuente OpenDyslexic
import HighlightLetter from '../components/ui/HighlightLetter';
import CardExtractedText from '../components/CardExtractedText';
import { FaBook, FaFilePdf, FaFileWord, FaFileImage, FaFileAlt } from "react-icons/fa";
import NotFound from '../assets/not-found.svg';
import { useForm } from 'react-hook-form';
import QualifyTaskModal from '../components/ui/QualifyTaskModal';

function TaskPage({ tasks: initialTasks }) {
  const { classId, taskId } = useParams();
  const { user } = useAuth();
  const { getTask, submitTask, getSubmittedTasks, qualifyTask } = useTask();
  const { getUsersByClass } = useClass();
  const [task, setTask] = useState(initialTasks);
  const [taskLoading, setTaskLoading] = useState(true);
  const [submittedTasks, setSubmittedTasks] = useState([]);
  const [submittedLoading, setSubmittedLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const { extractText, extractedText, isExtracting, setExtractedText } = useTool();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [qualifyModalOpen, setQualifyModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [mySubmission, setMySubmission] = useState(null);

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

  // Cargar entregas y estudiantes, calcular pendientes
  useEffect(() => {
    const loadSubmittedAndStudents = async () => {
      if (!task) return;

      try {
        const users = await getUsersByClass(classId);
        const studentsOnly = users.filter(u => u.role.name === 'student');
        setStudents(studentsOnly);

        const submitted = await getSubmittedTasks(classId, taskId);
        setSubmittedTasks(submitted);

        const pending = studentsOnly.filter(s =>
          !submitted.some(sub => sub.user.id === s.id)
        ).length;
        setPendingCount(pending);
      } catch (error) {
        console.error('Error al cargar pendientes:', error);
      } finally {
        setSubmittedLoading(false);
      }
    };

    loadSubmittedAndStudents();
  }, [task, classId, taskId, getUsersByClass, getSubmittedTasks]);

  useEffect(() => {
    const loadSubmittedAndStudents = async () => {
      if (!task) return;

      try {
        const users = await getUsersByClass(classId);
        const studentsOnly = users.filter(u => u.role.name === 'student');
        setStudents(studentsOnly);

        const submitted = await getSubmittedTasks(classId, taskId);
        setSubmittedTasks(submitted);

        // Para el alumno
        const mySub = submitted.find(sub => sub.user.id === user.id);
        setMySubmission(mySub);

        const pending = studentsOnly.filter(s =>
          !submitted.some(sub => sub.user.id === s.id)
        ).length;
        setPendingCount(pending);
      } catch (error) {
        console.error('Error al cargar pendientes:', error);
      } finally {
        setSubmittedLoading(false);
      }
    };

    loadSubmittedAndStudents();
  }, [task, classId, taskId, getUsersByClass, getSubmittedTasks, user.id]);


  // Limpiar texto extraído al cambiar de tarea
  useEffect(() => {
    setExtractedText([]);
  }, [taskId, classId, setExtractedText]);

  const handleOnSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      formData.append('file', data.file[0]);
      await submitTask(classId, taskId, formData);

      // Refrescar entregas
      const refreshedSubmitted = await getSubmittedTasks(classId, taskId);
      setSubmittedTasks(refreshedSubmitted);

      // Actualizar pendientes
      const pending = students.filter(s =>
        !refreshedSubmitted.some(sub => sub.user.id === s.id)
      ).length;
      setPendingCount(pending);

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
            <div className="grid grid-cols-8 grid-rows-[190px_auto] gap-4">

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

              {user?.rol === 'student' ? (
                <>
                  {/* VISTA ESTUDIANTE */}
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

                  <div className='h-fit col-start-7 col-span-2 row-start-3 row-span-2 bg-white rounded-lg shadow-md flex flex-col'>
                    <div className='p-3 rounded-t-lg bg-gradient-to-r from-yellow-300 to-amber-400'>
                      <HighlightLetter size="text-xl" className="font-opendyslexic">
                        Entrega:
                      </HighlightLetter>
                    </div>
                    <div className="p-3">
                      {submittedTasks && submittedTasks.length > 0 ? (
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
                        <form onSubmit={handleOnSubmit} className="flex flex-col items-center">
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

                    {/* AQUI agregamos la nota y comentario */}
                    {mySubmission && mySubmission.qualification !== null && (
                      <div className="m-2 bg-pastelYellow p-4 rounded-lg shadow-md">
                        <div className='flex justify-between border-b border-gray-400 rounded'>
                          <HighlightLetter color='red' size='text-lg' className="font-opendyslexic font-semibold">
                            Nota:
                          </HighlightLetter>
                          <p className="text-xl font-bold">
                            {mySubmission.qualification} / 10
                          </p>
                        </div>
                        {mySubmission.comment && (
                          <div className="mt-2 flex justify-start">
                            <div className="bg-white p-3 w-full rounded-r-lg rounded-bl-lg shadow-md max-w-xs break-words">
                              <HighlightLetter size='text-lg' className="font-opendyslexic text-gray-800">
                                {mySubmission.comment}
                              </HighlightLetter>
                              <HighlightLetter size='text-xs' color='green' className="font-opendyslexic text-gray-500 block mt-1">Profesor</HighlightLetter>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Texto extraído */}
                  {extractedText && extractedText.length > 0 && (
                    <div className="col-span-6 row-start-2 row-span-4">
                      <CardExtractedText extractedText={extractedText} />
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* VISTA PROFESOR */}
                  <div className=' col-start-7 col-span-2 row-span-1 flex flex-col gap-2'>
                    <div className='bg-white rounded-t-lg h-1/2 shadow-md'>
                      <div className="p-3 rounded-t-lg bg-gradient-to-r from-yellow-300 to-amber-400 w-full h-fit">
                        <HighlightLetter size="text-md" className="font-opendyslexic">
                          Entregas pendientes:
                        </HighlightLetter>
                      </div>
                      <p className="font-semibold m-2 text-center">
                        {pendingCount} / {students.length}
                      </p>
                    </div>

                    <div className='bg-white rounded-t-lg h-1/2 shadow-md'>
                      <div className="p-3 rounded-t-lg bg-gradient-to-r from-yellow-300 to-amber-400 w-full h-fit">
                        <HighlightLetter size="text-md" className="font-opendyslexic">
                          Entregas calificadas:
                        </HighlightLetter>
                      </div>
                      <p className="font-semibold m-2 text-center">
                        {submittedTasks.filter(sub => sub.qualification !== null).length} / {students.length}
                      </p>
                    </div>
                  </div>

                  <div className='col-span-6 h-fit max-h-[500px] row-start-2 row-span-4'>
                    {submittedTasks && submittedTasks.length > 0 ? (
                      <div className="border-8 border-[#f7d654] rounded-3xl p-3 bg-white h-full shadow-md overflow-auto tracking-more-wide">
                        <HighlightLetter size="text-2xl" className="font-opendyslexic mb-4">
                          Entregas:
                        </HighlightLetter>
                        {submittedTasks.map((sub) => (
                          <div key={sub.id} className="m-2 flex items-center justify-between bg-pastelVeryLightYellow rounded-lg p-3 mb-3">
                            <div className="flex items-center gap-4">
                              <p className="font-opendyslexic font-semibold">
                                {sub.user?.people?.first_name} {sub.user?.people?.last_name}
                              </p>
                            </div>
                            <div className='flex gap-2'>
                              <a
                                href={`http://localhost:8080${sub.files[0]?.file_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="self-center border-2 border-[#2d4654] hover:bg-[#2d4654] hover:text-white transition-all  p-2 rounded-2xl"
                              >
                                Ver archivo
                              </a>
                              <button
                                className='px-3 py-2 text-white bg-[#2d4654] rounded-2xl hover:bg-[#22343f] transition-all'
                                onClick={() => {
                                  setSelectedSubmission(sub);
                                  setQualifyModalOpen(true);
                                }}
                              >
                                Calificar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center">No hay entregas.</p>
                    )}
                  </div>
                </>
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
      <QualifyTaskModal
        open={qualifyModalOpen}
        onClose={() => setQualifyModalOpen(false)}
        onSubmit={async ({ rating, comment }) => {
          if (!selectedSubmission) return;

          await qualifyTask(classId, taskId, selectedSubmission.user.id, {
            qualification: rating,
            comment
          });

          // Refrescar entregas calificadas
          const refreshedSubmitted = await getSubmittedTasks(classId, taskId);
          setSubmittedTasks(refreshedSubmitted);

          setQualifyModalOpen(false);
        }}
      />
    </div>
  );
}

export default TaskPage;
