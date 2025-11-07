import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const Input = ({
  type,
  register,
  name,
  rules,
  placeholder,
  error,
  icon: Icon, // 👈 nuevo prop
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const typeInput =
    type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative w-full">
      {/* Icono pasado por props */}
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
          type="button"
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
