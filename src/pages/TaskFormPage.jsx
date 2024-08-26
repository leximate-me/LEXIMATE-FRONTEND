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
    <div className="flex h-[calc(100vh-4rem)] flex-col justify-center">
      <div className="bg-zinc-900 max-w-md mx-auto p-10 rounded-lg shadow-lg">
        <form className="space-y-4" onSubmit={onSubmit}>
          <label htmlFor="" className="text-white">
            Title:
          </label>
          <input
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="text"
            placeholder="title"
            {...register('title')}
            autoFocus
          />
          <label htmlFor="" className="text-white">
            Description:
          </label>
          <textarea
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="text"
            rows="3"
            placeholder="description"
            {...register('description')}
          />
          <label htmlFor="" className="text-white">
            Date:
          </label>
          <input
            className='w-full bg-zinc-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"'
            type="date"
            {...register('date')}
          />
          <button
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg"
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
