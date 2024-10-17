import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ButtonLink } from './ui/ButtonLink';
import ToggleTheme from './ToggleTheme';
import logo from '../assets/logo-leximate.png';

function NavBar() {
  const { isAuthenticated, logOut } = useAuth();
  const location = useLocation();

  // Estado para controlar el menú desplegable
  const [isOpen, setIsOpen] = useState(false);

  // Función para alternar el menú desplegable
  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <header
      id="navbar"
      className="relative top-0 left-0 right-0 z-50 flex flex-col md:flex-row items-center justify-between whitespace-nowrap border-b border-solid transition duration-300 dark:border-b-[#fffd92] px-10 py-3 bg-[#f8f40c] dark:bg-[#1a1a1a]"
    >
      {/* LOGO Y TITULO DE LA NAVBAR */}
      <Link to="/">
        <div className="flex items-center gap-4 text-[#181811]">
          <div className="size-4 w-10 h-10">
            <img
              src={logo}
              alt="Descripción de la imagen"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-[#181811] text-lg font-bold leading-tight tracking-[-0.015em] dark:text-[#fffd92]">
            LexiMate
          </h2>
        </div>
      </Link>

      {/* NAVBAR CON SESIÓN INICIADA */}
      {isAuthenticated ? (
        <div className="flex flex-col items-center md:flex-row flex-1">
          {/* Botón hamburguesa para pantallas pequeñas */}
          <div className="md:hidden">
            <button
              onClick={toggleDropdown}
              className="flex items-center px-3 py-2 text-[#181811] border-[#181811]"
            >
              <svg
                className="fill-current h-7 w-7"
                viewBox="0 0 100 80"
                width="30"
                height="30"
              >
                <rect width="100" height="20"></rect>
                <rect y="30" width="100" height="20"></rect>
                <rect y="60" width="100" height="20"></rect>
              </svg>
            </button>
          </div>

          {/* OPCIONES DE LA NAVBAR */}
          <div
            className={`w-full flex flex-col justify-center gap-8 md:gap-20 md:flex-row items-center order-2 md:order-1 ${
              isOpen ? 'flex' : 'hidden'
            } md:flex`}
          >
            <Link
              className="text-[#181811] text-md font-bold leading-normal hover:border-b-2 border-black"
              to="/home"
            >
              Inicio
            </Link>
            <Link
              className="text-[#181811] text-md font-bold leading-normal hover:border-b-2 border-black"
              to="/featured"
            >
              Más destacados
            </Link>
            <Link
              className="text-[#181811] text-md font-bold leading-normal hover:border-b-2 border-black"
              to="/classes"
            >
              Clases
            </Link>
            <Link
              className="text-[#181811] text-md font-bold leading-normal hover:border-b-2 border-black"
              to="/games"
            >
              Juegos interactivos
            </Link>
            <Link
              className="text-[#181811] text-md font-bold leading-normal hover:border-b-2 border-black"
              to="/"
              onClick={() => {
                logOut();
              }}
            >
              Cerrar Sesión
            </Link>
          </div>

          {/* BOTONES DE LA NAVBAR */}
          <div
            className={`flex items-center gap-2 order-1 md:order-2 mb-4 md:mb-0 ${
              isOpen ? 'flex' : 'hidden'
            } md:flex`}
          >
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#f5f5f0] text-[#181811] gap-2 text-md font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
              <div
                className="text-[#181811]"
                data-icon="Bookmark"
                data-size="20px"
                data-weight="regular"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  height="20px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,16V161.57l-51.77-32.35a8,8,0,0,0-8.48,0L72,161.56V48ZM132.23,177.22a8,8,0,0,0-8.48,0L72,209.57V180.43l56-35,56,35v29.14Z"></path>
                </svg>
              </div>
            </button>
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#f5f5f0] text-[#181811] gap-2 text-md font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
              <div
                className="text-[#181811]"
                data-icon="Chat"
                data-size="20px"
                data-weight="regular"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  height="20px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M216,48H40A16,16,0,0,0,24,64V224a15.84,15.84,0,0,0,9.25,14.5A16.05,16.05,0,0,0,40,240a15.89,15.89,0,0,0,10.25-3.78.69.69,0,0,0,.13-.11L82.5,208H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48ZM40,224h0ZM216,192H82.5a16,16,0,0,0-10.3,3.75l-.12.11L40,224V64H216Z"></path>
                </svg>
              </div>
            </button>
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#f5f5f0] text-[#181811] gap-2 text-md font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
              <div
                className="text-[#181811]"
                data-icon="Bell"
                data-size="20px"
                data-weight="regular"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  height="20px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
                </svg>
              </div>
            </button>
          </div>

          {/* PERFIL NAVBAR */}
          <div
            className={`bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ${
              isOpen ? 'block' : 'hidden'
            } md:block`}
          ></div>
        </div>
      ) : (
        <>
          {location.pathname !== '/login' && (
            <div
              className="
            flex flex-col md:flex-row items-center gap-4 md:gap-8 order-2 md:order-1
            "
            >
              <ButtonLink to="/login" className='dark:bg-[#1a1a1a] dark:text-[#fffd92]'>Iniciar Sesion</ButtonLink>
            </div>
          )}
        </>
      )}

      {/* Botón de alternar tema */}
      <div className="m-5">{ToggleTheme()}</div>
    </header>
  );
}

export default NavBar;
