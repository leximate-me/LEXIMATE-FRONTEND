import React, { useState } from 'react';
import { useTask } from '../context/TasksContext';
import { Link, useParams } from 'react-router-dom';
import notFound from '../assets/not-found.svg';
import Loading from './ui/Loading';

function TaskCard({ tasks: initialTasks }) {
  const { updateTask, deleteTask } = useTask();

  const { classCode } = useParams();

  const [tasks, setTasks] = useState(initialTasks);

  const [isDeleting, setIsDeleting] = useState(false);

  const date = tasks.map((task) => {

    let dateCont = [];

    let dateSplit = task.due_date.split('');

    for (let i = 0; i < 10; i++) {
      dateCont.push(dateSplit[i]);
    }

    let joinDate = dateCont.join('');

    task.date = joinDate;
  })

  const handleAbandonClass = async (classCode, id) => {
    setIsDeleting(true); // Mostrar loading al iniciar la eliminación
    try {
      console.log("Tarea abandonada:", classCode);
      await deleteTask(classCode, id);

      // Filtrar la clase eliminada del estado
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));

    } catch (error) {
      console.log("Error al abandonar la clase:", error);
    } finally {
      setIsDeleting(false); // Ocultar loading cuando termine
    }
  };

  return (
    <div className='flex justify-center m-5'>
      {isDeleting ? (
        <div className="flex justify-center h-[100%]">
          {Loading('Eliminando clase...')}
        </div>
      ) : (
        <>
          {tasks.length === 0 ? (
            <div className="w-80 h-52 flex flex-col justify-center items-center border border-gray-300 rounded-md shadow-[0px_9px_15px_-7px_rgba(0,0,0,0.75)]">
              <div className="flex flex-wrap justify-center items-center w-[90%] h-[90%] m-5">
                <img src={notFound} alt="No existen clases" />
              </div>
              <div className="flex flex-wrap justify-center items-center w-[90%] h-[90%] m-5">
                <h1>
                  <b>NO EXISTEN TAREAS</b>
                </h1>
              </div>
            </div>
          ) : (
            <>
              <div className="h-[100%] w-[100%] rounded-md">
                <ul className="space-y-4">
                  {tasks.map((task) => (
                    <li className="bg-white p-4 rounded-lg shadow-[0px_8px_12px_-6px] border-2 border-gray-300" key={task._id}>
                      <header className="flex justify-between">
                        <h2 className="text-2xl  font-semibold break-words">
                          {task.title}
                        </h2>
                        <div className="flex gap-x-2 items-center ">
                          <Link
                            to={`/tasks/${task._id}`}
                            className="bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700 transition duration-200"
                          >
                            Editar
                          </Link>
                          <button
                            className="bg-red-600 text-white rounded-md p-2 hover:bg-red-700 transition duration-200"
                            onClick={() => handleAbandonClass(classCode, task.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </header>
                      <p className="break-words">{task.description}</p>
                      <p className='mt-2'>{task.date}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </>
      )}

    </div>
  );
}

export default TaskCard;
