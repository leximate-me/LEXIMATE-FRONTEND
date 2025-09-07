import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ErrorModal } from '../components/ui/ErrorModal';
import Loading from '../components/ui/Loading';
import HighlightLetter from '../components/ui/HighlightLetter';
import { ButtonLink } from '../components/ui/ButtonLink';

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signIn, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = handleSubmit(async (values) => {
    setIsLoading(true);
    await signIn(values);
    setIsLoading(false);
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/classes');
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <ErrorModal error={error} clearError={clearError} />
      <div className="flex justify-center overflow-hidden h-[500px]">
        {isLoading ? (
          <>{Loading('Iniciando sesión...')}</>
        ) : (
          <>
            <Card className="m-7 border-none bg-white">
              {/* header */}
              <div className="rounded-t-lg bg-gradient-to-r from-yellow-300 to-amber-400 p-8 text-center">
                <HighlightLetter color="blue" className='font-opendyslexic' size='text-3xl'>
                  Iniciar Sesión
                </HighlightLetter>
              </div>


              <div className="p-6 flex flex-col space-y-4">
                <form onSubmit={onSubmit} className="flex flex-col space-y-4">
                  <Input
                    type="email"
                    register={register}
                    name="email"
                    rules={{ required: 'Este campo es requerido' }}
                    placeholder="Correo electrónico"
                  />
                  {errors.email && <span className="text-red-500">{errors.email.message}</span>}

                  <Input
                    type="password"
                    register={register}
                    name="password"
                    rules={{ required: 'Este campo es requerido' }}
                    placeholder="Contraseña"
                  />
                  {errors.password && (
                    <span className="text-red-500">{errors.password.message}</span>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 font-semibold py-4 rounded-2xl hover:from-yellow-500 hover:to-amber-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <HighlightLetter color="green" className='font-opendyslexic' size='text-xl'>
                      Iniciar Sesión
                    </HighlightLetter>
                  </button>
                </form>

                <p className="text-center py-4 dark:text-white">
                  <HighlightLetter color="blue" className='font-opendyslexic' size='text-lg'>
                    ¿No tienes una cuenta?
                  </HighlightLetter>
                  <Link className="mx-2 text-blue-600 font-opendyslexic" to="/register">
                    Registrate
                  </Link>
                </p>
              </div>
            </Card>
          </>
        )}
      </div>
    </>
  );
}

export default LoginPage;
