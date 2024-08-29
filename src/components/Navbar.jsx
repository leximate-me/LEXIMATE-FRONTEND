import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ToggleTheme from './ToggleTheme';
import logo from '../assets/logo-leximate.png';

function NavBar() {
  const { isAuthenticated, logOut } = useAuth();

  const location = useLocation();

  return (
    <header
      id="navbar"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f5f5f0] px-10 py-3"
      style={{ backgroundColor: '#f8f40c' }}
    >
      {/* LOGO Y TITULO DE LA NAVBAR */}
      <Link to='/'>
        <div className="flex items-center gap-4 text-[#181811]">
          <div className="size-4 w-10 h-10">
            <img
              src={logo}
              alt="Descripción de la imagen"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-[#181811] text-lg font-bold leading-tight tracking-[-0.015em]">
            LexiMate
          </h2>
        </div>
      </Link>

      {isAuthenticated ? (
        <>
          {/* OPCIONES DE LA NAVBAR */}
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <Link
                className="text-[#181811] text-sm font-bold leading-normal"
                to="#home"
              >
                Inicio
              </Link>
              <Link
                className="text-[#181811] text-sm font-bold leading-normal"
                to="#featured"
              >
                Más destacados
              </Link>
              <Link
                className="text-[#181811] text-sm font-bold leading-normal"
                to="#tasks"
              >
                Clases
              </Link>
              <Link
                className="text-[#181811] text-sm font-bold leading-normal"
                to="#games"
              >
                Juegos interactivos
              </Link>
              <Link
                className="text-[#181811] text-sm font-bold leading-normal"
                to="/tasks"
              >
                tareas
              </Link>

              <Link
                to="/tasks/new"
                className="text-[#181811] text-sm font-bold leading-normal"
              >
                Add Task
              </Link>

              <Link
                className="text-[#181811] text-sm font-bold leading-normal"
                to="/"
                onClick={() => {
                  logOut();
                }}
              >
                logout
              </Link>
            </div>

            {/* BOTONES DE LA NAVBAR */}
            <div className="flex gap-2">
              <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#f5f5f0] text-[#181811] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
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
              <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#f5f5f0] text-[#181811] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
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
              <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#f5f5f0] text-[#181811] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
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
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"></div>
          </div>
        </>
      ) : (
        <>
          {location.pathname !== '/login' && (
            <Link
              className="text-[#181811] text-sm font-bold leading-normal"
              to="/login"
            >
              Login
            </Link>
          )}
          {location.pathname !== '/register' && (
            <Link
              className="text-[#181811] text-sm font-bold leading-normal"
              to="/register"
            >
              Register
            </Link>
          )}
        </>
      )}

      {ToggleTheme()}

    </header>
  );
}

export default NavBar;
