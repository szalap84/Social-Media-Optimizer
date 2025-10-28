
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent border-solid rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-gray-300">Analizuję tytuł...</p>
    </div>
  );
};

export default Loader;
