import { useEffect, useState } from 'react';
import ClassCardTeacher from '../components/ClassCardTeacher';
import ClassCardStudent from '../components/ClassCardStudent';
import { useClass } from '../context/ClassContext';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import CreateClassModal from '../components/ClassForm';
import JoinClassModal from '../components/JoinClass';
import Loading from '../components/ui/Loading';
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";

function ClassPage() {
  const { getClasses, classes, isLoading, setClasses, isCreating } = useClass();
  const [showModal, setShowModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const { user } = useAuth();

  // PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState(0); // -1: izquierda, 1: derecha
  const itemsPerPage = 4;
  const totalPages = Math.ceil(classes.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentClasses = classes.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) {
      setDirection(-1);
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setDirection(1);
      setCurrentPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    setClasses([]);
    getClasses();
    console.log('classpage', classes)
    console.log('class page user', user)
  }, [user]);

  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-60px)] p-2">
      {isLoading || isCreating ? (
        <>{Loading(isLoading ? 'Cargando clases...' : 'Creando clase...')}</>
      ) : (
        <>
          {user && user.rol === 'teacher' ? (
            <>
              {/* DOCENTE */}
              <div className="relative w-[90%] h-[520px] flex justify-center items-center">
                {/* Flecha izquierda */}
                {currentPage > 1 && (
                  <button
                    onClick={handlePrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full  hover:bg-pastelYellow transition duration-150"
                  >
                    <HiOutlineChevronDoubleLeft className="text-3xl" />
                  </button>
                )}
                {/* Flecha derecha */}
                {currentPage < totalPages && (
                  <button
                    onClick={handleNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full  hover:bg-pastelYellow transition duration-150"
                  >
                    <HiOutlineChevronDoubleRight className="text-3xl" />
                  </button>
                )}

                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={currentPage}
                    custom={direction}
                    variants={{
                      enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
                      center: { x: 0, opacity: 1 },
                      exit: (dir) => ({ x: dir < 0 ? 300 : -300, opacity: 0 })
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="flex flex-wrap gap-10 absolute w-full h-full justify-center items-center"
                  >
                    <ClassCardTeacher classes={currentClasses} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* BOTÓN CREAR */}
              <div className="fixed bottom-8 right-8">
                <button
                  onClick={() => setShowModal(true)}
                  className="relative w-14 h-14 bg-blue-600 text-white rounded-full p-4 hover:bg-blue-700 transition duration-200 group"
                >
                  <FaPlus className="absolute left-5 bottom-5" />
                  <span className="absolute bottom-full mb-2 w-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100">
                    Crear una clase
                  </span>
                </button>
              </div>
              <CreateClassModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
              />
            </>
          ) : user && user.rol === 'student' ? (
            <>
              {/* ESTUDIANTE */}
              <div className="relative w-[90%] h-[520px] flex justify-center items-center">
                {/* Flecha izquierda */}
                {currentPage > 1 && (
                  <button
                    onClick={handlePrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full  hover:bg-pastelYellow transition duration-150"
                  >
                    <HiOutlineChevronDoubleLeft className="text-3xl" />
                  </button>
                )}
                {/* Flecha derecha */}
                {currentPage < totalPages && (
                  <button
                    onClick={handleNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full  hover:bg-pastelYellow transition duration-150"
                  >
                    <HiOutlineChevronDoubleRight className="text-3xl" />
                  </button>
                )}

                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={currentPage}
                    custom={direction}
                    variants={{
                      enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
                      center: { x: 0, opacity: 1 },
                      exit: (dir) => ({ x: dir < 0 ? 300 : -300, opacity: 0 })
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="flex flex-wrap gap-10 absolute w-full h-full justify-center items-center"
                  >
                    <ClassCardStudent classes={currentClasses} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* BOTÓN UNIRSE */}
              <div className="fixed bottom-8 right-8">
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="relative w-14 h-14 bg-blue-600 text-white rounded-full p-4 hover:bg-blue-700 transition duration-200 group"
                >
                  <FaPlus className="absolute left-5 bottom-5" />
                  <span className="absolute bottom-full mb-2 w-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100">
                    Unirse a una clase|
                  </span>
                </button>
              </div>
              <JoinClassModal
                isOpen={showJoinModal}
                onClose={() => setShowJoinModal(false)}
              />
            </>
          ) : null}
        </>
      )}
    </div>
  );
}

export default ClassPage;
