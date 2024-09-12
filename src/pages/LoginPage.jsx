import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signIn, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (values) => {
    await signIn(values);
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div
      className="flex h-[calc(100vh-4rem)] flex-col mt-5">
      <div className="bg-white max-w-md mx-auto p-10 rounded-lg border border-gray-400 shadow-lg">
        <form className="space-y-4" onSubmit={onSubmit}>
          <h1 className="text-3xl font-bold text-center py-5">Inicia sesión</h1>
          {error && (
            <div className="bg-red-900 text-white p-2 rounded-lg font-mono animate-fade-in-out ">
              {error.error.map((err, index) => (
                <div className="py-2" key={index}>
                  <span className="font-bold text-red-500">ERROR : </span>
                  <span className="text-slate-200">{err}</span>
                </div>
              ))}
            </div>
          )}
          <input
            className="w-full bg-[#e5e5e5] text-black px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
            type="email"
            {...register('email', { required: true })}
            placeholder="Correo electrónico"
          />
          {errors.email && (
            <span className="text-red-500">* Este campo es requerido</span>
          )}

          <input
            className="w-full bg-[#e5e5e5] text-black px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
            type="password"
            {...register('password', { required: true })}
            placeholder="Contraseña"
          />
          {errors.password && (
            <span className="text-red-500">* Este campo es requerido</span>
          )}

          <button
            type="submit"
            className="btn w-full bg-[#ffff13] text-slate-900 hover:bg-[#e9e91b] transition-colors px-4 py-2 rounded-lg"
          >
            Ingresar
          </button>
        </form>
        <p className="text-center py-4">
          No tienes una cuenta?
          <Link
            className="mx-2 text-blue-600"
            to="/register"
          >
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
