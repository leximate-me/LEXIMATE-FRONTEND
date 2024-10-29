import React, { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  });

  const { user } = useAuth();
  console.log('user', user);

  const [avatar, setAvatar] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log("Datos guardados:", userData);
    console.log("Avatar guardado:", avatar);
  };

  return (
    <div className="flex items-start justify-center min-h-[calc(100vh_-_65px)] p-2">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] border border-gray-200 dark:bg-[#1a1a1a]">
        <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800 dark:text-white">Configurar Perfil</h2>
        <div className="space-y-4">
          {/* Avatar */}
          <div className="relative flex flex-col items-center ">
            <div className="w-32 h-32 mb-4 overflow-hidden bg-gray-300 rounded-full">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="object-cover w-full h-full" />
              ) : (
                <span className="flex items-center justify-center w-full h-full text-gray-700">Sin imagen</span>
              )}
            </div>
            {/* Botón de editar */}
            <label className="relative bottom-11 left-7 bg-gray-300 p-3 border-4 border-white dark:border-[#1a1a1a] rounded-full cursor-pointer hover:bg-gray-400 transition-all duration-200">
              <FiEdit2 className="text-gray-600" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden" // Escondemos el input
              />
            </label>
          </div>

          {/* Formulario de datos de usuario */}
          <div>
            <label className="block mb-1 text-gray-600 dark:text-white">Nombre</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600 dark:text-white">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600 dark:text-white">Teléfono</label>
            <input
              type="text"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600 dark:text-white">Dirección</label>
            <input
              type="text"
              name="address"
              value={userData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600 dark:text-white">Biografía</label>
            <textarea
              name="bio"
              value={userData.bio}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            ></textarea>
          </div>
          <button
            onClick={handleSave}
            className="w-full py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all duration-200"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
