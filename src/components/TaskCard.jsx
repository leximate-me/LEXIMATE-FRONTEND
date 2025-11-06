import React, { useState } from 'react';
import { useTask } from '../context/TasksContext';
import { useParams, useNavigate } from 'react-router-dom';
import notFound from '../assets/not-found.svg';
import Loading from './ui/Loading';
import Dropdown from './ui/DropDownButton';
import { useAuth } from '../context/AuthContext';
import HighlightLetter from './ui/HighlightLetter';
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

function TaskCard({ tasks: initialTasks }) {
  const navigate = useNavigate();
  const { updateTask, deleteTask } = useTask();
  const { classId } = useParams();
  const { user } = useAuth();

  const [tasks, setTasks] = useState(initialTasks);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Calcular paginación
  const totalPages = Math.ceil(tasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTasks = tasks.slice(startIndex, startIndex + itemsPerPage);

  // Formatear fecha
  tasks.forEach((task) => {
    if (task.due_date) {
      let dateSplit = task.due_date.split('');
      task.date = dateSplit.slice(0, 10).join('');
    }
  });

  const handleSelectTask = (taskId) => {
    navigate(`/${classId}/task/${taskId}`);
  };

  const handleDeleteTask = async (classId, taskId) => {
    setIsDeleting(true);
    try {
      await deleteTask(classId, taskId);
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
    } catch (error) {
      console.log('Error al eliminar tarea:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {isDeleting ? (
        <div className="flex justify-center h-[100%]">
          {Loading('Eliminando tarea...')}
        </div>
      ) : (
        <>
          {tasks.length === 0 ? (
            <div className="w-80 h-52 flex flex-col justify-center items-center border bg-white rounded-md shadow-md">
              <img src={notFound} alt="No existen tareas" className="w-24 h-24 mb-4" />
              <h1 className='font-opendyslexic tracking-more-wide'><b>NO EXISTEN TAREAS</b></h1>
            </div>
          ) : (
            <>
              {/* Lista de tareas con animación */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage} // <- importante para que se reinicie la animación en cada página
                  className="flex gap-4"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {currentTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleSelectTask(task.id)}
                      className="relative border-l-4 border-yellow-400 hover:scale-105 w-80 flex-shrink-0 cursor-pointer rounded-lg shadow-md hover:shadow-lg transition duration-200"
                    >
                      <p className='bg-gradient-to-r from-yellow-300 to-amber-400 p-2 rounded-t-md'>
                        <HighlightLetter size="text-xl" className="font-opendyslexic dark:text-white">
                          {task.title}
                        </HighlightLetter>
                      </p>
                      <div className='p-4 flex flex-col gap-2'>
                        <HighlightLetter color='red' size="text-md" className="font-opendyslexic dark:text-white">
                          {task.description}
                        </HighlightLetter>
                        <p>
                          <HighlightLetter color='green' size="text-sm" className="font-opendyslexic text-gray-600 dark:text-gray-400">
                            Fecha de entrega:
                          </HighlightLetter>
                          <b>{task.date}</b>
                        </p>
                      </div>

                      {user && user.rol === 3 && (
                        <div
                          className="absolute top-2 right-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Dropdown
                            onAbandonClass={handleDeleteTask}
                            classId={classId}
                            additionalParam={task.id}
                            msg={'Eliminar tarea'}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    className="cursor-pointer hover:scale-110 transition disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    <HiOutlineChevronDoubleLeft className="text-xl" />
                  </button>

                  <span className="self-center font-semibold">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    className="cursor-pointer hover:scale-110 transition disabled:opacity-50"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    <HiOutlineChevronDoubleRight className="text-xl" />
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default TaskCard;
