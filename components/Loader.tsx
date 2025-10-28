
import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "Analizuję treść pod kątem najlepszych praktyk...",
  "Konsultuję się z algorytmami...",
  "Generuję błyskotliwe sugestie...",
  "Szlifuję Twoją komunikację, aby lśniła!",
  "Optymalizuję pod zasięgi i zaangażowanie...",
  "Jeszcze chwila, tworzymy magię!"
];

const Loader: React.FC = () => {
  const [message, setMessage] = useState(MESSAGES[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = MESSAGES.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % MESSAGES.length;
        return MESSAGES[nextIndex];
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent border-solid rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-gray-300 text-center w-64">{message}</p>
    </div>
  );
};

export default Loader;
