import { useTask } from '../context/TasksContext';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClassCard from '../components/ClassCard';
import { useClass } from '../context/ClassContext';

function TaskPage() {
  const { getClasses, classes } = useClass()

  useEffect(() => {
    getClasses();
  }, []);
  return (
    <>
      <div className="flex justify-center">
        <ClassCard classes={classes}/>
      </div>
    </>
  );
}

export default TaskPage;
