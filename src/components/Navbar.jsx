import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ToggleTheme from './ToggleTheme';
import logo from '../assets/logo-leximate.png';
import HighlightLetter from './ui/HighlightLetter';
import { FaUser } from 'react-icons/fa';
import { Bot } from 'lucide-react';
import ChatbotModal from './ChatBotModal';

function NavBar() {
  const { isAuthenticated, logOut, user, getProfile, profile } = useAuth();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dropdownRef = useRef(null);
  const profileButtonRef = useRef(null);

  const [showChatbot, setShowChatbot] = useState(false);

  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  useEffect(() => {
    const getProfileData = async () => {
      if (isAuthenticated && !isProfileLoaded) {
        try {
          await getProfile();
          setIsProfileLoaded(true);
        } catch (error) {
          console.error('Error getting profile:', error);
        }
      }
    };
    getProfileData();
  }, [isAuthenticated, isProfileLoaded, getProfile]);


  const handleOutsideClick = (event) => {
    // Verifica si el clic ocurrió fuera tanto del dropdown como del botón de perfil
    if (
      isProfileOpen &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      profileButtonRef.current &&
      !profileButtonRef.current.contains(event.target)
    ) {
      setIsProfileOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isProfileOpen]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <>
      <header
        id="navbar"
        className="fixed top-0 left-0 right-0 z-50 w-full flex flex-col md:flex-row items-center backdrop-blur-sm justify-between whitespace-nowrap bg-pastelYellow/70 py-3 border-b-2 border-[#F7D654]"
      >
        {/* LOGO Y BOTÓN DE MENÚ */}
        <div className="flex items-center justify-between w-full md:w-fit px-5 z-50">
          {isAuthenticated ? (
            <>
              <Link to="/classes">
                <div className="flex items-center gap-4 text-[#181811] dark:text-[#fffd92]">
                  <div className="size-4 w-10 h-10">
                    <img
                      src={logo}
                      alt="Descripción de la imagen"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <HighlightLetter color="green" className='font-opendyslexic font-bold' size='text-2xl'>
                    LexiMate
                  </HighlightLetter>
                </div>
              </Link></>
          ) : (
            <>
              <Link to="/">
                <div className="flex items-center gap-4 text-[#181811] dark:text-[#fffd92]">
                  <div className="size-4 w-10 h-10">
                    <img
                      src={logo}
                      alt="Descripción de la imagen"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <HighlightLetter color="green" className='font-opendyslexic font-bold' size='text-2xl'>
                    LexiMate
                  </HighlightLetter>
                </div>
              </Link>
            </>
          )}

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
            </button>
          )}
        </div>

        {/* NAVBAR CON SESIÓN INICIADA */}
        {isAuthenticated ? (
          <div className="flex flex-col-reverse items-center md:flex-row flex-1 md:justify-end">
            {/* Opciones de la Navbar */}
            <div
              className={`md:absolute w-full flex flex-col justify-center gap-8 md:gap-20 md:flex-row items-center order-2 md:order-1 ${isOpen ? 'flex' : 'hidden'
                } md:flex`}
            >
              <Link
                className="text-md font-bold leading-normal hover:border-b-2 border-black dark:text-[#fffd92] dark:hover:border-b-[#fffd92]"
                to="/classes"
              >
                <HighlightLetter color="blue" className='font-opendyslexic' size='text-xl'>
                  Clases
                </HighlightLetter>
              </Link>
              {/* <Link
              className="text-md font-bold leading-normal hover:border-b-2 border-black dark:text-[#fffd92] dark:hover:border-b-[#fffd92]"
              to="/games"
            >
              Juegos interactivos
            </Link> */}
            </div>

            {/* Botones de la Navbar */}
            <div
              className={`z-50 flex-col-reverse md:flex-row items-center gap-5 order-1 md:order-2 mt-3 md:m-0 ${isOpen ? 'flex' : 'hidden'
                } md:flex px-5`}
            >
              <div className="flex flex-col gap-5 md:flex-row items-center">
                <div className="flex gap-2 px-3">
                  <div className='w-fit h-fit relative rounded-full cursor-pointer'>
                    <button onClick={() => setShowChatbot(!showChatbot)}>
                      <Bot className="w-11 h-11 text-gray-700 border border-gray-700 rounded-full p-2 hover:bg-gray-700 hover:text-white transition duration-300" />
                    </button>
                  </div>
                  {/* Botón de perfil */}
                  <div
                    ref={profileButtonRef}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-fit h-fit relative rounded-full cursor-pointer"
                  >
                    {profile && profile.avatar ? (
                      <img
                        src={profile.avatar.file_url}
                        alt="Avatar del usuario"
                        className="w-10 h-10 rounded-full object-cover border border-gray-500"
                      />
                    ) : (
                      <FaUser className="w-11 h-11 text-gray-700 border border-gray-700 rounded-full p-2 hover:bg-gray-700 hover:text-white transition duration-300" />
                    )}

                    {/* Contenedor de opciones de perfil */}
                    <div
                      ref={dropdownRef}
                      className={`absolute right-8 top-12 mt-2 w-fit flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 transition-all duration-300 ease-out transform ${isProfileOpen
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-95 pointer-events-none'
                        }`}
                    >
                      <Link to="/profile">
                        <p className="text-black dark:text-white dark:hover:bg-gray-700 hover:bg-gray-100 p-3 rounded-lg transition-all duration-200">
                          Configuración del perfil
                        </p>
                      </Link>
                      <button
                        onClick={logOut}
                        className="text-red-500 dark:hover:bg-gray-700 hover:bg-gray-100 p-3 rounded-lg transition-all duration-200"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                </div>

                {/* <div className="flex items-center justify-center px-3">
                <ToggleTheme />
              </div> */}
              </div>
            </div>
          </div>
        ) : (
          <>
            {location.pathname !== '/login' && (
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8 order-2 md:order-1 px-4">
                <Link to='/login'>
                  <button className="px-3 py-2 border-4 border-[#2d4654] text-[#2d4654] rounded-2xl hover:bg-[#2d4654] hover:text-white transition-all">
                    <HighlightLetter color="blue" className='font-opendyslexic font-bold' size='text-xl'>
                      Iniciar Sesión
                    </HighlightLetter>
                  </button>
                </Link>
                {/* <div className="flex items-center justify-center">
                <ToggleTheme />
              </div> */}
              </div>
            )}
          </>
        )}
      </header>
      {showChatbot && <ChatbotModal onClose={() => setShowChatbot(false)} />} 
    </>
  );
}

export default NavBar;
