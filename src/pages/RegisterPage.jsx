import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import logo from '../assets/logo-leximate.png';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import swal from 'sweetalert';
dayjs.extend(utc);

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signUp, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();
  const [showErrorModal, setShowErrorModal] = useState(false);

  const onSubmit = handleSubmit(async (values) => {
    const user = {
      first_name: values.first_name,
      last_name: values.last_name,
      dni: values.dni,
      institute: values.institute,
      phone_number: values.phone_number,
      birth_date: dayjs(values.birth_date).utc().format(),
      user_name: values.user_name,
      email: values.email,
      password: values.password,
      role: values.role,
    };
    signUp(user);
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

  const handleCloseModal = () => {
    setShowErrorModal(false);
    clearError();
  };

  const showSwal = () => {
    if (error) {
      const errCont = [];

      error.error.map((err) => {
        errCont.push(err);
      });
      const errors = errCont.join('\n');
      swal({
        title: 'ERROR!',
        text: errors,
        icon: 'error',
        buttons: handleCloseModal,
        dangerMode: true,
      });
    }
  };

  return (
    <div className="flex justify-center">
      <Card className="min-w-[50%] m-7 flex flex-col md:flex-row items-center">
        <div className='flex justify-center md:items-center'>
          <img className="h-10 md:h-auto" src={logo} alt="" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-center py-5">
            Registrarse
          </h1>
          <form className="space-y-4" onSubmit={onSubmit}>
            <Input
              type="text"
              register={register}
              name="first_name"
              rules={{ required: true }}
              placeholder="Nombre"
            />
            {errors.first_name && (
              <span className="text-red-500">Este campo es requerido</span>
            )}
            <Input
              type="text"
              register={register}
              name="last_name"
              rules={{ required: true }}
              placeholder="Apellido"
            />
            {errors.last_name && (
              <span className="text-red-500">Este campo es requerido</span>
            )}
            <Input
              type="text"
              register={register}
              name="dni"
              rules={{ required: true }}
              placeholder="DNI"
            />
            {errors.dni && (
              <span className="text-red-500">Este campo es requerido</span>
            )}
            <Input
              type="text"
              register={register}
              name="institute"
              rules={{ required: true }}
              placeholder="Institución"
            />
            {errors.institute && (
              <span className="text-red-500">Este campo es requerido</span>
            )}
            <Input
              type="text"
              register={register}
              name="phone_number"
              rules={{ required: true }}
              placeholder="Teléfono"
            />
            {errors.phone_number && (
              <span className="text-red-500">Este campo es requerido</span>
            )}
            <Input
              type="date"
              register={register}
              name="birth_date"
              rules={{ required: true }}
              placeholder="Fecha de nacimiento"
            />
            {errors.birth_date && (
              <span className="text-red-500">Este campo es requerido</span>
            )}
            <Input
              type="text"
              register={register}
              name="user_name"
              rules={{ required: true }}
              placeholder="Nombre de usuario"
            />
            {errors.user_name && (
              <span className="text-red-500">Este campo es requerido</span>
            )}
            <Input
              type="email"
              register={register}
              name="email"
              rules={{ required: true }}
              placeholder="Correo electrónico"
            />
            {errors.email && (
              <span className="text-red-500">Este campo es requerido</span>
            )}
            <Input
              type="password"
              register={register}
              name="password"
              rules={{ required: true }}
              placeholder="Contraseña"
            />
            {errors.password && (
              <span className="text-red-500">Este campo es requerido</span>
            )}
            <select
              className="w-full bg-[#e5e5e5] text-black px-4 placeholder-black
              py-2 rounded-lg focus:outline-none focus:ring-2
              focus:ring-slate-400"
              {...register('role', { required: true })}
              defaultValue="Guest"
            >
              <option value="Guest" disabled hidden>
                Selecciona tu rol
              </option>
              <option value="Student">Estudiante</option>
              <option value="Teacher">Profesor</option>
            </select>
            <Button type="submit" onClick={showSwal}>
              Hecho
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default RegisterPage;
