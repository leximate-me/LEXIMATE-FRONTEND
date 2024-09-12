import React from 'react';
import { useTask } from '../context/TasksContext';
import { Link } from 'react-router-dom';

function TaskCard({ tasks }) {
  const { updateTask, deleteTask } = useTask();

  const date = tasks.map((task) => {

      let dateCont = [];

      let dateSplit = task.date.split('');

      for (let i = 0; i < 10; i++) {
        dateCont.push(dateSplit[i]);
      }

      let joinDate = dateCont.join('');

      task.date = joinDate;
    })

  return (
    <div className="max-w-md w-full p-10 rounded-md">
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li className="bg-white p-4 rounded-lg shadow-[0_2px_8px_0px] border-2 border-gray-300" key={task._id}>
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
                  onClick={() => deleteTask(task._id)}
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
  );
}

export default TaskCard;
