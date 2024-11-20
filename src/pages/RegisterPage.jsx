import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import logo from '../assets/logo-leximate.png';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import { ErrorModal } from '../components/ui/ErrorModal';
import Loading from '../components/ui/Loading';
dayjs.extend(utc);
//
function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);

  const { signUp, error, clearError } = useAuth();
  const navigate = useNavigate();

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

    setIsLoading(true);

    const result = await signUp(user);

    if (result) {
      // Si el registro es exitoso, redirige al login
      navigate('/classes');
    } else {
      // Si hay error, marcamos los campos relevantes en rojo
      if (error?.errors) {
        Object.keys(error.errors).forEach((field) => {
          setError(field, {
            type: 'server',
            message: error.errors[field],
          });
        });
      }
    }

    setIsLoading(false);
  });

  return (
    <div className="grid grid-cols-6 grid-rows-6">
      <ErrorModal error={error} clearError={clearError} />
      <div className="mx-2 col-span-6 row-span-6 mt-20 md:mt-0">
        {isLoading ? (
          <div className="h-[500px] flex justify-center items-center mt-6">
            {Loading('Creando usuario...')}
          </div>
        ) : (
          <Card className="md:h-[710px] min-w-[50%] md:min-w-fit m-7 flex flex-col md:flex-row items-center dark:bg-[#1a1a1a] dark:border-[#fffd92]">
            <div className="flex justify-center md:items-center">
              <img className="w-44 md:h-auto" src={logo} alt="" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-center py-5 dark:text-white">
                Registrarse
              </h1>
              <form className="space-y-4" onSubmit={onSubmit}>
                <Input
                  type="text"
                  register={register}
                  name="first_name"
                  rules={{ required: 'Este campo es requerido' }}
                  placeholder="Nombre"
                  error={errors.first_name?.message}
                />
                <Input
                  type="text"
                  register={register}
                  name="last_name"
                  rules={{ required: 'Este campo es requerido' }}
                  placeholder="Apellido"
                  error={errors.last_name?.message}
                />
                <Input
                  type="text"
                  register={register}
                  name="dni"
                  rules={{ required: 'Este campo es requerido' }}
                  placeholder="DNI"
                  error={errors.dni?.message}
                />
                <Input
                  type="text"
                  register={register}
                  name="institute"
                  rules={{ required: 'Este campo es requerido' }}
                  placeholder="Institución"
                  error={errors.institute?.message}
                />
                <Input
                  type="text"
                  register={register}
                  name="phone_number"
                  rules={{ required: 'Este campo es requerido' }}
                  placeholder="Teléfono"
                  error={errors.phone_number?.message}
                />
                <Input
                  type="date"
                  register={register}
                  name="birth_date"
                  rules={{ required: 'Este campo es requerido' }}
                  placeholder="Fecha de nacimiento"
                  error={errors.birth_date?.message}
                />
                <Input
                  type="text"
                  register={register}
                  name="user_name"
                  rules={{ required: 'Este campo es requerido' }}
                  placeholder="Nombre de usuario"
                  error={errors.user_name?.message}
                />
                <Input
                  type="email"
                  register={register}
                  name="email"
                  rules={{
                    required: 'Este campo es requerido',
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'Formato de correo no válido',
                    },
                  }}
                  placeholder="Correo electrónico"
                  error={errors.email?.message}
                />
                <Input
                  type="password"
                  register={register}
                  name="password"
                  rules={{ required: 'Este campo es requerido' }}
                  placeholder="Contraseña"
                  error={errors.password?.message}
                />
                <select
                  className={`w-full bg-[#e5e5e5] text-black px-4 py-2 rounded-lg ${
                    errors.role ? 'border-red-500' : ''
                  } focus:outline-none`}
                  {...register('role', { required: 'Este campo es requerido' })}
                >
                  <option value="" disabled>
                    Selecciona tu rol
                  </option>
                  <option value="Student">Estudiante</option>
                  <option value="Teacher">Profesor</option>
                </select>
                {errors.role && (
                  <span className="text-red-500">{errors.role.message}</span>
                )}
                <Button type="submit">Hecho</Button>
              </form>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;
