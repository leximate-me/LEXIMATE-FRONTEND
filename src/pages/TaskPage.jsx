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
    <div className="relative h-[90vh] grid grid-cols-5 grid-rows-5">
      {isLoading ? (
        <div className="col-start-3 col-end-4 row-start-3 row-end-4">
          {Loading('Cargando tareas...')}
        </div>
      ) : (
        <>
          <div className='bg-red-400 col-start-1 col-end-2 row-start-1 row-end-7 p-2'>
            {/* Botón para abrir/cerrar la sidebar en móviles */}
            <button
              className="md:hidden bg-blue-500 text-white p-2 m-2 row-start-3"
              onClick={toggleSidebar}
            >
              {isSidebarOpen ? 'Cerrar Sidebar' : 'Abrir Sidebar'}
            </button>

            {/* SIDEBAR - Posicionada de forma fija en móviles */}
            <div
              className={`fixed top-0 left-0 w-64 md:w-full h-full bg-green-400 p-2 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:relative md:translate-x-0 row-start-2 md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-7`}
            >
              {/* Aquí puedes poner el contenido de la sidebar */}
              <SideBar />
            </div>
          </div>

          {/* HEADER */}
          <div className="col-start-2 col-end-7 row-start-1 row-end-3 p-2">
            <div
              className="h-full grid grid-cols-6 grid-rows-6 rounded-lg"
              style={{
                backgroundImage: `url(${bgImg})`,
                backgroundSize: 'cover',
              }}
            >
              {currentClass && (
                <>
                  <h1 className="text-5xl text-white row-start-4 row-end-5 m-2">
                    <b>{currentClass.name}</b>
                  </h1>
                  <p className="text-2xl text-white row-start-6 row-end-7 m-2">
                    {currentClass.description}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* CARDS */}
          <div className="col-start-3 col-end-7 row-start-3 row-end-7 p-2">
            <TaskCard tasks={tasks} key={tasks.id} />
          </div>
        </>
      )}
    </div>
  );
}

export default TaskPage;
