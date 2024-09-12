import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-leximate.png';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
dayjs.extend(utc);

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signUp, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();
  const onSubmit = handleSubmit(async (values) => {
    await signUp({
      ...values,
      birthdate: dayjs.utc(values.birthdate).format(),
    });
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/tasks');
    }
  }, [isAuthenticated]);

  return (
    <div>
      <div className="p-5 mt-14 md:mt-28 max-w-md mx-auto border border-gray-400 shadow-xl rounded-md min-w-[50%] flex flex-col md:flex-row items-center">
        <div>
          <img className='h-10 md:h-auto' src={logo} alt="" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-center py-5">Registrarse</h1>
          {error && (
            <div className="bg-red-900 text-white p-2 rounded-lg font-mono animate-fade-in-out">
              {error.error.map((err, index) => (
                <div className="py-2" key={index}>
                  <span className="font-bold text-red-500">ERROR : </span>
                  <span className="text-slate-200">{err}</span>
                </div>
              ))}
            </div>
          )}
          <form className="space-y-4" onSubmit={onSubmit}>
            <input
              className="w-full bg-[#e5e5e5] text-black px-4 placeholder-black py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              type="text"
              {...register('name', { required: true, type: 'string' })}
              placeholder="Nombre"
            />
            {errors.name && (
              <span className="text-red-500">Este campo es requerido</span>
            )}
            <input
              className="w-full bg-[#e5e5e5] text-black px-4 placeholder-black py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              type="text"
              {...register('lastname', { required: true })}
              placeholder="Apellido"
            />
            {errors.lastname && (
              <span className="text-red-500">Este campo es requerido</span>
            )}
            <select
              className="w-full bg-[#e5e5e5] text-black px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              {...register('gender', { required: true })}
            >
              <option value="">Selecciona tu género</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>
            {errors.gender && (
              <span className="text-red-500">Selecciona un genero</span>
            )}
            <input
              className="w-full bg-[#e5e5e5] text-black px-4 placeholder-black py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              type="date"
              {...register('birthdate', { required: true })}
              placeholder="Fecha de nacimiento"
            />
            {errors.birthdate && (
              <span className="text-red-500">Este campo es requerido</span>
            )}
            <input
              className="w-full bg-[#e5e5e5] text-black px-4 placeholder-black py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              {...register('country', { required: true })}
              placeholder="País"
            />
            {errors.country && (
              <span className="text-red-500">Este campo es requerido</span>
            )}
            <input
              className="w-full bg-[#e5e5e5] text-black px-4 placeholder-black py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              type="email"
              {...register('email', { required: true })}
              placeholder="Correo electrónico"
            />
            {errors.email && (
              <span className="text-red-500">Este campo es requerido</span>
            )}

            <input
              className="w-full bg-[#e5e5e5] text-black px-4 placeholder-black py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              type="password"
              {...register('password', { required: true })}
              placeholder="Contraseña"
            />
            {errors.password && (
              <span className="text-red-500">Este campo es requerido</span>
            )}
            <select
              className="w-full bg-[#e5e5e5] text-black px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              {...register('role', { required: false })}
            >
              <option value="">Usuario</option>
              <option value="student">Alumno</option>
              <option value="teacher">Profesor</option>
            </select>
            <button
              type="submit"
              className="btn w-full bg-[#f2f20d] text-slate-900 hover:bg-[#cccc03] transition-colors px-4 py-2 rounded-lg"
            >
              Hecho
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
