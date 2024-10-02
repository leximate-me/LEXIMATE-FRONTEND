import { useForm } from 'react-hook-form';
import { useClass } from '../context/ClassContext';

function JoinClassModal({ isOpen, onClose }) {
    const { register, handleSubmit, formState:{ errors } } = useForm();

    // Accedemos a las funciones createClass y getClasses desde el contexto
    const { joinClass, getClasses } = useClass();

    // Función para manejar el envío del formulario
    const onSubmit = handleSubmit(async (data) => {
        try {
            // Llamada a la función joinClass para hacer el POST al backend
            await joinClass(data);
            
            // Recargar las clases desde el backend después de crear una nueva clase
            await getClasses();

            // Cerrar el modal
            onClose();
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
                onClick={onClose} // Cierra el modal cuando haces clic en el fondo oscuro
            ></div>

            {/* Contenedor del modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-[0px_7px_8px_-4px_rgba(0,0,0,0.53)] max-w-md w-full relative">
                    <h2 className="text-xl mb-4">Unirse a una clase</h2>

                    <form onSubmit={onSubmit}>

                        {/* Campo para el nombre de la clase */}
                        <label className="block mb-2">Código de la clase</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            placeholder="Código"
                            {...register('classCode', { required: true })} // Asegurarse de que sea requerido
                        />
                        {errors.name && (
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
                                Unirse
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default JoinClassModal;
