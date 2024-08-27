import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div
      className="
      flex h-[calc(100vh-4rem)] flex-col justify-center
      "
    >
      <div className="bg-white max-w-md mx-auto p-10 mt-20">
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
            className="w-full bg-[#e5e5e5] text-black px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
            type="text"
            {...register('name', { required: true, type: 'string' })}
            placeholder="Name"
          />
          {errors.name && (
            <span className="text-red-500">Este campo es requerido</span>
          )}
          <input
            className="w-full bg-[#e5e5e5] text-black px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
            type="text"
            {...register('lastname', { required: true })}
            placeholder="Lastname"
          />
          {errors.lastname && (
            <span className="text-red-500">Este campo es requerido</span>
          )}
          <select
            className="w-full bg-[#e5e5e5] text-black px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
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
            className="w-full bg-[#e5e5e5] text-black px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
            type="date"
            {...register('birthdate', { required: true })}
            placeholder="Birthdate"
          />
          {errors.birthdate && (
            <span className="text-red-500">Este campo es requerido</span>
          )}
          <input
            className="w-full bg-[#e5e5e5] text-black px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
            {...register('country', { required: true })}
            placeholder="Country"
          />
          {errors.country && (
            <span className="text-red-500">Este campo es requerido</span>
          )}
          <input
            className="w-full bg-[#e5e5e5] text-black px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
            type="email"
            {...register('email', { required: true })}
            placeholder="Email"
          />
          {errors.email && (
            <span className="text-red-500">Este campo es requerido</span>
          )}

          <input
            className="w-full bg-[#e5e5e5] text-black px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
            type="password"
            {...register('password', { required: true })}
            placeholder="Password"
          />
          {errors.password && (
            <span className="text-red-500">Este campo es requerido</span>
          )}
          <select
            className="w-full bg-[#e5e5e5] text-black px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
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
            Done
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
