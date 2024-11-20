import { useTask } from '../context/TasksContext';
import { useClass } from '../context/ClassContext';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';
import bgImg from '../assets/bg-taskPage.jpg';
import Loading from '../components/ui/Loading';
import { SlArrowRight, SlArrowLeft } from 'react-icons/sl';
import SideBar from '../components/SideBar';
import CreateTaskModal from '../components/CreateTask';
import { FaPlus } from 'react-icons/fa';
import CommentsBox from '../components/CommentsBox';
import NavbarClass from '../components/NavbarClass';
import People from '../components/People';

function TaskPage() {
  const { classId } = useParams();
  const [currentClass, setCurrentClass] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedView, setSelectedView] = useState('tasks'); // Estado para la vista seleccionada
  const { getTasks, tasks, isLoading, isCreating } = useTask();
  const { getClasses, classes } = useClass();
  const { user } = useAuth();

  useEffect(() => {
    getTasks(classId);
  }, [classId]);

  useEffect(() => {
    getClasses();
  }, [user]);

  useEffect(() => {
    const foundClass = classes.find((clase) => clase.id === parseInt(classId));
    setCurrentClass(foundClass);
  }, [classes, classId]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Función para renderizar el contenido basado en la selección
  const renderContent = () => {
    switch (selectedView) {
      case 'tasks':
        return <TaskCard tasks={tasks} key={tasks.id} />;
      case 'announcements':
        return <CommentsBox />;
      case 'people':
        return <People />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-8 grid-rows-[50px_100px,repeat(1,minmax(0,1fr))] md:grid-rows-[50px_250px,repeat(3,minmax(0,1fr))] gap-4 p-2">
      {isLoading || isCreating ? (
        <div className="h-[500px] col-start-1 col-end-9 flex justify-center items-center">
          {Loading(isLoading ? 'Cargando tareas...' : 'Creando tarea...')}
        </div>
      ) : (
        <>
          <NavbarClass onSelect={setSelectedView} selectedView={selectedView} />

          {/* Encabezado con tamaño fijo */}
          <div className="col-span-8 col-start-1 row-span-1 row-start-2 md:col-span-6 md:col-start-3 md:row-span-1 md:row-start-2">
            <div
              className="md:h-[250px] rounded-lg bg-cover bg-center bg-no-repeat flex flex-col justify-end p-4 overflow-hidden"
              style={{
                backgroundImage: `url(${bgImg})`,
                backgroundSize: 'cover',
              }}
            >
              {currentClass && (
                <>
                  <h1 className="text-3xl md:text-5xl text-white truncate">
                    <b>{currentClass.name}</b>
                  </h1>
                  <p className="text-xl md:text-2xl text-white line-clamp-2">
                    {currentClass.description}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Renderizar contenido basado en la opción seleccionada */}
          <div className="mt-5 md:mt-0 col-span-8 row-start-3 col-start-1 md:col-span-6 md:col-start-3 md:row-span-2 md:row-start-3">
            {renderContent()}
          </div>

          {/* Fondo opaco cuando la sidebar está abierta */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-10 bg-black opacity-50 md:hidden"
              onClick={toggleSidebar}
            ></div>
          )}

          {/* Sidebar para dispositivos móviles */}
          <div
            className={`fixed top-[calc(4*100%/8)] min-h-fit p-2 left-0 z-20 w-4/5 transform transition-all duration-500 md:hidden ${
              isSidebarOpen ? 'translate-x-0 w-4/5' : '-translate-x-full'
            }`}
          >
            <SideBar onClose={toggleSidebar} />
          </div>

          {/* Botón que cambia según el estado de la sidebar */}
          <button
            className={`md:hidden fixed top-[calc(4*100%/8)] pb-5 left-2 z-30 h-fit text-black rounded transform -translate-y-1/2`}
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <SlArrowLeft /> : <SlArrowRight />}
          </button>

          {/* Sidebar siempre visible en desktop */}
          <div className="hidden md:block fixed top-[65px] min-h-fit p-2 left-0 z-20 w-1/5">
            <SideBar />
          </div>

          {/* Botón para crear tarea, visible solo para profesores */}
          {user && user.rol === 3 && (
            <div className="fixed bottom-8 right-8">
              <button
                onClick={() => setShowModal(true)}
                className="relative w-14 h-14 bg-blue-600 text-white rounded-full p-4 hover:bg-blue-700 transition duration-200 group"
              >
                <FaPlus className="absolute left-5 bottom-5" />
                <span className="absolute bottom-full mb-2 w-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100">
                  Crear una tarea
                </span>
              </button>
            </div>
          )}

          <CreateTaskModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        </>
      )}
    </div>
  );
}

export default TaskPage;
