import { useState, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { MdCloudUpload } from "react-icons/md";

export default function FileInput({ register, errors, setValue }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    // Guardar en react-hook-form
    setValue("file", e.dataTransfer.files, { shouldValidate: true });

    // Actualizar input real
    fileInputRef.current.files = e.dataTransfer.files;
    setFileName(file.name);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setValue("file", e.target.files, { shouldValidate: true });
    setFileName(file.name);
  };

  const handleRemove = () => {
    setFileName("");
    setValue("file", null, { shouldValidate: true });
    fileInputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <div
        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
          transition ${isDragging ? "bg-blue-50 border-blue-500" : "bg-gray-50 border-gray-300 hover:bg-gray-100"} p-4`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <MdCloudUpload className="text-4xl text-gray-600 mb-2" />
        <p className="text-sm text-gray-600 text-center">
          <span className="font-semibold">Haz clic</span> o arrastra un archivo aquí
        </p>
        {fileName && (
          <div className="mt-2 flex justify-between w-full border-2  p-1 border-gray-400 rounded-lg">
            <p className="text-xs text-gray-500 flex items-center justify-center truncate">{fileName}</p>
            <button
              type="button"
              onClick={handleRemove}
              className="text-red-600 hover:text-red-800 text-lg"
            >
              <IoClose />
            </button>
          </div>
        )
        }
      </div>

      <input
        type="file"
        className="hidden"
        {...register("file", { required: true })}
        ref={fileInputRef}
        onChange={handleChange}
      />

      {errors.file && (
        <span className="text-red-500 text-sm">Este campo es requerido</span>
      )}
    </div>
  );
}
