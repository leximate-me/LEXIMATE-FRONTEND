import React from 'react';
import MemoryGame from '../games/MemoryGame';
import { Link } from 'react-router-dom';

function GamesPage() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-semibold text-center py-5">Juegos</h1>
      <div className="flex flex-col items-center space-y-4">
        <Link
          to="/games/memory"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Memorama
        </Link>
      </div>
    </div>
  );
}

export default GamesPage;
