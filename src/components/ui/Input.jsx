import React from 'react';

export const Input = ({ type, register, name, rules, placeholder, error }) => {
  return (
    <div>
      <input
        type={type}
        {...register(name, rules)}
        className={`w-full bg-[#e5e5e5] text-black px-4 py-2 rounded-lg ${
          error ? 'border-red-500' : ''
        } focus:outline-none`}
        placeholder={placeholder}
      />
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};

