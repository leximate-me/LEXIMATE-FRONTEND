import { ButtonLink } from '../components/ui/ButtonLink';
import leximate from '../assets/Proyecto_nuevo.png';
import HighlightLetter from '../components/ui/HighlightLetter';

function LandingPage() {
  return (
    <div className="flex flex-col flex-1 items-center max-w-full">
      <div className="max-w-full-md mt-8 p-5 bg-primary border border-[#dbcf7f] flex rounded-lg shadow-[0px_9px_16px_-5px_rgba(0,_0,_0,_0.35)]">
        <img className='max-w-80' src={leximate} alt="Bienvenido a LexiMate" />
        {/* Aquí se cambia 'max-w-72' por 'w-full' */}
        <div className='w-96 flex flex-col justify-center font-opendyslexic tracking-very-wide'>

          <p className='mb-4'>
            <HighlightLetter color="blue">Leximate es una app educativa para estudiantes con dislexia</HighlightLetter>
          </p>
          
          <p className='mb-4'>
            <HighlightLetter color="red">Les ayuda a aprender mejor. Ofrece actividades interactivas y fáciles de usar</HighlightLetter>
          </p>

          <p className='mb-4'>
            <HighlightLetter color="green">Mejora la lectura, la escritura y la comprensión</HighlightLetter>
          </p>

        </div>
      </div>
      <div className="flex flex-col gap-5 mt-5">

        <p className='font-opendyslexic tracking-very-wide text-xl'>
          <HighlightLetter color='blue'>¿Listo para empezar?</HighlightLetter>
          🚀
        </p>

        <div className="flex justify-center">
          <ButtonLink
            to="/register"
            className="text-base dark:bg-[#1a1a1a] dark:text-[#fffd92]"
          >
            <p>
              <HighlightLetter color='red'>Registrarse</HighlightLetter>
            </p>
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;