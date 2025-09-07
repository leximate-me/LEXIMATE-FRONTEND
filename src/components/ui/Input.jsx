import React from 'react';
import { HiLockClosed } from 'react-icons/hi2';
import { MdOutlineEmail } from "react-icons/md";

export const Input = ({ type, register, name, rules, placeholder, error }) => {
  // Elegir icono según tipo de input
  let Icon = null;
  if (type === 'password') Icon = HiLockClosed;
  else if (type === 'email') Icon = MdOutlineEmail;

  return (
    <div className="relative w-full">
      {/* Icono */}
      {Icon && (
        <Icon
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
      )}

      <input
        type={type}
        {...register(name, rules)}
        className={`border border-gray-300 w-full bg-[#e5e5e5] text-black rounded-lg focus:outline-none
          ${Icon ? 'pl-10' : 'px-4'} py-2
          ${error ? 'border-red-500' : ''}
        `}
        placeholder={placeholder}
      />

      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};
