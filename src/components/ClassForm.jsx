import { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useClass } from '../context/ClassContext';
import { ErrorModal } from '../components/ui/ErrorModal'; // Importa el ErrorModal

function CreateClassModal({ isOpen, onClose }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createClass, getClasses, error, clearError } = useClass(); // Añade clearError desde el contexto
    const modalRef = useRef(null);

    const handleBackgroundClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleBackgroundClick);
        return () => {
            document.removeEventListener('mousedown', handleBackgroundClick);
        };
    }, []);

    const onSubmit = handleSubmit(async (data) => {
        try {
            await createClass(data);
            await getClasses();
            onClose();
        } catch (error) {
            console.error("Error al crear la clase:", error);
        }
    });

    if (!isOpen) return null;

    return (
        <>
            {/* Muestra el ErrorModal si hay un error */}
            {error && <ErrorModal error={error} clearError={clearError} />}

            {/* Fondo oscuro */}
            <div
                className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-50 z-50"
                onClick={handleBackgroundClick}
            ></div>

            {/* Contenedor del modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div
                    ref={modalRef}
                    className="bg-white p-8 rounded-lg shadow-[0px_7px_8px_-4px_rgba(0,0,0,0.53)] max-w-md w-full relative"
                >
                    <h2 className="text-xl mb-4">Crear una nueva clase</h2>
                    <form onSubmit={onSubmit}>
                        <label className="block mb-2">Nombre de la clase:</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            placeholder="Nombre de la clase"
                            {...register('name', { required: true })}
                        />
                        {errors.name && (
                            <span className="text-red-500">Este campo es requerido</span>
                        )}
                        <label className="block mb-2">Descripción de la clase:</label>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            placeholder="Descripción de la clase"
                            {...register('description', { required: true })}
                        ></textarea>
                        {errors.description && (
                            <span className="text-red-500">Este campo es requerido</span>
                        )}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-700 transition duration-300"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition duration-300"
                            >
                                Crear
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default CreateClassModal;
