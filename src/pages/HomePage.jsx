import React from 'react';
import ModalVerification from '../components/ui/ModalVerification';
import { useAuth } from '../context/AuthContext';
import leximate from '../assets/LEXIMATE.JPG';

function HomePage() {

  const { user } = useAuth();

  // primero se verifica si el usuario existe y si no ha sido verificado
  console.log('user',user?.verify);


  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      {user && !user.verify &&(
        <ModalVerification /> 
      )}
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        {/* SECCIÓN DE BÚSQUEDA */}
        <div id="home" className="@container">
          <div className="@[480px]:p-4">
            <div
              className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-start justify-end px-4 pb-10 @[480px]:px-10 rounded-md"
              style={{
                backgroundImage:
                  `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url(${leximate})`,
              }}
            >
              <div className="flex flex-col gap-2 text-left">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                  Bienvenido a LexiMate! 👋
                </h1>
              </div>
              <label className="flex flex-col min-w-40 h-14 w-full max-w-[480px] @[480px]:h-16">
                <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                  <div
                    className="text-[#8a8a60] flex border border-[#e6e6db] bg-white items-center justify-center pl-[15px] rounded-l-xl border-r-0"
                    data-icon="MagnifyingGlass"
                    data-size="20px"
                    data-weight="regular"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20px"
                      height="20px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                    </svg>
                  </div>
                  <input
                    placeholder="Busca un juego, una tarea, etc..."
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#181811] focus:outline-0 focus:ring-0 border border-[#e6e6db] bg-white focus:border-[#e6e6db] h-full placeholder:text-[#8a8a60] px-[15px] rounded-r-none border-r-0 pr-2 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal"
                    value=""
                  />
                  <div className="flex items-center justify-center rounded-r-xl border-l-0 border border-[#e6e6db] bg-white pr-[7px]">
                    <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#f2f20d] text-[#181811] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]">
                      <span className="truncate">Ir</span>
                    </button>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* SECCIÓN DE DESTACADOS */}
        <div id="featured" className="h-12"></div>
        <h2 className="text-[#181811] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Más destacados
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
          <div className="flex flex-col gap-3 pb-3">
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
              style={{
                backgroundImage:
                  'url("https://cdn.usegalileo.ai/sdxl10/a0f3c996-62d9-4fe8-b079-d288433088cf.png")',
              }}
            ></div>
            <p className="text-[#181811] text-base font-medium leading-normal">
              The Lion and the Mouse
            </p>
          </div>
          <div className="flex flex-col gap-3 pb-3">
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
              style={{
                backgroundImage:
                  'url("https://cdn.usegalileo.ai/sdxl10/24f76cd9-e978-4115-8c33-d08f704a0ad7.png")',
              }}
            ></div>
            <p className="text-[#181811] text-base font-medium leading-normal">
              The Tortoise and the Hare
            </p>
          </div>
          <div className="flex flex-col gap-3 pb-3">
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
              style={{
                backgroundImage:
                  'url("https://cdn.usegalileo.ai/sdxl10/ea57bed9-a03b-43c1-a664-458eaeef88f1.png")',
              }}
            ></div>
            <p className="text-[#181811] text-base font-medium leading-normal">
              The Boy Who Cried Wolf
            </p>
          </div>
        </div>

        {/* SECCIÓN DE CLASES */}
        <div className="border-t-2 border-gray-300">
          <h2
            id="tasks"
            className="text-[#181811] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5"
          >
            Clases
          </h2>
          <div className="p-4 @container">
            <div className="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start">
              <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                style={{ backgroundImage: 'url("../assets/matematicas.jpeg")' }}
              ></div>
              <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 @xl:px-4">
                <p className="text-[#181811] text-lg font-bold leading-tight tracking-[-0.015em]">
                  Matemáticas
                </p>
                <div className="flex items-end gap-3 justify-between">
                  <p className="text-[#8a8a60] text-base font-normal leading-normal">
                    No tienes tareas pendientes
                  </p>
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f2f20d] text-[#181811] text-sm font-medium leading-normal">
                    <span className="truncate">Ir</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 @container">
            <div className="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start">
              <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                style={{ backgroundImage: 'url("../assets/lengua.png")' }}
              ></div>
              <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 @xl:px-4">
                <p className="text-[#181811] text-lg font-bold leading-tight tracking-[-0.015em]">
                  Lengua
                </p>
                <div className="flex items-end gap-3 justify-between">
                  <p className="text-[#8a8a60] text-base font-normal leading-normal">
                    Tienes tareas pendientes
                  </p>
                  <div className="flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
                    3
                  </div>
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f2f20d] text-[#181811] text-sm font-medium leading-normal">
                    <span className="truncate">Ir</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 @container">
            <div className="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start">
              <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                style={{ backgroundImage: 'url("../assets/ingles.png")' }}
              ></div>
              <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 @xl:px-4">
                <p className="text-[#181811] text-lg font-bold leading-tight tracking-[-0.015em]">
                  Inglés
                </p>
                <div className="flex items-end gap-3 justify-between">
                  <p className="text-[#8a8a60] text-base font-normal leading-normal">
                    Tienes tareas pendientes
                  </p>
                  <div className="flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
                    1
                  </div>
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f2f20d] text-[#181811] text-sm font-medium leading-normal">
                    <span className="truncate">Ir</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <br />

        {/* SECCIÓN DE JUEGOS INTERACTIVOS */}
        <div className="border-t-2 border-gray-300">
          <h2
            id="games"
            className="text-[#181811] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5"
          >
            Juegos interactivos
          </h2>
          <div className="p-4 @container">
            <div className="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start">
              <div
                className="w-40 h-40 bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                style={{ backgroundImage: 'url("../assets/card-game.webp")' }}
              ></div>
              <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 @xl:px-4">
                <p className="text-[#181811] text-lg font-bold leading-tight tracking-[-0.015em]">
                  Memorama
                </p>
                <div className="flex items-end gap-3 justify-between">
                  <p className="text-[#8a8a60] text-base font-normal leading-normal">
                    Estimula tu memoria encontrando el par de cada carta
                  </p>
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f2f20d] text-[#181811] text-sm font-medium leading-normal">
                    <span className="truncate">Jugar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 @container">
            <div className="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start">
              <div
                className="w-40 h-40 bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                style={{ backgroundImage: 'url("../assets/ahorcado.png")' }}
              ></div>
              <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 @xl:px-4">
                <p className="text-[#181811] text-lg font-bold leading-tight tracking-[-0.015em]">
                  Rescate de letras
                </p>
                <div className="flex items-end gap-3 justify-between">
                  <p className="text-[#8a8a60] text-base font-normal leading-normal">
                    Adivina la palabra con un límite de intentos
                  </p>
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f2f20d] text-[#181811] text-sm font-medium leading-normal">
                    <span className="truncate">Jugar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
