import React from 'react';

const CardExtractedText = ({ extractedText }) => {
  // Función para procesar y renderizar el texto extraído
  const renderExtractedText = (extractedText) => {
    let titleWords = [];
    let subtitleAndParagraph = [];
    let output = [];

    extractedText.forEach((item, index) => {
      if (item.classification !== 'title') {
        subtitleAndParagraph.push(item.text);
      } else {
        if (subtitleAndParagraph.length > 0) {
          output.push(
            <p
              key={`subtitleAndParagraph-${index}`}
              className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4"
              style={{ fontFamily: 'OpenDyslexic' }}
            >
              {subtitleAndParagraph
                .join(' ')
                .split('\n')
                .map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                    <br />
                  </React.Fragment>
                ))}
            </p>
          );
          subtitleAndParagraph = [];
        }
      }

      if (item.classification === 'title') {
        titleWords.push(item.text);
      } else {
        if (titleWords.length > 0) {
          output.push(
            <p
              key={`title-${index}`}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
              style={{ fontFamily: 'OpenDyslexic' }}
            >
              {titleWords
                .join(' ')
                .split('\n')
                .map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                    <br />
                  </React.Fragment>
                ))}
            </p>
          );
          titleWords = [];
        }
      }
    });

    if (titleWords.length > 0) {
      output.push(
        <p
          key="title-final"
          className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
          style={{ fontFamily: 'OpenDyslexic' }}
        >
          {titleWords
            .join(' ')
            .split('\n')
            .map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
                <br />
              </React.Fragment>
            ))}
        </p>
      );
    }

    if (subtitleAndParagraph.length > 0) {
      output.push(
        <p
          key="subtitleAndParagraph-final"
          className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4"
          style={{ fontFamily: 'OpenDyslexic' }}
        >
          {subtitleAndParagraph
            .join(' ')
            .split('\n')
            .map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
                <br />
              </React.Fragment>
            ))}
        </p>
      );
    }

    return output;
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-4 box-border">
      {/* Contenedor con scroll */}
      <div className="max-h-96 overflow-y-auto p-5 border rounded-lg shadow-md bg-white dark:bg-[#1a1a1a] dark:border-[#fffd92]">
        {renderExtractedText(extractedText)}
      </div>
    </div>
  );
};

export default CardExtractedText;
