import HighlightLetter from '../components/ui/HighlightLetter';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
// <-- 1. Importa el hook
import { useInView } from 'react-intersection-observer';

function LandingPage() {

  // <-- 2. Configura el hook para la tarjeta principal
  const { ref: cardRef, inView: cardInView } = useInView({
    triggerOnce: true, // La animación solo se ejecuta una vez
    threshold: 0.1,    // Se activa cuando el 10% del elemento es visible
  });

  // <-- 3. Configura el hook para el bloque CTA
  const { ref: ctaRef, inView: ctaInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // <-- 4. Define las clases de transición
  const transitionClasses = 'transition-all duration-700 ease-out';
  const hiddenState = 'opacity-0 translate-y-10'; // Invisible y 10px abajo
  const visibleState = 'opacity-100 translate-y-0'; // Visible y en posición

  return (
    <div className="flex flex-col flex-1 items-center max-w-full mt-5">
      {/* <-- 5. Aplica el 'ref' y las clases condicionales a la tarjeta 
      */}
      <div
        ref={cardRef} // <-- Asigna la referencia aquí
        className={`bg-white max-w-[1200px] max-h-[600px] rounded-[3rem] p-10 mt-4 shadow-2xl border-8 border-[#f7d654] ${transitionClasses} ${
          cardInView ? visibleState : hiddenState
        }`}
      >
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="relative w-full aspect-square">
              {/* ... (contenido de la tarjeta izquierda) ... */}
              <div className="absolute inset-0 bg-[#5eb0b8] rounded-3xl transform -rotate-6 border-6 border-[#2d4654]"></div>
              <div className="absolute inset-0 bg-[#f7d654] rounded-3xl transform rotate-3 border-6 border-[#2d4654]"></div>
              <div className="absolute inset-0 bg-[#f17c5a] rounded-3xl border-6 border-[#2d4654] flex items-center justify-center">
                <div className="text-center p-5 h-full">
                  <div className="h-1/4">
                    <HighlightLetter
                      className="text-white font-opendyslexic font-bold"
                      size="text-4xl"
                      color="blue"
                    >
                      Aprende mejor con LexiMate
                    </HighlightLetter>
                  </div>
                  <br />
                  <div className="h-3/4 p-4">
                    <HighlightLetter
                      className="text-white font-opendyslexic"
                      size="text-2xl"
                      color="green"
                    >
                      Actividades interactivas y fáciles de usar que mejoran tu
                      lectura, escritura y comprensión
                    </HighlightLetter>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* ... (contenido de la tarjeta derecha - lista de 'Check') ... */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#5eb0b8] flex items-center justify-center flex-shrink-0">
                <Check size={24} className="text-white" />
              </div>
              <div>
                <HighlightLetter
                  className="text-2xl font-bold font-opendyslexic mb-2"
                  color="lightGreen"
                >
                  Fuente clara y legible
                </HighlightLetter>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#f7d654] flex items-center justify-center flex-shrink-0">
                <Check size={24} className="text-[#2d4654]" />
              </div>
              <div>
                <HighlightLetter
                  className="text-2xl font-bold font-opendyslexic mb-2"
                  color="lightYellow"
                >
                  Mejora tu comprensión
                </HighlightLetter>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#f17c5a] flex items-center justify-center flex-shrink-0">
                <Check size={24} className="text-white" />
              </div>
              <div>
                <HighlightLetter
                  className="text-2xl font-bold font-opendyslexic mb-2"
                  color="lightRed"
                >
                  ChatBot integrado
                </HighlightLetter>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <-- 6. Aplica el 'ref' y las clases condicionales al CTA 
      */}
      <div
        ref={ctaRef} // <-- Asigna la referencia aquí
        className={`text-center flex flex-col bg-gradient-to-r from-[#5eb0b8] to-[#4a9ba3] rounded-3xl p-5 text-white mb-8 mt-8 ${transitionClasses} ${
          ctaInView ? visibleState : hiddenState
        }`}
      >
        <HighlightLetter
          color="lightRed"
          className="text-white font-bold font-opendyslexic"
          size="text-3xl"
        >
          ¿Listo para empezar?
        </HighlightLetter>
        <br />
        <HighlightLetter
          color="lightYellow"
          className="font-opendyslexic text-white font-bold leading-relaxed max-w-fit mx-auto"
          size="text-xl"
        >
          Únete a LexiMate y descubre una nueva forma de aprender
        </HighlightLetter>
        <br />
        <Link to="/register">
          <button className="w-fit p-4 self-center bg-[#f7d654] text-[#2d4654] text-2xl font-bold rounded-full hover:bg-white transition-all shadow-2xl">
            Registrarse ahora
          </button>
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;