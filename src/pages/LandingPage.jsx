import { ButtonLink } from '../components/ui/ButtonLink';
import leximate from '../assets/Proyecto_nuevo.png';

function LandingPage() {
  return (
    <div className="flex flex-col flex-1 items-center max-w-full">
      <div className="max-w-full-md mt-8 p-5 bg-primary border border-[#dbcf7f] flex rounded-lg shadow-[0px_9px_16px_-5px_rgba(0,_0,_0,_0.35)]">
        <img className='max-w-80' src={leximate} alt="Bienvenido a LexiMate" />
        {/* Aquí se cambia 'max-w-72' por 'w-full' */}
        <div className='w-96 flex flex-col justify-center font-opendyslexic tracking-very-wide'>
          <p className='mb-4'>
            <span className='text-neutral'>L</span>eximate es una app educativa para estudiantes con dislexi<span className='text-neutral'>a</span>
          </p>
          <p className='mb-4'>
            <span className='text-accent'>L</span>es ayuda a aprender mejor. Ofrece actividades interactivas y fácile<span className='text-accent'>s</span>
          </p>
          <p className='mb-4'>
            <span className='text-secondary'>M</span>ejora la lectura, la escritura y la comprensió<span className='text-secondary'>n</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-5 mt-5">
        <p className='font-opendyslexic tracking-very-wide text-xl font-bold'>
          <span className='text-neutral'>¿</span>Listo para empezar<span className='text-neutral'>?</span>🚀
        </p>
        <div className="flex justify-center">
          <ButtonLink
            to="/register"
            className="text-base dark:bg-[#1a1a1a] dark:text-[#fffd92]"
          >
            <p>
            <span className='text-secondary'>R</span>egistrars<span className='text-secondary'>e</span>
            </p>
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;