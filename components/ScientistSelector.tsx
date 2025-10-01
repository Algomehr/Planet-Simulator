import React from 'react';
import type { Scientist } from '../types';
import { SCIENTISTS } from '../constants';

interface ScientistSelectorProps {
  onSelectScientist: (scientist: Scientist) => void;
}

const ScientistSelector: React.FC<ScientistSelectorProps> = ({ onSelectScientist }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      {SCIENTISTS.map((scientist) => (
        <div
          key={scientist.name}
          onClick={() => onSelectScientist(scientist)}
          className="group bg-gray-800 bg-opacity-50 rounded-lg p-6 shadow-lg border border-gray-700 hover:border-purple-400 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer flex flex-col h-full"
        >
          <h2 className="text-2xl font-bold text-white mb-1">{scientist.name}</h2>
          <p className="text-gray-400 text-sm mb-3">{scientist.lifespan}</p>
          <p className="text-gray-300 text-sm">{scientist.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ScientistSelector;
