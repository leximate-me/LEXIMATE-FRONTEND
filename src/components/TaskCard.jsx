import React, { useState } from 'react';
import { useTask } from '../context/TasksContext';
import { useParams } from 'react-router-dom';
import notFound from '../assets/not-found.svg';
import Loading from './ui/Loading';
import Dropdown from './ui/DropDownButton';

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

  const handleDeleteTask = async (classCode, id) => {
    setIsDeleting(true); // Mostrar loading al iniciar la eliminación
    try {
      console.log("Tarea abandonada:", id);
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
    <div className='m-5'>
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
              <div className="grid grid-cols-6">
                <ul className="col-start-3 col-end-7 space-y-4 m-2">
                  {tasks.map((task) => (
                    <li className="bg-white p-4 rounded-lg shadow-[0px_8px_12px_-6px] border-2 border-gray-300" key={task._id}>
                      <header className="flex justify-between">
                        <h2 className="text-2xl  font-semibold break-words">
                          {task.title}
                        </h2>
                        <div className="flex gap-x-2 items-center ">
                          <Dropdown onAbandonClass={handleDeleteTask} code={task.id} additionalParam={classCode} />
                        </div>
                      </header>
                      <p className="break-words">{task.description}</p>
                      <p className='mt-2'>{task.date}</p>


                      {task.files && task.files.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold">Archivos adjuntos:</h3>
                          <ul className="space-y-2">
                            {task.files.map((file) => (
                              <li className='max-w-[50%] md:max-w-[20%]' key={file._id}>
                                <img className='rounded-lg' src={file.file_url} alt="" />
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}


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
