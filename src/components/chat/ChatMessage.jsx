import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ChatMessage = ({ message, isOwn }) => {
  return (
    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} mb-4`}>
      <div
        className={`max-w-[80%] px-4 py-2 rounded-lg shadow-sm ${
          isOwn
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none border border-gray-200 dark:border-gray-600'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
      </div>
      <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 px-1">
        {format(new Date(message.createdAt), 'HH:mm', { locale: es })}
      </span>
    </div>
  );
};

export default ChatMessage;
