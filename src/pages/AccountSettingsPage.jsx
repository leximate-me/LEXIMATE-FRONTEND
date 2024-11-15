import React, { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import swal from "sweetalert";
import Loading from "../components/ui/Loading";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, updateUser, profile } = useAuth();

  // Estado inicial para los datos de usuario
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    user_name: "",
    file: null,  // Avatar
  });

  // Vista previa de la imagen cargada
  const [previewAvatar, setPreviewAvatar] = useState(null);

  useEffect(() => {
    if (profile) {
      setUserData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        user_name: profile.user_name || "",
        file: null,
      });
      setPreviewAvatar(profile?.avatar?.file_url || null); // Inicializa la vista previa con la imagen actual
      setLoading(false);
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData({ ...userData, file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);  // Actualiza la vista previa con la imagen seleccionada
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("first_name", userData.first_name);
      formData.append("last_name", userData.last_name);
      formData.append("user_name", userData.user_name);
      if (userData.file) {
        formData.append("file", userData.file);
      }
      setIsUpdating(true);
      await updateUser(formData);
      setIsUpdating(false);
      swal({
        title: "Datos actualizados correctamente",
        text: "Tu perfil ha sido actualizado con éxito.",
        icon: "success",
      });

    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      swal({
        title: "Error",
        text: "Hubo un problema al actualizar tu perfil.",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || isUpdating) {
    return (
      <div className="h-[500px] flex justify-center items-center">
        {Loading(loading ? "Cargando datos del perfil..." : "Actualizando perfil...")}
      </div>
    );
  }

  return (
    <div className="flex items-start justify-center min-h-[calc(100vh_-_65px)] p-4">
      <div className="w-full h-fit max-w-lg p-4 bg-white rounded-lg shadow-md border border-gray-400 dark:border-[#fffd92] dark:bg-[#1a1a1a]">
        <h2 className="mb-4 text-xl font-semibold text-center text-gray-800 dark:text-white">
          Configurar Perfil
        </h2>
        <div>
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 mb-2 overflow-hidden border border-gray-400 rounded-full">
              {/* Mostrar imagen subida o la imagen actual */}
              {previewAvatar ? (
                <img
                  src={previewAvatar}
                  alt="Avatar"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="flex items-center justify-center w-full h-full text-gray-700">
                  Sin imagen
                </span>
              )}
            </div>
            {/* Botón de editar */}
            <label className="relative bottom-8 left-5 bg-gray-300 p-2 border-4 border-white dark:border-[#1a1a1a] rounded-full cursor-pointer hover:bg-gray-400 transition-all duration-200">
              <FiEdit2 className="text-gray-600" />
              <input
                type="file"
                accept="image/*"
                name="file"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Formulario de datos de usuario */}
          <div className="flex gap-5 mt-4">
            <div className="mb-2 w-1/2">
              <label className="block mb-1 text-sm text-gray-600 dark:text-white">
                Nombre
              </label>
              <input
                type="text"
                name="first_name"
                value={userData.first_name}
                placeholder={profile.person.first_name || "Nombre"}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="mb-2 w-1/2">
              <label className="block mb-1 text-sm text-gray-600 dark:text-white">
                Apellido
              </label>
              <input
                type="text"
                name="last_name"
                value={userData.last_name}
                placeholder={profile.person.last_name || "Apellido"}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
          <div className="mb-2">
            <label className="block mb-1 text-sm text-gray-600 dark:text-white">
              Nombre de Usuario
            </label>
            <input
              type="text"
              name="user_name"
              value={userData.user_name}
              placeholder={profile.user_name || "Nombre de Usuario"}
              onChange={handleChange}
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className={`w-full py-2 mt-3 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all duration-200 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
