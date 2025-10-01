import React from 'react';
import type { Planet, CustomPlanetParams, MainViewTab } from '../types';
import PlanetSelector from './PlanetSelector';
import PlanetCreator from './PlanetCreator';

interface MainViewProps {
  activeTab: MainViewTab;
  onTabChange: (tab: MainViewTab) => void;
  onSelectPlanet: (planet: Planet) => void;
  onGenerate: (params: CustomPlanetParams) => void;
  onAnalyzeLife: (planet: Planet) => void;
  onStartAstronautChat: () => void;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => {
  const baseClasses = "px-6 py-3 text-lg font-semibold rounded-t-lg transition-colors duration-300 focus:outline-none";
  const activeClasses = "bg-gray-800 text-cyan-400 border-b-2 border-cyan-400";
  const inactiveClasses = "text-gray-400 hover:text-white";
  return (
    <button onClick={onClick} className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
      {children}
    </button>
  );
};

const MainView: React.FC<MainViewProps> = ({ activeTab, onTabChange, onSelectPlanet, onGenerate, onAnalyzeLife, onStartAstronautChat }) => {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 bg-gradient-to-b from-gray-900 to-indigo-900">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
          شبیه‌ساز سیارات هوشمند
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          یک سیاره را برای کاوش انتخاب کنید، دنیای جدید خود را بسازید، یا با یک فضانورد درباره شگفتی‌های کیهان صحبت کنید.
        </p>
      </div>

      <div className="w-full max-w-7xl">
        <div className="border-b border-gray-700 mb-8 flex justify-center flex-wrap">
            <TabButton active={activeTab === 'explore'} onClick={() => onTabChange('explore')}>
                کاوش سیارات
            </TabButton>
            <TabButton active={activeTab === 'create'} onClick={() => onTabChange('create')}>
                خلق سیاره
            </TabButton>
            <TabButton active={activeTab === 'life'} onClick={() => onTabChange('life')}>
                تحلیل حیات
            </TabButton>
            <TabButton active={activeTab === 'astronaut'} onClick={() => onTabChange('astronaut')}>
                گفتگو با فضانورد
            </TabButton>
        </div>

        <div>
            {activeTab === 'explore' && (
                <PlanetSelector onSelectPlanet={onSelectPlanet} />
            )}
            {activeTab === 'create' && (
                <PlanetCreator onGenerate={onGenerate} />
            )}
            {activeTab === 'life' && (
                <div>
                    <p className="text-center text-gray-400 mb-6 max-w-2xl mx-auto">
                        سیاره‌ای را انتخاب کنید تا هوش مصنوعی پتانسیل وجود حیات و ویژگی‌های احتمالی آن را بر اساس داده‌های علمی تحلیل کند.
                    </p>
                    <PlanetSelector onSelectPlanet={onAnalyzeLife} />
                </div>
            )}
             {activeTab === 'astronaut' && (
                <div className="text-center">
                    <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-8 border border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-4">گفتگو با یک کاوشگر فضا</h2>
                        <p className="text-gray-400 mb-6">
                            با یک فضانورد باتجربه صحبت کنید. از او درباره سفرهایش به سیارات، زندگی در فضا و دیدگاه او نسبت به آینده بشریت در کیهان بپرسید.
                        </p>
                        <button 
                            onClick={onStartAstronautChat}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
                        >
                            شروع گفتگو
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MainView;
