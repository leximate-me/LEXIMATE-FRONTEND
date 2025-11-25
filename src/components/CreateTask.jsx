import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useTask } from "../context/TasksContext";
import { useRef, useEffect } from "react";
import { ErrorModal } from "./ui/ErrorModal";
import FileInput from "./ui/FileInput";

function CreateTaskModal({ isOpen, onClose }) {
  const { courseId: classId } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // Accedemos a las funciones createTask y getTasks desde el contexto
  const { createTask, getTasks, error, clearError } = useTask();

  const modalRef = useRef(null);

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    // Agrega el evento de clic en el documento
    document.addEventListener("mousedown", handleOutsideClick);

    // Limpia el evento cuando el componente se desmonte
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Función para manejar el envío del formulario
  const onSubmit = handleSubmit(async (data) => {
    console.log('formdata', data)
    try {
      const formData = new FormData();
      formData.append("title", data.name);
      formData.append("description", data.description);
      formData.append("due_date", data.dueDate);
      formData.append("file", data.file[0]);
      
      await createTask(formData, classId);
      await getTasks(classId);
      onClose();
    } catch (error) {
      console.error("Error al crear la tarea:", error);
    }
  });

  // Si el modal no está abierto, no se renderiza nada
  if (!isOpen) return null;

  return (
    <>
      {error && <ErrorModal error={error} clearError={clearError} />}
      {/* Fondo oscuro */}
      <div
        className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-50 z-50 flex items-center justify-center"
        onClick={onClose} // Cierra el modal cuando haces clic en el fondo oscuro
      >
        {/* Contenedor del modal */}
        <div
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-8 rounded-lg shadow-[0px_7px_8px_-4px_rgba(0,0,0,0.53)] max-w-md w-full relative"
        >
          <h2 className="text-xl mb-4">Crear una nueva tarea</h2>
          <form onSubmit={onSubmit}>
            {/* Campo para el nombre de la tarea */}
            <label className="block mb-2">Nombre de la tarea:</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Nombre de la tarea"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <span className="text-red-500">Este campo es requerido</span>
            )}
            {/* Campo para la descripción de la tarea */}
            <label className="block mb-2">Descripción de la tarea:</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Descripción de la tarea"
              {...register("description", { required: true })}
            ></textarea>
            {errors.description && (
              <span className="text-red-500">Este campo es requerido</span>
            )}
            {/* Campo para la fecha de entrega */}
            <label className="block mb-2">Fecha de entrega:</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              {...register("dueDate", { required: true })}
            />
            {errors.dueDate && (
              <span className="text-red-500">Este campo es requerido</span>
            )}
            {/* Campo para cargar archivo */}
            <label className="block mb-2">Cargar archivo:</label>
            <FileInput register={register} setValue={setValue} />
            {/* Botones para cancelar o enviar */}
            <div className="flex justify-end mt-2">
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

export default CreateTaskModal;
