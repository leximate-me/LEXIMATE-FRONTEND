import { ButtonLink } from '../components/ui/ButtonLink';
import apoyo from '../assets/apoyo-global.jpg';
import conexion from '../assets/conexion-educativa.jpeg';
import juegos from '../assets/juegos-interactivos.jpg';
import leximate from '../assets/LEXIMATE.jpg';
//
function LandingPage() {
  return (
    <div className="relative flex flex-col min-h-screen min-w-full transition duration-300 dark:bg-[#1a1a1a]">
      <div className="flex flex-col h-full mt-16">
        {' '}
        {/* Ajusta el margen superior según la altura de tu NavBar */}
        <div className="flex-1 flex justify-center py-5 px-10 lg:px-40">
          <div className="flex flex-col flex-1 max-w-[960px]">
            {/* Sección de Bienvenida */}
            <div className="container mx-auto mt-16 md:mt-0">
              <div
                className="p-4 lg:p-10 flex flex-col gap-6 lg:gap-8 min-h-[480px] bg-cover bg-center bg-no-repeat rounded-xl items-start justify-end"
                style={{
                  backgroundImage: `linear-gradient(
                rgba(0, 0, 0, 0.1) 0%,
                rgba(0, 0, 0, 0.4) 100%
              ), url(${leximate})`,
                }}
              >
                <div className="flex flex-col gap-2 text-left">
                  <h1 className="text-white text-4xl lg:text-5xl font-black leading-tight">
                    Bienvenido a LexiMate
                  </h1>
                  <h2 className="text-white text-sm lg:text-base">
                    En cada obstáculo, encuentra una oportunidad.
                  </h2>
                </div>

                <ButtonLink
                  to="/register"
                  className="bg-primary hover:bg-secondary border-none dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  Empieza ahora!
                </ButtonLink>
              </div>
            </div>

            {/* Sección de Qué ofrecemos */}
            <div className="flex flex-col gap-10 px-4 py-10 container mx-auto">
              <h1 className="text-[#1c1c0d] text-[32px] lg:text-4xl font-bold max-w-[720px] dark:text-[#fffd92]">
                Qué ofrecemos?
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Tarjeta Conexión educativa */}
                <div className="flex flex-col gap-3">
                  <div
                    className="aspect-video bg-cover bg-center rounded-xl"
                    style={{
                      backgroundImage: `url(${conexion})`,
                    }}
                  ></div>
                  <div>
                    <p className="text-black text-base font-medium dark:text-[#fffd92]">
                      Conexión educativa
                    </p>
                    <p className="text-black text-sm dark:text-[#fffd92]">
                      Mantenemos a los estudiantes en contacto con sus
                      profesores y compañeros de clase, permitiendo recibir
                      tareas, compartir recursos y facilitar una comunicación
                      fluida y efectiva.
                    </p>
                  </div>
                </div>
                {/* Tarjeta Juegos interactivos */}
                <div className="flex flex-col gap-3">
                  <div
                    className="aspect-video bg-cover bg-center rounded-xl"
                    style={{
                      backgroundImage: `url(${juegos})`,
                    }}
                  ></div>
                  <div>
                    <p className="text-black text-base font-medium dark:text-[#fffd92]">
                      Juegos interactivos
                    </p>
                    <p className="text-black text-sm dark:text-[#fffd92]">
                      Proponemos una serie de juegos diseñados específicamente
                      para ejercitar la comprensión lectora, la memoria y otras
                      habilidades clave.
                    </p>
                  </div>
                </div>
                {/* Tarjeta Red de apoyo global */}
                <div className="flex flex-col gap-3">
                  <div
                    className="aspect-video bg-cover bg-center rounded-xl"
                    style={{
                      backgroundImage: `url(${apoyo})`,
                    }}
                  ></div>
                  <div>
                    <p className="text-black text-base font-medium dark:text-[#fffd92]">
                      Red de apoyo global
                    </p>
                    <p className="text-black text-sm dark:text-[#fffd92]">
                      Fomentamos la creación de una comunidad global donde
                      personas con dislexia puedan conectarse, compartir
                      experiencias y apoyarse mutuamente.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección de Registrarse */}
            <div className="container mx-auto">
              <div className="flex flex-col justify-end gap-6 px-4 py-10 lg:px-10 lg:py-20">
                <h1 className="text-center text-black text-[32px] lg:text-4xl font-bold max-w-[720px] mx-auto dark:text-[#fffd92]">
                  Listo para empezar? 🚀
                </h1>
                <div className="flex justify-center">
                  <ButtonLink
                    to="/register"
                    className="dark:bg-[#1a1a1a] dark:text-[#fffd92]"
                  >
                    Registrarse
                  </ButtonLink>
                </div>
              </div>
            </div>

            {/* Sección Acerca de nosotros */}
            <div className="px-4 py-5 lg:px-0">
              <h2 className="text-black text-[22px] font-bold pb-3 dark:text-[#fffd92]">
                Acerca de nosotros
              </h2>
              <p className="text-black text-base font-normal pb-3 dark:text-[#fffd92]">
                Nacimos con el objetivo de romper barreras y crear un entorno
                accesible para todas las personas con dislexia. Entendemos los
                desafíos diarios que enfrentan tanto en el ámbito académico como
                en su vida cotidiana, y por eso hemos desarrollado una
                plataforma integral que ofrece soluciones prácticas y efectivas.
                En Leximate, estamos comprometidos con la innovación continua y
                la inclusión. Trabajamos de la mano con expertos en educación y
                tecnología para asegurarnos de que nuestra aplicación sea una
                herramienta efectiva y fácil de usar. Creemos que, con el apoyo
                adecuado, todos pueden alcanzar su máximo potencial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
