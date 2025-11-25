import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import HighlightLetter from './ui/HighlightLetter';

const CardExtractedText = ({ extractedText }) => {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);


  // 🔥 USAR DIRECTAMENTE LAS PÁGINAS DEL BACKEND
  useEffect(() => {
    if (!extractedText || !extractedText.pages) return;

    const backendPages = extractedText.pages.map(p => p.text);

    setPages(backendPages);
    setCurrentPage(0);
  }, [extractedText]);

  const handlePrev = () => setCurrentPage(p => Math.max(p - 1, 0));
  const handleNext = () => setCurrentPage(p => Math.min(p + 1, pages.length - 1));

  if (pages.length === 0) {
    return (
      <div className="w-full box-border">
        <div className="max-h-96 overflow-y-auto p-5 rounded-lg bg-pastelVeryLightYellow dark:bg-[#1a1a1a] shadow">
          No hay texto extraído para mostrar.
        </div>
      </div>
    );
  }

  // 🔥 Helpers seguros para HighlightLetter
  const safeText = (children) =>
    Array.isArray(children)
      ? children.join(" ")
      : typeof children === "string"
      ? children
      : "";

  // 🔥 Renderers con colores rotativos por párrafo
  const renderers = {
    p: ({ children }) => {
      const text = safeText(children);
      const paragraphs = text.split("\n").filter(p => p.trim() !== "");

      console.log(extractedText)

      return (
        <>
          {paragraphs.map((para, idx) => (
            <p
              key={idx}
              className="text-lg leading-relaxed mb-8 tracking-more-wide text-gray-700 dark:text-gray-300"
              style={{ fontFamily: 'OpenDyslexic' }}
            >
              <HighlightLetter color='blue'>
                {para}
              </HighlightLetter>
            </p>
          ))}
        </>
      );
    },

    h1: ({ children }) => (
      <h1
        className="font-bold mb-8 tracking-more-wide text-gray-900 dark:text-gray-100"
        style={{ fontFamily: 'OpenDyslexic' }}
      >
        <HighlightLetter size='text-4xl' color="green">
          {safeText(children)}
        </HighlightLetter>
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        className="text-3xl font-bold mb-8 tracking-more-wide text-gray-900 dark:text-gray-100"
        style={{ fontFamily: 'OpenDyslexic' }}
      >
        <HighlightLetter color="red">
          {safeText(children)}
        </HighlightLetter>
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className="text-2xl font-bold mb-8 tracking-more-wide text-gray-900 dark:text-gray-100"
        style={{ fontFamily: 'OpenDyslexic' }}
      >
        <HighlightLetter color="blue">
          {safeText(children)}
        </HighlightLetter>
      </h3>
    ),

    li: ({ children }) => (
      <li
        className="text-lg mb-8 tracking-more-wide text-gray-700 dark:text-gray-300"
        style={{ fontFamily: 'OpenDyslexic' }}
      >
        <HighlightLetter color="red">
          • {safeText(children)}
        </HighlightLetter>
      </li>
    ),
  };

  return (
    <div className="w-full box-border flex flex-col h-full">

      {/* Header */}
      <div className="p-5 rounded-t-lg bg-yellow-200 dark:bg-yellow-800 shadow-inner">
        <h2
          className="text-2xl font-bold text-gray-900 dark:text-white"
          style={{ fontFamily: 'OpenDyslexic' }}
        >
          Contenido Extraído
        </h2>
      </div>

      {/* Slide de páginas */}
      <div className="relative h-96 overflow-hidden bg-pastelVeryLightYellow dark:bg-[#1a1a1a] rounded-b-lg shadow">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {pages.map((page, i) => (
            <div key={i} className="w-full p-5 flex-shrink-0 overflow-y-auto h-96">

              <ReactMarkdown
                children={page}
                remarkPlugins={[remarkGfm]}
                components={renderers}
              />

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
