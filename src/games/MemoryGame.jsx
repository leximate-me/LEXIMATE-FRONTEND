import React, { useState, useEffect } from 'react';
import './MemoryGame.css'; // Importar el archivo CSS personalizado

// Importar imágenes
import cardBack from '../assets/memorama/img/card.png';
import heartImg from '../assets/memorama/img/heart.png';
import diamondImg from '../assets/memorama/img/diamond.png';
import spadesImg from '../assets/memorama/img/spades.png';
import clubsImg from '../assets/memorama/img/clubs.png';

import { useAuth } from '../context/AuthContext';

const MemoryGame = () => {
  const initialCards = [
    { id: 1, type: 'heart', img: heartImg, flipped: false },
    { id: 2, type: 'diamond', img: diamondImg, flipped: false },
    { id: 3, type: 'spades', img: spadesImg, flipped: false },
    { id: 4, type: 'clubs', img: clubsImg, flipped: false },
    { id: 5, type: 'diamond', img: diamondImg, flipped: false },
    { id: 6, type: 'heart', img: heartImg, flipped: false },
    { id: 7, type: 'spades', img: spadesImg, flipped: false },
    { id: 8, type: 'clubs', img: clubsImg, flipped: false },
  ];

  const [cards, setCards] = useState(
    initialCards.sort(() => Math.random() - 0.5)
  );
  const [flippedCards, setFlippedCards] = useState([]);
  const [puntos, setPuntos] = useState(0);
  const [time, setTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [errores, setErrores] = useState(0);
  const [ranking, setRanking] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const id = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
    setIntervalId(id);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCard, secondCard] = flippedCards;
      if (firstCard.type === secondCard.type) {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.type === firstCard.type ? { ...card, matched: true } : card
            )
          );
          setPuntos((prevPuntos) => prevPuntos + 1);
          setFlippedCards([]);
        }, 1000);
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, flipped: false }
                : card
            )
          );
          setFlippedCards([]);
          setErrores((prevErrores) => prevErrores + 1);
        }, 1000);
      }
    }
  }, [flippedCards]);

  useEffect(() => {
    if (puntos === initialCards.length / 2 && !gameOver) {
      clearInterval(intervalId);
      setGameOver(true);
      updateRanking();
    }
  }, [puntos, intervalId, gameOver]);

  const updateRanking = () => {
    const newRanking = [
      ...ranking,
      { id: user.id, puntos, time, errores },
    ].sort((a, b) => {
      if (a.puntos !== b.puntos) return b.puntos - a.puntos;
      if (a.errores !== b.errores) return a.errores - b.errores;
      return a.time - b.time;
    });
    setRanking(newRanking);
  };

  const handleCardClick = (id) => {
    if (flippedCards.length < 2) {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === id ? { ...card, flipped: true } : card
        )
      );
      setFlippedCards((prevFlipped) => [
        ...prevFlipped,
        cards.find((card) => card.id === id),
      ]);
    }
  };

  const handleRestart = () => {
    setCards(initialCards.sort(() => Math.random() - 0.5));
    setPuntos(0);
    setTime(0);
    setGameOver(false);
    setFlippedCards([]);
    setErrores(0);
    const id = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
    setIntervalId(id);
  };

  return (
    <div className="bg-dark text-warning flex flex-col items-center justify-center space-y-20">
      <nav className="mb-4 navbar navbar-expand-lg text-uppercase bg-black p-4 shadow-lg ">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-3xl font-bold">Memory Game</h1>
          <div className="text-white text-xl">
            <span>Puntos: {puntos}</span> | <span>Tiempo: {time}s</span> |{' '}
            <span>Errores: {errores}</span>
          </div>
        </div>
      </nav>
      <div className="container space-x-10 flex justify-center">
        <div className="w-full md:w-3/4 lg:w-1/2">
          <div className="grid grid-cols-4 gap-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`relative transform transition-transform duration-500 ${
                  card.flipped || card.matched
                    ? 'rotate-y-180 animate-flip'
                    : ''
                }`}
                onClick={() => handleCardClick(card.id)}
              >
                <img
                  src={card.flipped || card.matched ? card.img : cardBack}
                  alt="reverso"
                  className={`card-img w-full h-full object-cover rounded-lg shadow-lg`}
                />
              </div>
            ))}
          </div>
          {gameOver && (
            <div className="text-center mt-4">
              <h2 className="text-white text-2xl font-bold">¡Has ganado!</h2>
              <button
                className="btn btn-primary m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleRestart}
              >
                Jugar de nuevo
              </button>
            </div>
          )}
        </div>
        <div className="w-full md:w-1/4 lg:w-1/4 bg-gray-800 p-4 rounded-lg shadow-lg text-white">
          <h2 className="text-2xl font-bold mb-4">Ranking</h2>
          <ul>
            {ranking.map((entry, index) => (
              <li key={index}>
                user: {entry.id}, Puntos: {entry.puntos}, Tiempo: {entry.time}s,
                Errores: {entry.errores}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MemoryGame;
