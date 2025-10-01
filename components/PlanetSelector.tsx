import React from 'react';
import type { Planet } from '../types';
import { PLANETS } from '../constants';

interface PlanetSelectorProps {
  onSelectPlanet: (planet: Planet) => void;
}

const PlanetSelector: React.FC<PlanetSelectorProps> = ({ onSelectPlanet }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      {PLANETS.map((planet) => (
        <div
          key={planet.nameEn}
          onClick={() => onSelectPlanet(planet)}
          className="group bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-cyan-400 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
        >
          <img src={planet.image} alt={planet.name} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
          <div className="p-5">
            <h2 className="text-2xl font-bold text-white mb-2">{planet.name}</h2>
            <p className="text-gray-400 text-sm">{planet.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlanetSelector;
