import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Volume2, VolumeX, Settings } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import HighlightLetter from './ui/HighlightLetter';

const CardExtractedText = ({ extractedText }) => {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState('paginated'); // 'paginated' | 'lyrics'
  const [isMuted, setIsMuted] = useState(true); // Default muted
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  // 🔥 USAR DIRECTAMENTE LAS PÁGINAS DEL BACKEND
  useEffect(() => {
    if (!extractedText || !extractedText.pages) return;
    setPages(extractedText.pages);
    setCurrentPage(0);
  }, [extractedText]);

  // 🗣️ Cargar voces disponibles
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      // Filtrar voces en español
      const spanishVoices = availableVoices.filter(v => v.lang.startsWith('es'));
      setVoices(spanishVoices);

      // Intentar seleccionar la mejor voz por defecto
      if (spanishVoices.length > 0) {
        // Priorizar voces de Google o Microsoft que suelen ser mejores
        const bestVoice = spanishVoices.find(v =>
          v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Natural')
        ) || spanishVoices[0];
        setSelectedVoice(bestVoice);
      }
    };

    loadVoices();

    // Chrome a veces carga las voces asíncronamente
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // 🔥 Intersection Observer para resaltar elementos y TTS (SOLO EN MODO LYRICS)
  useEffect(() => {
    if (viewMode !== 'lyrics') {
      window.speechSynthesis.cancel(); // Stop speaking if leaving lyrics mode
      return;
    }

    const observerOptions = {
      root: document.querySelector('#lyrics-container'),
      rootMargin: '-45% 0px -45% 0px', // Zona activa en el centro
      threshold: 0
    };

    const callback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active-lyric');
          entry.target.classList.remove('inactive-lyric');

          // 🗣️ TTS Logic
          if (!isMuted) {
            window.speechSynthesis.cancel(); // Stop previous
            const textToSpeak = entry.target.innerText;
            if (textToSpeak && textToSpeak.trim().length > 0) {
              const utterance = new SpeechSynthesisUtterance(textToSpeak);
              utterance.lang = 'es-ES'; // Force Spanish

              if (selectedVoice) {
                utterance.voice = selectedVoice;
              }

              utterance.rate = 0.9; // Slightly slower for better comprehension
              window.speechSynthesis.speak(utterance);
            }
          }

        } else {
          entry.target.classList.add('inactive-lyric');
          entry.target.classList.remove('active-lyric');
        }
      });
    };

    const observer = new IntersectionObserver(callback, observerOptions);
    // Esperar un poco para que el DOM se renderice
    setTimeout(() => {
      const elements = document.querySelectorAll('.extracted-element');
      elements.forEach(el => observer.observe(el));
    }, 100);

    return () => {
      observer.disconnect();
      window.speechSynthesis.cancel(); // Cleanup on unmount/change
    };
  }, [pages, viewMode, isMuted, selectedVoice]);

  // 🔥 Keyboard Navigation for Lyrics Mode
  useEffect(() => {
    if (viewMode !== 'lyrics') return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();

        const elements = Array.from(document.querySelectorAll('.extracted-element'));
        if (elements.length === 0) return;

        // Find currently active element
        const activeIndex = elements.findIndex(el => el.classList.contains('active-lyric'));

        let nextIndex = 0;
        if (activeIndex !== -1) {
          if (e.key === 'ArrowDown') {
            nextIndex = Math.min(activeIndex + 1, elements.length - 1);
          } else {
            nextIndex = Math.max(activeIndex - 1, 0);
          }
        } else {
          // If none active, start from 0 (or stay at 0)
          nextIndex = e.key === 'ArrowDown' ? 0 : 0;
        }

        const targetElement = elements[nextIndex];
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, pages]);

  const handlePrev = () => setCurrentPage(p => Math.max(p - 1, 0));
  const handleNext = () => setCurrentPage(p => Math.min(p + 1, pages.length - 1));

  if (pages.length === 0) {
    return (
      <div className="w-full box-border">
        <div className="h-96 overflow-y-auto p-5 rounded-lg bg-pastelVeryLightYellow dark:bg-[#1a1a1a] shadow flex items-center justify-center text-gray-500">
          No hay texto extraído para mostrar.
        </div>
      </div>
    );
  }

  // 🔥 Renderers dinámicos según el modo
  const renderers = {
    p: ({ children }) => (
      <p
        className={viewMode === 'lyrics'
          ? "extracted-element text-xl leading-relaxed mb-12 tracking-wide text-left max-w-prose transition-all duration-500 ease-in-out transform origin-left"
          : "text-lg leading-relaxed mb-6 tracking-wide text-justify w-full"
        }
        style={{ fontFamily: 'OpenDyslexic', lineHeight: viewMode === 'lyrics' ? '1.6' : '1.5' }}
      >
        <HighlightLetter color='blue'>
          {children}
        </HighlightLetter>
      </p>
    ),

    strong: ({ children }) => (
      <span className="font-bold text-gray-900 dark:text-white">
        {children}
      </span>
    ),

    em: ({ children }) => (
      <span className="italic text-gray-800 dark:text-gray-200">
        {children}
      </span>
    ),

    blockquote: ({ children }) => (
      <blockquote className={viewMode === 'lyrics'
        ? "extracted-element border-l-4 border-yellow-400 pl-4 italic my-8 text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-r max-w-prose transition-all duration-500 ease-in-out origin-left"
        : "border-l-4 border-yellow-400 pl-4 italic my-4 text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-r w-full text-justify"
      }>
        {children}
      </blockquote>
    ),

    ul: ({ children }) => (
      <ul className={viewMode === 'lyrics'
        ? "extracted-element list-disc pl-6 mb-12 space-y-4 max-w-prose text-left transition-all duration-500 ease-in-out origin-left"
        : "list-disc pl-6 mb-6 space-y-2 w-full text-justify"
      }>
        {children}
      </ul>
    ),

    ol: ({ children }) => (
      <ol className={viewMode === 'lyrics'
        ? "extracted-element list-decimal pl-6 mb-12 space-y-4 max-w-prose text-left transition-all duration-500 ease-in-out origin-left"
        : "list-decimal pl-6 mb-6 space-y-2 w-full text-justify"
      }>
        {children}
      </ol>
    ),

    h1: ({ children }) => (
      <h1
        className={viewMode === 'lyrics'
          ? "extracted-element font-bold mb-10 mt-12 tracking-wide text-gray-900 dark:text-gray-100 text-left max-w-prose transition-all duration-500 ease-in-out origin-left"
          : "font-bold mb-6 mt-8 tracking-wide text-gray-900 dark:text-gray-100 text-justify w-full"
        }
        style={{ fontFamily: 'OpenDyslexic' }}
      >
        <HighlightLetter size={viewMode === 'lyrics' ? 'text-4xl' : 'text-3xl'} color="green">
          {children}
        </HighlightLetter>
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        className={viewMode === 'lyrics'
          ? "extracted-element text-3xl font-bold mb-8 mt-10 tracking-wide text-gray-900 dark:text-gray-100 text-left max-w-prose transition-all duration-500 ease-in-out origin-left"
          : "text-2xl font-bold mb-4 mt-6 tracking-wide text-gray-900 dark:text-gray-100 text-justify w-full"
        }
        style={{ fontFamily: 'OpenDyslexic' }}
      >
        <HighlightLetter color="red">
          {children}
        </HighlightLetter>
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className={viewMode === 'lyrics'
          ? "extracted-element text-2xl font-bold mb-6 mt-8 tracking-wide text-gray-900 dark:text-gray-100 text-left max-w-prose transition-all duration-500 ease-in-out origin-left"
          : "text-xl font-bold mb-3 mt-5 tracking-wide text-gray-900 dark:text-gray-100 text-justify w-full"
        }
        style={{ fontFamily: 'OpenDyslexic' }}
      >
        <HighlightLetter color="blue">
          {children}
        </HighlightLetter>
      </h3>
    ),

    li: ({ children }) => (
      <li
        className={viewMode === 'lyrics'
          ? "text-xl tracking-wide text-gray-700 dark:text-gray-300"
          : "text-lg tracking-wide text-gray-700 dark:text-gray-300 text-justify"
        }
        style={{ fontFamily: 'OpenDyslexic' }}
      >
        <HighlightLetter color="red">
          {children}
        </HighlightLetter>
      </li>
    ),
  };

  return (
    <div className="w-full box-border flex flex-col h-full">
      <style>{`
        .active-lyric {
          opacity: 1;
          transform: scale(1.05);
          filter: blur(0px);
        }
        .inactive-lyric {
          opacity: 0.3;
          transform: scale(1);
          filter: blur(0.5px);
        }
        #lyrics-container {
          scroll-behavior: smooth;
          mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
        }
      `}</style>

      {/* Header con Toggle */}
      <div className="p-5 rounded-t-lg bg-yellow-200 dark:bg-yellow-800 shadow-inner z-10 relative flex justify-between items-center">
        <h2
          className="text-2xl font-bold text-gray-900 dark:text-white"
          style={{ fontFamily: 'OpenDyslexic' }}
        >
          Lectura Guiada
        </h2>

        <div className="flex items-center gap-2">
          {viewMode === 'lyrics' && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                  className="p-2 rounded-full bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 transition-colors"
                  title="Configurar voz"
                >
                  <Settings size={20} className="text-gray-600 dark:text-gray-300" />
                </button>

                {showVoiceSettings && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 z-50 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Seleccionar Voz</h4>
                    <select
                      className="w-full p-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={selectedVoice?.name || ''}
                      onChange={(e) => {
                        const voice = voices.find(v => v.name === e.target.value);
                        setSelectedVoice(voice);
                        setShowVoiceSettings(false);
                      }}
                    >
                      {voices.map(v => (
                        <option key={v.name} value={v.name}>
                          {v.name.replace('Microsoft ', '').replace('Google ', '')}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-full bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 transition-colors"
                title={isMuted ? "Activar narrador" : "Silenciar narrador"}
              >
                {isMuted ? <VolumeX size={20} className="text-gray-600 dark:text-gray-300" /> : <Volume2 size={20} className="text-blue-600 dark:text-blue-400" />}
              </button>
            </div>
          )}

          <div className="flex bg-white/50 dark:bg-black/20 rounded-full p-1">
            <button
              onClick={() => setViewMode('paginated')}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${viewMode === 'paginated'
                ? 'bg-yellow-400 text-gray-900 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-white/30'
                }`}
            >
              Paginado
            </button>
            <button
              onClick={() => setViewMode('lyrics')}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${viewMode === 'lyrics'
                ? 'bg-yellow-400 text-gray-900 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-white/30'
                }`}
            >
              Lyrics
            </button>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="relative h-[50vh] overflow-hidden bg-pastelVeryLightYellow dark:bg-[#1a1a1a] rounded-b-lg shadow">

        {viewMode === 'paginated' ? (
          // --- VISTA PAGINADA ---
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-hidden relative">
              <div
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${currentPage * 100}%)` }}
              >
                {pages.map((page, i) => (
                  <div key={i} className="w-full h-full p-8 flex-shrink-0 overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                      <ReactMarkdown
                        children={page.text}
                        remarkPlugins={[remarkGfm]}
                        components={renderers}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Paginación Controls */}
            <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-black/20">
              <button
                onClick={handlePrev}
                disabled={currentPage === 0}
                className="p-2 rounded-full bg-yellow-300 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
              >
                <ArrowLeft size={24} className="text-gray-800" />
              </button>

              <span className="text-lg font-medium text-gray-700 dark:text-gray-300" style={{ fontFamily: 'OpenDyslexic' }}>
                Página {currentPage + 1} de {pages.length}
              </span>

              <button
                onClick={handleNext}
                disabled={currentPage === pages.length - 1}
                className="p-2 rounded-full bg-yellow-300 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
              >
                <ArrowRight size={24} className="text-gray-800" />
              </button>
            </div>
          </div>
        ) : (
          // --- VISTA LYRICS ---
          <div
            id="lyrics-container"
            className="h-full overflow-y-auto px-8 py-32 scroll-smooth"
          >
            <div className="flex flex-col items-start max-w-3xl mx-auto space-y-8">
              {pages.map((page, i) => (
                <ReactMarkdown
                  key={i}
                  children={page.text}
                  remarkPlugins={[remarkGfm]}
                  components={renderers}
                />
              ))}
              <div className="h-[40vh] w-full"></div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default CardExtractedText;
