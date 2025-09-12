import { ButtonLink } from '../components/ui/ButtonLink';
import leximate from '../assets/Proyecto_nuevo.png';
import HighlightLetter from '../components/ui/HighlightLetter';

function LandingPage() {
  return (
    <div className="flex flex-col flex-1 items-center max-w-full">
      <div className="max-w-[900px] mt-8 p-5 bg-primary flex rounded-lg shadow-[0px_9px_16px_-5px_rgba(0,_0,_0,_0.35)]">
        <img className='max-w-[400px] max-h-[400px]' src={leximate} alt="Bienvenido a LexiMate" />
        {/* Aquí se cambia 'max-w-72' por 'w-full' */}
        <div className='w-96 flex flex-col justify-center font-opendyslexic space-y-5'>

          <p className=''>
            <HighlightLetter className='leading-loose' color="blue" size='text-xl'>Leximate es una app educativa para estudiantes con dislexia</HighlightLetter>
          </p>

          <p className=''>
            <HighlightLetter className='leading-loose' color="red" size='text-xl'>Les ayuda a aprender mejor. Ofrece actividades interactivas y fáciles de usar</HighlightLetter>
          </p>

          <p className=''>
            <HighlightLetter className='leading-loose' color="green" size='text-xl'>Mejora la lectura, la escritura y la comprensión</HighlightLetter>
          </p>

        </div>
      </div>
      <div className="flex flex-col gap-5 mt-5">

        <p className='font-opendyslexic tracking-very-wide text-xl'>
          <HighlightLetter color='blue'>¿Listo para empezar?</HighlightLetter>
          🚀
        </p>

        <div className="flex justify-center">
          <button
            to='/register'
            className="w-1/2 bg-gradient-to-r from-yellow-300 to-amber-400 font-semibold py-4 rounded-2xl hover:from-yellow-400 hover:to-amber-500 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <HighlightLetter color="green" className='font-opendyslexic ' size='text-xl'>
              Registrarse
            </HighlightLetter>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;