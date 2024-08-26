import { useTask } from '../context/TasksContext';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import TaskCard from '../components/TaskCard';

function TaskPage() {
  const { getTasks, tasks } = useTask();

  useEffect(() => {
    getTasks();
  }, []);
  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
        <TaskCard tasks={tasks} key={tasks._id} />
      </div>
    </>
  );
}

export default TaskPage;
