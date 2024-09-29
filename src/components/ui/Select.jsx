// components/ui/RoleSelect.jsx

const Select = ({ register, name, rules, className }) => {
  return (
    <select
      className={`w-full bg-[#e5e5e5] text-black px-4 placeholder-black py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 ${className}`}
      {...register(name, rules)}
      defaultValue="4"
    >
      <option value="4" disabled hidden>
        Selecciona tu rol
      </option>
      <option value="2">Estudiante</option>
      <option value="3">Profesor</option>
    </select>
  );
};

export default Select;
