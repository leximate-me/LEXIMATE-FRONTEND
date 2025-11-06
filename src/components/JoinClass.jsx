import { useForm } from 'react-hook-form';
import { useClass } from '../context/ClassContext';
import { useState } from 'react';
import { Riple } from 'react-loading-indicators';
import { ErrorModal } from './ui/ErrorModal';

function JoinClassModal({ isOpen, onClose }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { joinClass, getClasses } = useClass();
    const [isJoining, setIsJoining] = useState(false);
    const [error, setError] = useState(null); // Estado para manejar el error

    const onSubmit = handleSubmit(async (data) => {
        setIsJoining(true);
        try {
            await joinClass(data);
            await getClasses();
            onClose();
        } catch (error) {
            console.error("Error al unirse a la clase:", error);
            setError('Error al unirse a la clase');
        } finally {
            setIsJoining(false);
        }
    });

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-50 z-50"
                onClick={onClose}
            ></div>

            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-[0px_7px_8px_-4px_rgba(0,0,0,0.53)] max-w-md w-full relative">
                    <h2 className="text-xl mb-4">Unirse a una clase</h2>

                    <form onSubmit={onSubmit}>
                        {isJoining ? (
                            <div className="flex justify-center">
                                <Riple color="#cec702" size="large" />
                            </div>
                        ) : (
                            <>
                                <label className="block mb-2">Código de la clase</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded mb-4"
                                    placeholder="Código"
                                    {...register('classCode', { required: true })}
                                />
                                {errors.classCode && (
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
                                        Unirse
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>

            {error && (
                <ErrorModal
                    error={error}
                    onClose={() => setError(null)} // Cerrar el modal de error
                />
            )}
        </>
    );
}

export default JoinClassModal;