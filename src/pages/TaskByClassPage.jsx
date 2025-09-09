import { useTask } from '../context/TasksContext';
import { useClass } from '../context/ClassContext';
import { useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/ui/Loading';
import { SlArrowRight, SlArrowLeft } from 'react-icons/sl';
import SideBar from '../components/SideBar';
import CreateTaskModal from '../components/CreateTask';
import { FaPlus } from 'react-icons/fa';
import CommentsBox from '../components/CommentsBox';
import NavbarClass from '../components/NavbarClass';
import People from '../components/People';
import { MdOutlineSchool } from "react-icons/md";
import HighlightLetter from '../components/ui/HighlightLetter';

function TaskPage() {
  const { classId } = useParams();
  const [currentClass, setCurrentClass] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(String(classId || ''));
  const [selectedView, setSelectedView] = useState('tasks');
  const { getTasks, tasks, isLoading, isCreating } = useTask();
  const { getClasses, classes } = useClass();
  const { user } = useAuth();

  useEffect(() => {
    getTasks(classId);
  }, [classId]);

  useEffect(() => {
    getClasses();
  }, [user]);

  // sincronizar currentClass cuando cambian classes o classId
  useEffect(() => {
    const foundClass = classes?.find((clase) => String(clase.id) === String(classId));
    setCurrentClass(foundClass || null);
  }, [classes, classId]);

  // sincronizar selectedClassId cuando cambia la ruta (classId)
  useEffect(() => {
    setSelectedClassId(String(classId || ''));
  }, [classId]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const location = useLocation();
  const bgColor = location.state?.bgColor || "#fef195"; // fallback

  const renderContent = () => {
    switch (selectedView) {
      case 'tasks':
        return <TaskCard tasks={tasks} key={Array.isArray(tasks) ? tasks.length : 'tasks'} />;
      case 'announcements':
        return <CommentsBox />;
      case 'people':
        return <People />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-8 grid-rows-[150px_40px,390px] gap-4 p-4">
      {isLoading || isCreating ? (
        <div className="h-[500px] col-start-1 col-end-9 flex justify-center items-center">
          {Loading(isLoading ? 'Cargando tareas...' : 'Creando tarea...')}
        </div>
      ) : (
        <>
          {/* Encabezado */}
          <div className="row-start-1 row-span-1 col-start-3 col-span-7 shadow-lg">
            <div className="h-full rounded-lg p-4 flex flex-col justify-center gap-3 bg-gradient-to-r from-yellow-300 to-amber-400">
              {currentClass && (
                <div className='flex justify-between items-center m-5'>
                  <div className='gap-4 flex flex-col'>
                    <HighlightLetter color='blue' size="text-3xl" className="font-opendyslexic font-bold line-clamp-1">
                      {currentClass.name}
                    </HighlightLetter>
                    <HighlightLetter color='red' size="text-md" className="font-opendyslexic text-gray-700 line-clamp-2">
                      {currentClass.description}
                    </HighlightLetter>
                  </div>
                  <div className='flex gap-2 items-center'>
                    <MdOutlineSchool className="text-7xl opacity-50" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <NavbarClass onSelect={setSelectedView} selectedView={selectedView} />

          {/* Contenido */}
          <div className="col-start-3 col-span-7 row-start-3 row-span-1 ">
            {renderContent()}
          </div>

          {/* Fondo opaco cuando la sidebar está abierta (móvil) */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-10 bg-black opacity-50 md:hidden"
              onClick={toggleSidebar}
            />
          )}

          {/* Sidebar móvil (recibe props) */}
          <div
            className={`fixed top-[calc(4*100%/8)] min-h-fit p-2 left-0 z-20 w-4/5 transform transition-all duration-500 md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          >
            <SideBar
              selectedClassId={selectedClassId}
              onSelect={(id) => setSelectedClassId(String(id))}
              onClose={toggleSidebar}
            />
          </div>

          {/* Botón para abrir/cerrar sidebar (móvil) */}
          <button
            className="md:hidden fixed top-[calc(4*100%/8)] pb-5 left-2 z-30 h-fit text-black rounded transform -translate-y-1/2"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <SlArrowLeft /> : <SlArrowRight />}
          </button>

          {/* Sidebar escritorio (IMPORTANTE: ahora le PASAMOS props) */}
          <div className="hidden md:block fixed top-[65px] min-h-fit p-2 left-0 z-20 w-1/5">
            <SideBar
              selectedClassId={selectedClassId}
              onSelect={(id) => setSelectedClassId(String(id))}
            />
          </div>

          {/* Botón crear tarea */}
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

          <CreateTaskModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
      )}
    </div>
  );
}

export default TaskPage;
