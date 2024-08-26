import React from 'react';
import { useTask } from '../context/TasksContext';
import { Link } from 'react-router-dom';

function TaskCard({ tasks }) {
  const { updateTask, deleteTask } = useTask();
  return (
    <div className="max-w-md w-full p-10 rounded-md">
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li className="bg-zinc-800 p-4 rounded-lg shadow-lg" key={task._id}>
            <header className="flex justify-between">
              <h2 className="text-2xl  font-semibold break-words">
                {task.title}
              </h2>
              <div className="flex gap-x-2 items-center ">
                <Link
                  to={`/tasks/${task._id}`}
                  className="bg-blue-600 text-white rounded-md p-2"
                >
                  Edit
                </Link>
                <button
                  className="bg-red-600 text-white rounded-md p-2 "
                  onClick={() => deleteTask(task._id)}
                >
                  Delete
                </button>
              </div>
            </header>
            <p className="break-words">{task.description}</p>
            <p>{task.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskCard;
