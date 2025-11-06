import React, { useState } from 'react';
import { HiLockClosed } from 'react-icons/hi2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdOutlineEmail } from "react-icons/md";

export const Input = ({ type, register, name, rules, placeholder, error }) => {
  // Elegir icono según tipo de input

  const [showPassword, setShowPassword] = useState(false);

  let Icon = null;
  if (type === 'password') Icon = HiLockClosed;
  else if (type === 'email') Icon = MdOutlineEmail;

  const typeInput = type === 'password' ? (showPassword ? 'text' : 'password') : type;

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
        type={typeInput}
        {...register(name, rules)}
        className={`border border-gray-300 w-full bg-[#e5e5e5] text-black rounded-lg focus:outline-none
          ${Icon ? 'pl-10' : 'px-4'} py-2
          ${error ? 'border-red-500' : ''}
        `}
        placeholder={placeholder}
      />

      {type === 'password' && (
        <button
          type='button'
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </button>
      )}

      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};
