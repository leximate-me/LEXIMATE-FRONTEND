import React from 'react';

export function Input({ register, name, rules, placeholder, className, type }) {
  return (
    <input
      className={`w-full bg-[#e5e5e5] text-black px-4 placeholder-black py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 ${className}`}
      type={type}
      {...(register && register(name, rules))}
      placeholder={placeholder}
    />
  );
}
