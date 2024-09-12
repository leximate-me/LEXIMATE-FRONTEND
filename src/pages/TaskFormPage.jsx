import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTask } from '../context/TasksContext';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

function TaskFormPage() {
  const { register, handleSubmit, setValue } = useForm();
  const { createTask, getTask, updateTask } = useTask();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const task = await getTask(params.id);
        setValue('title', task.title);
        setValue('description', task.description);
        setValue(
          'date',
          task.date ? dayjs(task.date).format('YYYY-MM-DD') : ''
        );
      }
    }
    loadTask();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    if (params.id) {
      await updateTask(params.id, {
        ...data,
        date: dayjs.utc(data.date).format(),
      });
    } else {
      await createTask({
        ...data,
        date: dayjs.utc(data.date).format(),
      });
    }
    navigate('/tasks');
  });

  return (
    <div className="flex mt-5 justify-center">

      <div className="bg-white border-stone-400 border-2 w-full max-w-lg  p-10 rounded-lg shadow-[0_5px_15px_1px_rgba(0,0,0,0.3)]">

        <form className="space-y-4" onSubmit={onSubmit}>
        
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título
          </label>
          <input
            className="w-full bg-white border-2 border-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="text"
            placeholder="title"
            {...register('title')}
            autoFocus
          />

          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            className="w-full bg-white border-2 border-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            rows="3"
            placeholder="description"
            {...register('description')}
          />

          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Fecha
          </label>
          <input
            className="w-full bg-white border-2 border-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="date"
            {...register('date')}
          />

          <button
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            type="submit"
          >
            Save
          </button>
          
        </form>
      
      </div>

    </div>
  );
}

export default TaskFormPage;
