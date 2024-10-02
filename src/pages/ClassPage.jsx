import { useEffect, useState } from 'react';
import ClassCard from '../components/ClassCard';
import { useClass } from '../context/ClassContext';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import CreateClassModal from '../components/ClassForm'; // Importar el componente del formulario

function TaskPage() {
  const { getClasses, classes } = useClass();
  const [showModal, setShowModal] = useState(false);  // Controla si el modal está visible o no

  const { user } = useAuth();

  useEffect(() => {
    getClasses();
    console.log('user rol',user.roles_fk);
  }, []);

  return (
    <>
      <div className="flex justify-center">
        <ClassCard classes={classes} />
      </div>

      {/* Botón flotante para crear clase */}
      {user.roles_fk === 3 ? (
        <>
          <div className="fixed bottom-8 right-8">
            <button
              onClick={() => setShowModal(true)}  // Mostrar el modal al hacer clic
              className="relative w-14 h-14 bg-blue-600 text-white rounded-full p-4 hover:bg-blue-700 transition duration-200 group"
            >
              <FaPlus className="absolute left-5 bottom-5" />
              <span className="absolute bottom-full mb-2 w-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100">
                Crear una clase
              </span>
            </button>
          </div>

          {/* Renderizar el modal de creación de clase */}
          <CreateClassModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
      ) :
        null
      }
    </>
  );
}

export default TaskPage;
