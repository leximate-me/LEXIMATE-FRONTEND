function LandingPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-[#fcfcf8] overflow-x-hidden">
      <div className="flex flex-col h-full mt-16">
        {' '}
        {/* Ajusta el margen superior según la altura de tu NavBar */}
        <div className="flex-1 flex justify-center py-5 px-10 lg:px-40">
          <div className="flex flex-col flex-1 max-w-[960px]">
            {/* Sección de Bienvenida */}
            <div className="container mx-auto">
              <div
                className="p-4 lg:p-10 flex flex-col gap-6 lg:gap-8 min-h-[480px] bg-cover bg-center bg-no-repeat rounded-xl items-start justify-end"
                style={{
                  backgroundImage: `linear-gradient(
                rgba(0, 0, 0, 0.1) 0%,
                rgba(0, 0, 0, 0.4) 100%
              ), url('./assets/LEXIMATE.jpg')`,
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
                <a href="./Componentes/register.html">
                  <button className="bg-[#f2f20d] text-[#1c1c0d] text-sm lg:text-base font-bold rounded-full h-10 lg:h-12 px-4 lg:px-5">
                    Empieza ahora!
                  </button>
                </a>
              </div>
            </div>

            {/* Sección de Qué ofrecemos */}
            <div className="flex flex-col gap-10 px-4 py-10 container mx-auto">
              <h1 className="text-[#1c1c0d] text-[32px] lg:text-4xl font-bold max-w-[720px]">
                Qué ofrecemos?
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Tarjeta Conexión educativa */}
                <div className="flex flex-col gap-3">
                  <div
                    className="aspect-video bg-cover bg-center rounded-xl"
                    style={{
                      backgroundImage:
                        "url('./assets/conexion-educativa.jpeg')",
                    }}
                  ></div>
                  <div>
                    <p className="text-[#1c1c0d] text-base font-medium">
                      Conexión educativa
                    </p>
                    <p className="text-[#9c9c49] text-sm">
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
                      backgroundImage:
                        "url('./assets/juegos-interactivos.jpg')",
                    }}
                  ></div>
                  <div>
                    <p className="text-[#1c1c0d] text-base font-medium">
                      Juegos interactivos
                    </p>
                    <p className="text-[#9c9c49] text-sm">
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
                      backgroundImage: "url('./assets/apoyo-global.jpg')",
                    }}
                  ></div>
                  <div>
                    <p className="text-[#1c1c0d] text-base font-medium">
                      Red de apoyo global
                    </p>
                    <p className="text-[#9c9c49] text-sm">
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
                <h1 className="text-center text-[#1c1c0d] text-[32px] lg:text-4xl font-bold max-w-[720px] mx-auto">
                  Listo para empezar? 🚀
                </h1>
                <div className="flex justify-center">
                  <a href="./Componentes/register.html">
                    <button className="bg-[#f2f20d] text-[#1c1c0d] text-sm lg:text-base font-bold rounded-full h-10 lg:h-12 px-4 lg:px-5">
                      Registrarse
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* Sección Acerca de nosotros */}
            <div className="px-4 py-5 lg:px-0">
              <h2 className="text-[#1c1c0d] text-[22px] font-bold pb-3">
                Acerca de nosotros
              </h2>
              <p className="text-[#1c1c0d] text-base font-normal pb-3">
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
