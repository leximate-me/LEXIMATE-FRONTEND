import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const CardExtractedText = ({ extractedText }) => {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  // Dividir el texto en páginas según "-- x of x --"
  useEffect(() => {
    if (!extractedText || extractedText.length === 0) return;

    const fullText = extractedText.map(item => item.text).join('\n');
    const splitPages = fullText
      .split(/--\s*\d+\s*of\s*\d+\s*--/)
      .map(p => p.trim())
      .filter(p => p.length > 0);

    setPages(splitPages);
    setCurrentPage(0);
  }, [extractedText]);

  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 0));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, pages.length - 1));

  if (!pages || pages.length === 0) {
    return (
      <div className="w-full box-border">
        <div className="max-h-96 overflow-y-auto p-5 rounded-lg bg-pastelVeryLightYellow dark:bg-[#1a1a1a] shadow-[0px_8px_11px_-6px_#5c5c5c]">
          No hay texto extraído para mostrar.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full box-border flex flex-col h-full">
      {/* Contenedor fijo para el header */}
      <div className="p-5 rounded-t-lg bg-yellow-200 dark:bg-yellow-800 shadow-inner">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'OpenDyslexic' }}>
          Contenido Extraído
        </h2>
      </div>

      {/* Contenedor con scroll y animación de deslizamiento */}
      <div className="relative max-h-96 overflow-hidden bg-pastelVeryLightYellow dark:bg-[#1a1a1a] rounded-b-lg shadow-[0px_8px_11px_-6px_#5c5c5c]">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {pages.map((page, index) => (
            <div key={index} className="w-full p-5 flex-shrink-0">
              {page.split('\n').map((line, i) => (
                <p
                  key={i}
                  className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-2"
                  style={{ fontFamily: 'OpenDyslexic' }}
                >
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-2">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="px-3 py-1 rounded-lg bg-yellow-300 disabled:opacity-50"
        >
          <ArrowLeft size={25} />
        </button>

        <span className="text-sm text-gray-700 dark:text-gray-300">
          {currentPage + 1} / {pages.length}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPage === pages.length - 1}
          className="px-3 py-1 rounded-lg bg-yellow-300 disabled:opacity-50"
        >
          <ArrowRight size={25} />
        </button>
      </div>
    </div>
  );
};

export default CardExtractedText;
