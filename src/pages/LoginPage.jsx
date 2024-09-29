import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ErrorModal } from '../components/ErrorModal';

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signIn, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();
  const [showErrorModal, setShowErrorModal] = useState(false);

  const onSubmit = handleSubmit(async (values) => {
    await signIn(values);
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setShowErrorModal(true);
    }
  }, [error]);

  return (
    <div className="flex justify-center mt-5 overflow-hidden">
      <Card>
        <form className="space-y-4" onSubmit={onSubmit}>
          <h1 className="text-3xl font-bold text-center py-5">Inicia sesión</h1>
          <Input
            type="email"
            register={register}
            name="email"
            rules={{ required: 'Este campo es requerido' }}
            placeholder="Correo electrónico"
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}

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

          <Button
            type="submit"
            className="btn w-full bg-[#ffff13] text-slate-900 hover:bg-[#e9e91b] transition-colors px-4 py-2 rounded-lg"
          >
            Ingresar
          </Button>
        </form>
        <p className="text-center py-4">
          No tienes una cuenta?
          <Link className="mx-2 text-blue-600" to="/register">
            Registrate
          </Link>
        </p>
      </Card>
      <ErrorModal error={error} onClose={() => setShowErrorModal(false)} />
    </div>
  );
}

export default LoginPage;
