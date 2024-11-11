import React, { useState } from 'react';
import { useTask } from '../context/TasksContext';
import { useParams, useNavigate } from 'react-router-dom';
import notFound from '../assets/not-found.svg';
import Loading from './ui/Loading';
import Dropdown from './ui/DropDownButton';

function TaskCard({ tasks: initialTasks }) {

  const navigate = useNavigate();

  const { updateTask, deleteTask } = useTask();

  const { classId } = useParams();

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
  });

  const handleSelectTask = (taskId) => {
    console.log('Tarea seleccionada:', taskId);
    navigate(`/${classId}/task/${taskId}`);
  }

  const handleDeleteTask = async (classId, taskId) => {
    setIsDeleting(true); // Mostrar loading al iniciar la eliminación
    try {
      console.log('Tarea abandonada:', taskId);
      await deleteTask(classId, taskId);

      // Filtrar la clase eliminada del estado
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
    } catch (error) {
      console.log('Error al abandonar la tarea:', error);
    } finally {
      setIsDeleting(false); // Ocultar loading cuando termine
    }
  };

  return (
    <div className="flex justify-center">
      {isDeleting ? (
        <div className="flex justify-center h-[100%]">
          {Loading('Eliminando tarea...')}
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
              <div className="w-full">
                <ul className="col-start-1 col-end-7 space-y-4 m-2">
                  {tasks.map((task) => (
                    <li
                      onClick={() => handleSelectTask(task.id)}
                      className="grid grid-cols-6 grid-rows-3 dark:bg-[#1a1a1a] bg-white p-4 rounded-lg shadow-[0px_8px_12px_-6px] border border-gray-300 cursor-pointer dark:border-gray-500"
                      key={task.id}
                    >
                      <h2 className="col-span-6 md:col-span-3 text-2xl font-semibold break-words dark:text-white">
                        {task.title}
                      </h2>
                      <p className="col-span-6 md:col-span-3 col-start-1 row-start-2 break-words dark:text-white">{task.description}</p>
                      <p className="col-span-7 md:col-span-3 row-start-3 dark:text-white"><b>Fecha de entrega: </b>{task.date}</p>

                      {task.files && task.files.length > 0 && (
                        <div className="col-span-7 md:col-span-3 md:row-span-3 m-2">
                          <ul className="space-y-2 h-full">
                            {task.files.map((file) => (
                              <li
                                className="w-full flex justify-center"
                                key={file._id}
                              >
                                <img
                                  className="rounded-lg max-w-96 max-h-96"
                                  src={file.file_url}
                                  alt=""
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="col-start-7 row-start-1 w-fit h-fit"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}>
                        <Dropdown
                          onAbandonClass={handleDeleteTask}
                          classId={classId}
                          additionalParam={task.id}
                          msg={'Eliminar tarea'}
                        />
                      </div>
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
