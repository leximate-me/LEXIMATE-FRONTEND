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
      <div className="bg-zinc-900 max-w-md mx-auto p-10 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center py-5">Register</h1>
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
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="text"
            {...register('name', { required: true, type: 'string' })}
            placeholder="Name"
          />
          {errors.name && (
            <span className="text-red-500">This field is required</span>
          )}
          <input
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="text"
            {...register('lastname', { required: true })}
            placeholder="Lastname"
          />
          {errors.lastname && (
            <span className="text-red-500">This field is required</span>
          )}
          <input
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="text"
            {...register('gender', { required: true })}
            placeholder="Gender"
          />
          {errors.gender && (
            <span className="text-red-500">This field is required</span>
          )}
          <input
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="date"
            {...register('birthdate', { required: true })}
            placeholder="Birthdate"
          />
          {errors.birthdate && (
            <span className="text-red-500">This field is required</span>
          )}
          <input
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="text"
            {...register('country', { required: true })}
            placeholder="Country"
          />
          {errors.country && (
            <span className="text-red-500">This field is required</span>
          )}
          <input
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="email"
            {...register('email', { required: true })}
            placeholder="Email"
          />
          {errors.email && (
            <span className="text-red-500">This field is required</span>
          )}

          <input
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="password"
            {...register('password', { required: true })}
            placeholder="Password"
          />
          {errors.password && (
            <span className="text-red-500">This field is required</span>
          )}
          <input
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="text"
            {...register('role')}
            placeholder="Role"
          />
          {errors.role && (
            <span className="text-red-500">This field is required</span>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Done
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
