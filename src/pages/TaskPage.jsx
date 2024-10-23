import { useTask } from '../context/TasksContext';
import { useClass } from '../context/ClassContext';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';
import bgImg from '../assets/bg-taskPage.jpg';
import Loading from '../components/ui/Loading';
import { map } from 'framer-motion/client';


function TaskPage() {
  const { classCode } = useParams();
  const [currentClass, setCurrentClass] = useState(null);

  const { getTasks, tasks, isLoading } = useTask();
  const { getClasses, classes } = useClass();
  const { user } = useAuth();

  useEffect(() => {
    getTasks(classCode);
  }, []);

  useEffect(() => {
    getClasses();
  }, [user]);

  useEffect(() => {
    const foundClass = classes.find((clase) => clase.class_code === classCode);
    setCurrentClass(foundClass);
  }, [classes, classCode]);

  useEffect(() => {
    
    tasks.forEach(task => {
      if (task.files && task.files.length > 0) {
        task.files.forEach(file => {
          console.log('files',file.file_url);
        });
      }
    });
    console.log('tasks',tasks);
  }, [tasks]);

  return (
    <div className='h-[500px]'>
      {isLoading ? (
        <>
          <div className="flex justify-center h-[100%]">
            {Loading('Cargando tareas...')}
          </div>
        </>
      ) : (
        <>
          <div
            className="grid grid-cols-5 grid-rows-1 md:grid-rows-4 gap-4 rounded-lg m-2 md:m-5"
            style={{
              backgroundImage: `url(${bgImg})`,
              backgroundSize: 'cover'
            }}>
            {currentClass && (
              <>
                <h1 className="text-3xl row-start-1 md:text-5xl md:row-start-3 text-white m-2"><b>{currentClass.name}</b></h1>
                <p className="text-1xl row-start-2 md:text-3xl md:row-start-4 text-white m-2">{currentClass.description}</p>
              </>
            )}
          </div>
            <TaskCard tasks={tasks} key={tasks._id} />
        </>
      )}

    </div>
  );
}

export default TaskPage;
