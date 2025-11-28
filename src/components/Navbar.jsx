import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo-leximate.png";
import HighlightLetter from "./ui/HighlightLetter";
import { FaUser } from "react-icons/fa";
import { Bot, BellIcon, Send } from "lucide-react";
import ChatbotModal from "./ChatBotModal";
import NotificationDropdown from "./NotificationDropdown";
import ChatWindow from "./chat/ChatWindow";
import { useNotifications } from "../hooks/useNotifications";
import { useChat } from "../context/ChatContext";

function NavBar() {
  const { isAuthenticated, logOut, user, getProfile, profile } = useAuth();
  const location = useLocation();
  const { unreadCount } = useNotifications();
  const { toggleChat, totalUnreadCount } = useChat();

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [localUnreadCount, setLocalUnreadCount] = useState(unreadCount);

  const dropdownRef = useRef(null);
  const profileButtonRef = useRef(null);

  // Obtener perfil al cargar
  useEffect(() => {
    const getProfileData = async () => {
      if (isAuthenticated && !isProfileLoaded) {
        try {
          await getProfile();
          setIsProfileLoaded(true);
        } catch (error) {
          console.error("Error getting profile:", error);
        }
      }
    };
    getProfileData();
  }, [isAuthenticated, isProfileLoaded, getProfile]);

  // Actualizar contador local cuando cambie unreadCount del hook
  useEffect(() => {
    setLocalUnreadCount(unreadCount);
  }, [unreadCount]);

  // Cerrar dropdown de perfil al hacer click afuera
  const handleOutsideClick = (event) => {
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
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isProfileOpen]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Manejo de campanita
  const handleNotificationsToggle = () => {
    setShowNotifications(prev => !prev);
  };

  // Función para resetear badge cuando se leen todas las notificaciones
  const handleReadAll = () => {
    setLocalUnreadCount(0);
  };

  const handleRead = () => {
    if (localUnreadCount > 0) {
      setLocalUnreadCount(localUnreadCount - 1);
    }
  };

  console.log('navbar', user)

  return (
    <>
      <header
        id="navbar"
        className="fixed top-0 left-0 right-0 z-50 w-full flex flex-col md:flex-row items-center backdrop-blur-sm justify-between whitespace-nowrap bg-pastelYellow/70 py-3 border-b-2 border-[#F7D654]"
      >
        {/* LOGO Y MENÚ */}
        <div className="flex items-center justify-between w-full md:w-fit px-5 z-50">
          <Link to={isAuthenticated ? "/courses" : "/"}>
            <div className="flex items-center gap-4 text-[#181811] dark:text-[#fffd92]">
              <div className="size-4 w-10 h-10">
                <img src={logo} alt="Logo LexiMate" className="w-full h-full object-cover" />
              </div>
              <HighlightLetter color="green" className="font-opendyslexic font-bold" size="text-2xl">
                LexiMate
              </HighlightLetter>
            </div>
          </Link>
          {isAuthenticated && (
            <button onClick={toggleDropdown} className="flex items-center px-3 py-2 text-[#181811] dark:text-[#fffd92] md:hidden">
              <svg className="fill-current h-7 w-7" viewBox="0 0 100 80" width="30" height="30">
                <rect width="100" height="15"></rect>
                <rect y="30" width="100" height="15"></rect>
                <rect y="60" width="100" height="15"></rect>
              </svg>
            </button>
          )}
        </div>

        {/* NAVBAR CON SESIÓN INICIADA */}
        {isAuthenticated && (
          <div className="flex flex-col-reverse items-center md:flex-row flex-1 md:justify-end">
            <div className={`md:absolute w-full flex flex-col justify-center gap-8 md:gap-20 md:flex-row items-center order-2 md:order-1 ${isOpen ? "flex" : "hidden"} md:flex`}>

              {user.rol !== "guest" && user.rol !== "admin" && (
                <>
                  <Link to="/courses">
                    <button className="px-3 py-2 text-[#2d4654] rounded-2xl hover:bg-[#2d4654] hover:text-white transition-all">
                      <HighlightLetter color="lightGreen" className="font-opendyslexic font-bold" size="text-xl">Clases</HighlightLetter>
                    </button>
                  </Link>
                </>
              )}
            </div>

            <div className={`z-50 flex-col-reverse md:flex-row items-center gap-5 order-1 md:order-2 mt-3 md:m-0 ${isOpen ? "flex" : "hidden"} md:flex px-5`}>
              <div className="flex flex-col gap-5 md:flex-row items-center">
                <div className="flex gap-2 px-3">

                  {user.rol !== "guest" && user.rol !== "admin" && (
                    <div className="w-fit h-fit relative rounded-full cursor-pointer">
                      <button onClick={toggleChat}>
                        <Send className="w-11 h-11 text-gray-700 border border-gray-700 rounded-full p-2 hover:bg-gray-700 hover:text-white transition duration-300" />
                      </button>
                      {totalUnreadCount > 0 && (
                        <span className="absolute top-0 right-0 transform translate-x-[-2px] -translate-y-[-2px] bg-red-600 rounded-full h-3 w-3 border-2 border-white"></span>
                      )}
                    </div>
                  )}

                  {user.rol !== "guest" && user.rol !== "admin" && (
                    <div className="w-fit h-fit relative rounded-full cursor-pointer">
                      <button onClick={handleNotificationsToggle}>
                        <BellIcon className="w-11 h-11 text-gray-700 border border-gray-700 rounded-full p-2 hover:bg-gray-700 hover:text-white transition duration-300" />
                      </button>
                      {localUnreadCount > 0 && (
                        <div className="absolute top-0 right-0 transform translate-x-[-2px] -translate-y-[-2px] bg-red-600 text-white text-xs font-bold rounded-full h-2 w-2 flex items-center justify-center" />
                      )}
                    </div>
                  )}

                  {user.rol !== "guest" && user.rol !== "admin" && (
                    <div className="w-fit h-fit relative rounded-full cursor-pointer">
                      <button onClick={() => setShowChatbot(!showChatbot)}>
                        <Bot className="w-11 h-11 text-gray-700 border border-gray-700 rounded-full p-2 hover:bg-gray-700 hover:text-white transition duration-300" />
                      </button>
                    </div>
                  )}

                  <div ref={profileButtonRef} onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-fit h-fit relative rounded-full cursor-pointer">
                    {profile?.avatar ? (
                      <img src={profile.avatar.file_url} alt="Avatar del usuario" className="w-11 h-11 rounded-full object-cover border border-gray-500 hover:bg-gray-700 hover:text-white transition duration-300" />
                    ) : (
                      <FaUser className="w-11 h-11 text-gray-700 border border-gray-700 rounded-full p-2 hover:bg-gray-700 hover:text-white transition duration-300" />
                    )}
                    <div ref={dropdownRef} className={`absolute right-8 top-12 mt-2 w-fit flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 transition-all duration-300 ease-out transform ${isProfileOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                      <Link to="/profile"><p className="text-black dark:text-white dark:hover:bg-gray-700 hover:bg-gray-100 p-3 rounded-lg transition-all duration-200">Configuración del perfil</p></Link>
                      <button onClick={logOut} className="text-red-500 dark:hover:bg-gray-700 hover:bg-gray-100 p-3 rounded-lg transition-all duration-200">Cerrar sesión</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isAuthenticated && location.pathname !== "/login" && (
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8 order-2 md:order-1 px-4">
            <Link to="/login">
              <button className="px-3 py-2 text-[#2d4654] rounded-2xl hover:bg-[#2d4654] hover:text-white transition-all">
                <HighlightLetter color="lightGreen" className="font-opendyslexic font-bold" size="text-xl">Iniciar Sesión</HighlightLetter>
              </button>
            </Link>
          </div>
        )}
      </header>

      <ChatWindow />
      {showChatbot && <ChatbotModal onClose={() => setShowChatbot(false)} />}
      {showNotifications && (
        <NotificationDropdown onClose={() => setShowNotifications(false)} onReadAll={handleReadAll} onRead={handleRead} />
      )}
    </>
  );
}

export default NavBar;
