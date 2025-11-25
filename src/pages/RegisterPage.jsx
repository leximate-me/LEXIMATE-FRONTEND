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
import HighlightLetter from '../components/ui/HighlightLetter';
import { User, Mail, Lock, Contact, CalendarFold, IdCard, Phone, GraduationCap } from 'lucide-react';
dayjs.extend(utc);
////
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
      birth_date: dayjs(values.birth_date).format('YYYY-MM-DD'),
      user_name: values.user_name,
      email: values.email,
      password: values.password
    };

    setIsLoading(true);

    const result = await signUp(user);

    if (result) {
      // Si el registro es exitoso, redirige al login
      navigate('/courses');
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
    <div className="h-[calc(100vh-80px)] grid grid-cols-8 grid-rows-8">
      <ErrorModal error={error} clearError={clearError} />
      <div className="col-start-3 col-span-4 row-span-7 p-5" >
        {isLoading ? (
          <div className="h-[500px] flex justify-center items-center mt-6">
            {Loading('Creando usuario...')}
          </div>
        ) : (
          <Card className="border-none w-full h-full bg-white animate-fadeIn">
            <div className='min-h-full flex'>
              <div className="w-[40%] flex rounded-l-lg bg-gradient-to-r from-yellow-300 to-amber-400 p-8 items-center">
                <div className='text-center'>
                  <img src={logo} alt="" />
                  <HighlightLetter color="green" className='font-bold font-opendyslexic' size='text-xl'>
                    Únete a Leximate y transforma tu aprendizaje hoy mismo.
                  </HighlightLetter>
                </div>
              </div>
              <form className="w-[60%] flex flex-col justify-between p-4" onSubmit={onSubmit}>
                <div className='flex gap-3'>
                  <Input
                    type="text"
                    icon={User}
                    register={register}
                    name="first_name"
                    rules={{ required: 'Este campo es requerido' }}
                    placeholder="Nombre"
                    error={errors.first_name?.message}
                  />
                  <Input
                    type="text"
                    icon={User}
                    register={register}
                    name="last_name"
                    rules={{ required: 'Este campo es requerido' }}
                    placeholder="Apellido"
                    error={errors.last_name?.message}
                  />
                </div>
                <Input
                  type="email"
                  icon={Mail}
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
                  type="text"
                  icon={Contact}
                  register={register}
                  name="user_name"
                  rules={{ required: 'Este campo es requerido' }}
                  placeholder="Nombre de usuario"
                  error={errors.user_name?.message}
                />
                <div className='flex gap-3'>
                  <Input
                    type="date"
                    icon={CalendarFold}
                    register={register}
                    name="birth_date"
                    rules={{ required: 'Este campo es requerido' }}
                    placeholder="Fecha de nacimiento"
                    error={errors.birth_date?.message}
                  />
                  <Input
                    type="text"
                    icon={IdCard}
                    register={register}
                    name="dni"
                    rules={{ required: 'Este campo es requerido' }}
                    placeholder="Número de Documento"
                    error={errors.dni?.message}
                  />
                </div>
                <Input
                  type="text"
                  icon={Phone}
                  register={register}
                  name="phone_number"
                  rules={{ required: 'Este campo es requerido' }}
                  placeholder="Teléfono"
                  error={errors.phone_number?.message}
                />
                <Input
                  type="text"
                  icon={GraduationCap}
                  register={register}
                  name="institute"
                  rules={{ required: 'Este campo es requerido' }}
                  placeholder="Institución"
                  error={errors.institute?.message}
                />
                <div className='flex gap-3'>
                  <Input
                    type="password"
                    icon={Lock}
                    register={register}
                    name="password"
                    rules={{ required: 'Este campo es requerido' }}
                    placeholder="Contraseña"
                    error={errors.password?.message}
                  />
                  {errors.role && (
                    <span className="text-red-500">{errors.role.message}</span>
                  )}
                  <Input
                    type="password"
                    icon={Lock}
                    register={register}
                    name="password"
                    rules={{ required: 'Este campo es requerido' }}
                    placeholder="Repetir Contraseña"
                    error={errors.password?.message}
                    className="flex-1 min-w-0 truncate"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 font-semibold py-4 rounded-2xl hover:from-yellow-500 hover:to-amber-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <HighlightLetter color="green" className='font-opendyslexic' size='text-xl'>
                    Hecho
                  </HighlightLetter>
                </button>
              </form>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;
