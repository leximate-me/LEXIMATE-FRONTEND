import { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useClass } from '../context/ClassContext';

function CreateClassModal({ isOpen, onClose }) {
    const { register, handleSubmit, formState: { errors } } = useForm();

    // Accedemos a las funciones createClass y getClasses desde el contexto
    const { createClass, getClasses, isCreating } = useClass();

    const modalRef = useRef(null);

    const handleBackgroundClick = (event) => {
        // Cierra el modal solo si el clic ocurre fuera del contenedor del modal
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleBackgroundClick);

        // Limpia el evento cuando el componente se desmonte
        return () => {
            document.removeEventListener('mousedown', handleBackgroundClick);
        };
    }, []);

    // Función para manejar el envío del formulario
    const onSubmit = handleSubmit(async (data) => {
        try {
            await createClass(data);  // Crea la clase en el backend
            await getClasses();       // Recarga las clases
            onClose();                // Cierra el modal
        } catch (error) {
            console.error("Error al crear la clase:", error);
        }
    });

    // Si el modal no está abierto, no se renderiza nada
    if (!isOpen) return null;

    return (
        <>
            {/* Fondo oscuro */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={handleBackgroundClick} // Cierra el modal al hacer clic fuera del contenedor
            ></div>

            {/* Contenedor del modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div
                    ref={modalRef}
                    className="bg-white p-8 rounded-lg shadow-[0px_7px_8px_-4px_rgba(0,0,0,0.53)] max-w-md w-full relative"
                >
                    <h2 className="text-xl mb-4">Crear una nueva clase</h2>
                    <form onSubmit={onSubmit}>
                        {/* Campo para el nombre de la clase */}
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
                        {/* Campo para la descripción de la clase */}
                        <label className="block mb-2">Descripción de la clase:</label>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            placeholder="Descripción de la clase"
                            {...register('description', { required: true })}
                        ></textarea>
                        {errors.description && (
                            <span className="text-red-500">Este campo es requerido</span>
                        )}
                        {/* Botones para cancelar o enviar */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={onClose}  // Botón para cerrar el modal sin enviar
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
