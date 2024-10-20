import { useEffect, useState } from 'react';
import ClassCardTeacher from '../components/ClassCardTeacher';
import ClassCardStudent from '../components/ClassCardStudent';
import { useClass } from '../context/ClassContext';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import CreateClassModal from '../components/ClassForm';
import JoinClassModal from '../components/JoinClass';
import Loading from '../components/ui/Loading';

function ClassPage() {
    const { getClasses, classes, isLoading, setClasses, isCreating } = useClass();
    const [showModal, setShowModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        setClasses([]);
        getClasses();
    }, [user]);


    return (
        <div className='flex justify-center  h-[500px]'>
            {/* Mostrar el loading si estamos cargando las clases o creando una nueva clase */}
            {isLoading  || isCreating ? (
                <>
                    {Loading(isLoading ? 'Cargando clases...' : 'Creando clase...')}
                </>
            ) : (
                <>
                    {user && user.rol === 3 ? (
                        <>
                            <div className="flex justify-center">
                                <ClassCardTeacher classes={classes} />
                            </div>
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
                    ) : user && user.rol === 2 ? (
                        <>
                            <div className="flex justify-center">
                                <ClassCardStudent classes={classes} />
                            </div>
                            <div className="fixed bottom-8 right-8">
                                <button
                                    onClick={() => setShowJoinModal(true)}
                                    className="relative w-14 h-14 bg-blue-600 text-white rounded-full p-4 hover:bg-blue-700 transition duration-200 group"
                                >
                                    <FaPlus className="absolute left-5 bottom-5" />
                                    <span className="absolute bottom-full mb-2 w-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100">
                                        Unirse a una clase
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
