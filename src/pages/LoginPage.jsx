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
      className="
    flex h-[calc(100vh-4rem)] flex-col justify-center
    "
    >
      <div className="bg-zinc-900 max-w-md mx-auto p-10 rounded-lg shadow-lg">
        <form className="space-y-4" onSubmit={onSubmit}>
          <h1 className="text-3xl font-semibold text-center py-5">Login</h1>
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
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="email"
            {...register('email', { required: true })}
            placeholder="Email"
          />
          {errors.email && (
            <span className="text-red-500">* This field is required</span>
          )}

          <input
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="password"
            {...register('password', { required: true })}
            placeholder="Password"
          />
          {errors.password && (
            <span className="text-red-500">* This field is required</span>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Done
          </button>
        </form>
        <p className="text-center py-4">
          Don't have an account?{' '}
          <Link className=" text-blue-600  hover:text-blue-700" to="/register">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
