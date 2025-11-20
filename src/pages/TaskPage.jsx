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
import { Riple } from 'react-loading-indicators';
import { FaBook, FaFilePdf, FaFileWord, FaFileImage, FaFileAlt } from "react-icons/fa";
import NotFound from '../assets/not-found.svg';
import { set, useForm } from 'react-hook-form';
import { FaRegClock } from "react-icons/fa6";
import { IoWarningOutline } from "react-icons/io5";
import FileInput from '../components/ui/FileInput';
import QualifyTaskModal from '../components/ui/QualifyTaskModal';
import { useRealTimeUpdates } from '../hooks/useRealTimeUpdates';

function TaskPage({ tasks: initialTasks }) {
  const { classId, taskId } = useParams();
  const { user } = useAuth();
  const { getTask, submitTask, getSubmittedTasks, qualifyTask, deleteSubmittedTask } = useTask();
  const { getUsersByClass } = useClass();
  const [task, setTask] = useState(initialTasks);
  const [taskLoading, setTaskLoading] = useState(true);
  const [submittedTasks, setSubmittedTasks] = useState([]);
  const [submittedLoading, setSubmittedLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { extractText, extractedText, isExtracting, setExtractedText } = useTool();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [qualifyModalOpen, setQualifyModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Derived state
  const pendingCount = students.filter(s => !submittedTasks.some(sub => sub.user.id === s.id)).length;
  const mySubmission = submittedTasks.find(sub => sub.user.id === user.id);

  // Real-time updates
  // Real-time updates
  useRealTimeUpdates('task_submitted', (data) => {
    if (String(data.submission.taskId) === String(taskId)) {
      setSubmittedTasks((prev) => {
        if (prev.some(s => s.id === data.submission.id)) return prev;
        return [...prev, data.submission];
      });
    }
  });

  useRealTimeUpdates('submission_qualified', (data) => {
    if (String(data.submission.taskId) === String(taskId)) {
      setSubmittedTasks((prev) => prev.map((s) => (s.id === data.submission.id ? data.submission : s)));
    }
  });

  useRealTimeUpdates('submission_updated', (data) => {
    if (String(data.submission.taskId) === String(taskId)) {
      setSubmittedTasks((prev) => prev.map((s) => (s.id === data.submission.id ? data.submission : s)));
    }
  });

  useRealTimeUpdates('submission_deleted', (data) => {
    const deletedId = data.submissionId || data.id || data;
    setSubmittedTasks((prev) => prev.filter((s) => s.id !== deletedId));
  });

  const formatDate = (dateString) => {
    // Tomar solo la parte de la fecha antes de la T
    const datePart = dateString.split('T')[0]; // "2025-11-15"
    const [year, month, day] = datePart.split('-');
    return `${year}/${month}/${day}`;
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

  // Cargar entregas y estudiantes
  useEffect(() => {
    const loadSubmittedAndStudents = async () => {
      if (!task) return;

      try {
        const users = await getUsersByClass(classId);
        const studentsOnly = users.filter(u => u.role.name === 'student');
        setStudents(studentsOnly);

        const submitted = await getSubmittedTasks(classId, taskId);
        setSubmittedTasks(submitted);
      } catch (error) {
        console.error('Error al cargar pendientes:', error);
      } finally {
        setSubmittedLoading(false);
      }
    };

    loadSubmittedAndStudents();
  }, [task, classId, taskId, getUsersByClass, getSubmittedTasks]);


  // Limpiar texto extraído al cambiar de tarea
  useEffect(() => {
    setExtractedText([]);
  }, [taskId, classId, setExtractedText]);

  const handleOnSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', data.file[0]);
      await submitTask(classId, taskId, formData);

      // Refrescar entregas
      const refreshedSubmitted = await getSubmittedTasks(classId, taskId);
      setSubmittedTasks(refreshedSubmitted);

      setIsSubmitting(false);
    } catch (error) {
      console.error('Error al enviar la tarea:', error);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleDeteleSubmission = async (submissionId) => {
    setIsDeleting(true);
    try {
      await deleteSubmittedTask(classId, taskId, submissionId);

      // Refrescar entregas
      const refreshedSubmitted = await getSubmittedTasks(classId, taskId);
      setSubmittedTasks(refreshedSubmitted);

      setIsDeleting(false);
    } catch (error) {
      console.error('Error al eliminar la entrega:', error);
      setIsDeleting(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const isLoading = taskLoading || submittedLoading || isExtracting;

  // Determinar si la fecha límite ya pasó
  const isPastDue = () => {
    if (!task?.due_date) return false;

    // Tomamos solo la fecha sin hora para comparar
    const due = new Date(task.due_date);
    const today = new Date();

    // Ignorar hora, solo comparar año/mes/día
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return today > due;
  };

  // Dentro del componente TaskPage

  // Crear array combinado de entregas y estudiantes
  const studentsWithSubmissions = students.map((student) => {
    const submission = submittedTasks.find(sub => sub.user.id === student.id) || null;
    return {
      student,
      submission
    };
  });

  console.log('submitted', studentsWithSubmissions);

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
                    {isSubmitting || isDeleting ? (
                      <div className="flex justify-center items-center h-32">
                        <Riple color="#fbbf24" size={60} />
                      </div>
                    ) : (
                      <div className="p-3">
                        {submittedTasks && submittedTasks.length > 0 ? (
                          submittedTasks.map((sub) => (
                            <div key={sub.id} className="flex flex-col items-center gap-2">
                              {sub.submissionFiles.length > 0 ? (
                                <a
                                  href={`http://localhost:8080${sub.submissionFiles[0]?.file_url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex flex-col items-center gap-1"
                                >

                                  {getFileIcon(sub.submissionFiles[0]?.file_type)}
                                  <p className="text-sm text-gray-700 truncate max-w-[150px] text-center">
                                    {sub.submissionFiles[0]?.file_id}
                                  </p>

                                </a>
                              ) : (
                                <HighlightLetter color='red' size="text-sm" className="mt-4 font-opendyslexic">
                                  No entregado
                                </HighlightLetter>
                              )
                              }
                              {sub.qualification === null ? (
                                <button onClick={() => handleDeteleSubmission(sub.id)} className="w-1/2 bg-gray-300 rounded p-1 mt-1 hover:bg-gray-400 transition-all">
                                  <HighlightLetter size='text-sm' color='red' className='font-opendyslexic'>Anular entrega</HighlightLetter>
                                </button>
                              ) : (null)
                              }
                            </div>
                          ))
                        ) : (
                          <>
                            {!isPastDue() ? (
                              <form onSubmit={handleOnSubmit} className="flex flex-col items-center">
                                <div className="flex flex-col gap-3 w-full">
                                  <HighlightLetter colo r='red' size="text-md" className='font-opendyslexic tracking-more-wide'>
                                    Pendiente de entrega
                                  </HighlightLetter>
                                  <FileInput
                                    register={register}
                                    errors={errors}
                                    setValue={setValue}
                                  />
                                </div>
                                <button type="submit" className="w-1/2 bg-[#89dfbf] hover:bg-[#78c4a8] transition-all rounded p-2 mt-3">
                                  <HighlightLetter color='green' size='text-sm' className='font-opendyslexic'>Subir archivo</HighlightLetter>
                                </button>
                              </form>
                            ) : (
                              <HighlightLetter color='red' size="text-sm" className="mt-4 font-opendyslexic">
                                No entregado
                              </HighlightLetter>
                            )}

                          </>
                        )}
                      </div>
                    )}

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
                      {students.length === 0 ? (
                        <p className="font-semibold m-2 text-center">No hay estudiantes en esta clase.</p>
                      ) : (
                        <p className="font-semibold m-2 text-center">
                          {pendingCount} / {students.length}
                        </p>
                      )}
                    </div>

                    <div className='bg-white rounded-t-lg h-1/2 shadow-md'>
                      <div className="p-3 rounded-t-lg bg-gradient-to-r from-yellow-300 to-amber-400 w-full h-fit">
                        <HighlightLetter size="text-md" className="font-opendyslexic">
                          Entregas calificadas:
                        </HighlightLetter>
                      </div>
                      {students.length === 0 ? (
                        <p className="font-semibold m-2 text-center">No hay estudiantes en esta clase</p>
                      ) : (
                        <>
                          <p className="font-semibold m-2 text-center">
                            {submittedTasks.filter(sub => sub.qualification !== null).length} / {students.length}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className='col-span-6 h-fit max-h-[500px] row-start-2 row-span-4'>
                    {studentsWithSubmissions.length > 0 ? (
                      <div className="border-8 border-[#f7d654] rounded-3xl p-3 bg-white h-full shadow-md overflow-auto tracking-more-wide">
                        <HighlightLetter size="text-2xl" className="font-opendyslexic mb-4">
                          Entregas:
                        </HighlightLetter>
                        {studentsWithSubmissions.map(({ student, submission }) => (
                          <div key={student.id} className="m-2 flex items-center justify-between bg-pastelVeryLightYellow rounded-lg p-3 mb-3">
                            <div className="flex items-center gap-4">
                              <p className="font-opendyslexic font-semibold">
                                {student.people.first_name} {student.people.last_name}
                              </p>
                            </div>
                            <div className='flex gap-2'>
                              {submission ? (
                                <a
                                  href={`http://localhost:8080${submission.submissionFiles[0]?.file_url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="self-center border-2 border-[#2d4654] hover:bg-[#2d4654] hover:text-white transition-all  p-2 rounded-2xl"
                                >
                                  Ver archivo
                                </a>
                              ) : (
                                <>
                                  {isPastDue() ? (
                                    <div className='flex gap-2 border-2 border-red-600 items-center p-2 rounded-2xl'>
                                      <HighlightLetter size='text-sm' color='red' className='self-center'>
                                        No entregado
                                      </HighlightLetter>
                                      <IoWarningOutline className="text-lg text-red-600" />
                                    </div>
                                  ) : (
                                    <div className='flex gap-2 border-2 border-green-600 items-center p-2 rounded-2xl'>
                                      <HighlightLetter size='text-sm' color='green' className=''>
                                        Pendiente
                                      </HighlightLetter>
                                      <FaRegClock className="text-lg text-green-600" />
                                    </div>
                                  )}
                                </>
                              )}

                              {(!submission || submission.qualification === null) && (
                                <button
                                  className='px-3 py-2 text-white bg-[#2d4654] rounded-2xl hover:bg-[#22343f] transition-all'
                                  onClick={() => {
                                    setSelectedSubmission(submission || { user: student });
                                    setQualifyModalOpen(true);
                                  }}
                                >
                                  Calificar
                                </button>
                              )}

                              {submission && submission.qualification !== null && (
                                <div className="m-2 p-2">
                                  <p className="text-xl font-bold">{submission.qualification} / 10</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className='flex justify-center'>
                        <div className="w-80 h-52 flex flex-col justify-center items-center border bg-white rounded-md shadow-md">
                          <img src={NotFound} alt="No existen tareas" className="w-24 h-24 mb-4" />
                          <HighlightLetter size="text-lg" className='font-opendyslexic tracking-more-wide'>Aún no hay entregas</HighlightLetter>
                        </div>
                      </div>
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
