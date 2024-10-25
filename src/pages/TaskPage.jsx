import { useTask } from '../context/TasksContext';
import { useClass } from '../context/ClassContext';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';
import bgImg from '../assets/bg-taskPage.jpg';
import Loading from '../components/ui/Loading';
import SideBar from '../components/SideBar'; // Si ya tienes este componente hecho

function TaskPage() {
  const { classId } = useParams();
  const [currentClass, setCurrentClass] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado para la sidebar en mobile

  const { getTasks, tasks, isLoading } = useTask();
  const { getClasses, classes } = useClass();
  const { user } = useAuth();

  useEffect(() => {
    getTasks(classId);
  }, []);

  useEffect(() => {
    getClasses();
  }, [user]);

  useEffect(() => {
    const foundClass = classes.find((clase) => clase.id === parseInt(classId));
    setCurrentClass(foundClass);
  }, [classes, classId]);

  // Toggle para abrir/cerrar la sidebar en mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="grid grid-cols-8 grid-rows-8 gap-4 p-2 h-[calc(100vh_-_89.33px)]">

      {isLoading ? (
        // Centrar el componente Loading
        <div className="h-[500px] col-start-1 col-end-9 flex justify-center items-center">
          {Loading('Cargando tareas...')}
        </div>
      ) : (
        <>
          <div className="col-span-6 row-span-2 col-start-1 col-end-9 md:col-start-3 row-start-1">
            <div
              className="h-full rounded-lg bg-cover bg-center bg-no-repeat flex flex-col justify-end p-4"
              style={{
                backgroundImage: `url(${bgImg})`,
                backgroundSize: 'cover',
              }}
            >
              {currentClass && (
                <>
                  <h1 className="text-3xl md:text-5xl text-white">
                    <b>{currentClass.name}</b>
                  </h1>
                  <p className="text-xl md:text-2xl text-white">
                    {currentClass.description}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="col-span-8 row-span-6 col-start-1 row-start-3 md:col-span-6 md:col-start-3">
            <TaskCard tasks={tasks} key={tasks.id} />
          </div>
          <div className="hidden md:block col-span-6 row-span-8 col-start-1 row-start-1 md:col-span-2 md:col-start-1 bg-blue-400"></div>
        </>
      )}
    </div>

  );
}

export default TaskPage;
