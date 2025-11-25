import { useEffect, useRef, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { BellIcon } from 'lucide-react';

export default function NotificationDropdown({ onClose }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsVisible(false);
        setTimeout(onClose, 200);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleNotificationClick = (notification) => {
    console.log(notification)
    if (!notification.read) markAsRead(notification.id);

    if (notification.data.url) {
      console.log(notification.data.url)
      navigate(`${notification.data.url}`);
    } 

    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diff = Math.floor((now - created) / 1000);

    if (diff < 60) return 'Ahora';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)}h`;
    return `Hace ${Math.floor(diff / 86400)}d`;
  };

  const getNotificationIcon = (type) => {
    const icons = {
      TASK_CREATED: '📝',
      TASK_UPDATED: '✏️',
      TASK_SUBMITTED: '✅',
      POST_CREATED: '📢',
      COMMENT_CREATED: '💬',
      COURSE_UPDATED: '📚',
      default: '🔔',
    };
    return icons[type] || icons.default;
  };

  return (
    <div
      ref={dropdownRef}
      className={`absolute right-4 top-16 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-[99998] transition-all duration-300
        ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Notificaciones ({unreadCount})
        </h3>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Marcar todas
          </button>
        )}
      </div>

      {/* Content */}
      <div className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Cargando...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <BellIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No tienes notificaciones</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 
                hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition
                ${!n.read ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getNotificationIcon(n.type)}</span>
                <div className="flex-1">
                  <p className={`text-sm font-medium dark:text-white`}>
                    {n.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {n.message}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {getTimeAgo(n.createdAt)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(n.id);
                      }}
                      className="text-xs text-red-500 hover:text-red-700 hover:bg-gray-200 p-2 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
