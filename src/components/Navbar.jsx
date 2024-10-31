import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ButtonLink } from './ui/ButtonLink';
import ToggleTheme from './ToggleTheme';
import logo from '../assets/logo-leximate.png';
import defaultProfile from '../assets/default-profile.png';
import { HiUser, HiAnnotation, HiBell } from "react-icons/hi";

function NavBar() {
  const { isAuthenticated, logOut } = useAuth();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const dropdownRef = useRef(null);

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsProfileOpen(false);
    }
  };

  useEffect(() => {
    // Agrega el evento de clic en el documento
    document.addEventListener('mousedown', handleOutsideClick);

    // Limpia el evento cuando el componente se desmonte
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <header
      id="navbar"
      className="sticky top-0 left-0 right-0 z-50 flex flex-col md:flex-row items-center justify-between whitespace-nowrap border-b border-solid transition duration-300 dark:border-b-[#fffd92] py-3 bg-[#f8f40c] dark:bg-[#1a1a1a]"
    >
      {/* LOGO Y BOTÓN DE MENÚ */}
      <div className="flex items-center justify-between w-full md:w-fit px-5 z-50">
        <Link to="/classes">
          <div className="flex items-center gap-4 text-[#181811] dark:text-[#fffd92]">
            <div className="size-4 w-10 h-10">
              <img
                src={logo}
                alt="Descripción de la imagen"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">
              LexiMate
            </h2>
          </div>
        </Link>

        {/* Botón de menú hamburguesa */}
        {isAuthenticated && (
          <button
            onClick={toggleDropdown}
            className="flex items-center px-3 py-2 text-[#181811] dark:text-[#fffd92] md:hidden"
          >
            <svg className="fill-current h-7 w-7" viewBox="0 0 100 80" width="30" height="30">
              <rect width="100" height="15"></rect>
              <rect y="30" width="100" height="15"></rect>
              <rect y="60" width="100" height="15"></rect>
            </svg>
          </button>)
        }

      </div>

      {/* NAVBAR CON SESIÓN INICIADA */}
      {isAuthenticated ? (

        <div className="flex flex-col-reverse items-center md:flex-row flex-1 md:justify-end">
          {/* Opciones de la Navbar */}
          <div
            className={`md:absolute w-full flex flex-col justify-center gap-8 md:gap-20 md:flex-row items-center order-2 md:order-1 ${isOpen ? 'flex' : 'hidden'
              } md:flex`}
          >

            <Link className="text-md font-bold leading-normal hover:border-b-2 border-black dark:text-[#fffd92] dark:hover:border-b-[#fffd92]" to="/classes">
              Clases
            </Link>
            <Link className="text-md font-bold leading-normal hover:border-b-2 border-black dark:text-[#fffd92] dark:hover:border-b-[#fffd92]" to="/games">
              Juegos interactivos
            </Link>
          </div>

          {/* Botones de la Navbar */}
          <div
            className={`z-50 flex-col-reverse md:flex-row items-center gap-5 order-1 md:order-2 mt-3 md:m-0 ${isOpen ? 'flex' : 'hidden'
              } md:flex px-5`}
          >
            <div className="flex items-center justify-center">
              <ToggleTheme />
            </div>

            <div className='flex gap-2 items-center'>

              <div>

                <div
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-fit p-1 cursor-pointer rounded-full hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-600 transition-all duration-200">

                  <HiUser className='text-3xl' />

                </div>


                <div
                  ref={dropdownRef}
                  className={`absolute right-10 mt-2 w-fit flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 transition-all duration-300 ease-out transform ${isProfileOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                    }`}>
                  <Link to='/profile'>
                    <p className="text-black dark:text-white dark:hover:hover:bg-gray-700 hover:bg-gray-100 p-3 rounded-lg transition-all duration-200">Configuración del perfíl</p>
                  </Link>
                  <button onClick={logOut} className="text-red-500 dark:hover:hover:bg-gray-700 hover:bg-gray-100 p-3 rounded-lg transition-all duration-200  ">Cerrar sesión</button>
                </div>

              </div>

              <div
                className="w-fit p-1 cursor-pointer rounded-full hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-600 transition-all duration-200">

                <HiAnnotation className='text-3xl' />

              </div>

              <div
                className="w-fit p-1 cursor-pointer rounded-full hover:bg-gray-300 hover:bg-opacity-60 dark:hover:bg-gray-600 transition-all duration-200">

                <HiBell className='text-3xl' />

              </div>

            </div>
          </div>

        </div>
      ) : (
        <>
          {location.pathname !== '/login' && (
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 order-2 md:order-1 px-5">
              <ButtonLink to="/login" className="dark:bg-[#1a1a1a] dark:text-[#fffd92]">Iniciar Sesión</ButtonLink>
              <div className="flex items-center justify-center">
                <ToggleTheme />
              </div>
            </div>

          )}
        </>
      )}
    </header>
  );
}

export default NavBar;
