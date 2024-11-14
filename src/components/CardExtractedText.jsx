import React from 'react';

const CardExtractedText = ({ extractedText }) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-4 box-border">
      {extractedText.map((item, index) => (
        <p
          key={index}
          className={`mb-4 text-lg leading-relaxed tracking-wide text-justify break-words ${
            item.classification === 'title' ? 'font-bold text-2xl' : 
            item.classification === 'subtitle' ? 'font-semibold text-xl' : 
            'text-base text-gray-800'
          }`}
        >
          {item.text}
        </p>
      ))}
    </div>
  );
};

export default CardExtractedText;
