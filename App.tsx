import React, { useState } from 'react';
import type { Planet, SimulationData, View, ChatRole, ChatTarget, CustomPlanetParams, MainViewTab, LifeAnalysisData, Scientist } from './types';
import MainView from './components/MainView';
import SimulationView from './components/SimulationView';
import ChatView from './components/ChatView';
import LoadingSpinner from './components/LoadingSpinner';
import { generateSimulation, generateLifeAnalysis } from './services/geminiService';
import LifeAnalysisResultModal from './components/LifeAnalysisResultModal';
import { SCIENTISTS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<View>('main');
  const [activeTab, setActiveTab] = useState<MainViewTab>('explore');
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [chatTarget, setChatTarget] = useState<ChatTarget | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lifeAnalysisData, setLifeAnalysisData] = useState<LifeAnalysisData | null>(null);

  const handleSelectPlanet = async (planet: Planet) => {
    setIsLoading(true);
    setError(null);
    setSelectedPlanet(planet);
    try {
      const data = await generateSimulation(planet.nameEn);
      setSimulationData(data);
      setView('simulation');
    } catch (err) {
      setError('خطا در شبیه‌سازی سیاره. لطفا دوباره تلاش کنید.');
      setView('main'); // Go back to main on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCustomPlanet = async (params: CustomPlanetParams) => {
    setIsLoading(true);
    setError(null);

    const customPlanet: Planet = {
      name: params.name,
      nameEn: params.name,
      description: params.description || 'سیاره‌ای که شما خلق کرده‌اید.',
      image: `https://picsum.photos/seed/${params.name.replace(/\s+/g, '-')}/800/600`
    };
    setSelectedPlanet(customPlanet);

    const planetDescription = `
      نام سیاره: ${params.name}
      نوع سیاره: ${params.planetType}
      اتمسفر: ${params.atmosphere}
      گرانش: ${params.gravity}
      حیات غالب: ${params.lifeForm}
      منابع کلیدی: ${params.resources}
      توضیحات اضافی: ${params.description}
    `;

    try {
      const data = await generateSimulation(planetDescription.trim());
      setSimulationData(data);
      setView('simulation');
    } catch (err) {
      setError('خطا در شبیه‌سازی سیاره سفارشی. لطفا دوباره تلاش کنید.');
      setView('main');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeLife = async (planet: Planet) => {
    setIsLoading(true);
    setError(null);
    setSelectedPlanet(planet);
    try {
        const data = await generateLifeAnalysis(planet.nameEn);
        setLifeAnalysisData(data);
    } catch (err) {
        setError('خطا در تحلیل حیات. لطفا دوباره تلاش کنید.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleStartChat = (role: ChatRole, persona: string) => {
    if (selectedPlanet && simulationData) {
      setChatTarget({ role, persona });
      setView('chat');
    }
  };

  const handleStartAstronautChat = () => {
    const astronautPlanet: Planet = {
        name: "فضا",
        nameEn: "Space",
        description: "سفر میان ستاره‌ای",
        image: ""
    };
    const astronautSimData: SimulationData = {
        cityName: "کهکشان راه شیری",
        cityOverview: "کاوش در فضا",
        lifestyle: "",
        technology: "",
        cityImagePrompt: ""
    };
    setSelectedPlanet(astronautPlanet);
    setSimulationData(astronautSimData);
    setChatTarget({ role: 'فضانورد', persona: 'یک فضانورد باتجربه' });
    setView('chat');
  };

  const handleStartScientistChat = (scientist: Scientist) => {
    const scientistPlanet: Planet = {
        name: "تاریخ علم",
        nameEn: "History of Science",
        description: "گفتگو با بزرگترین اذهان تاریخ",
        image: ""
    };
    const scientistSimData: SimulationData = {
        cityName: "عرصه دانش",
        cityOverview: "کاوش در ایده‌ها",
        lifestyle: "",
        technology: "",
        cityImagePrompt: ""
    };
    setSelectedPlanet(scientistPlanet);
    setSimulationData(scientistSimData);
    setChatTarget({ role: scientist.name, persona: scientist.description });
    setView('chat');
  };

  const handleBackToMain = () => {
    setView('main');
    setSelectedPlanet(null);
    setSimulationData(null);
    setError(null);
    setLifeAnalysisData(null);
  };
  
  const handleBackToSimulation = () => {
    setView('simulation');
    setChatTarget(null);
  };
  
  const getBackAction = () => {
    const scientistRoles = SCIENTISTS.map(s => s.name);
    if (chatTarget?.role === 'فضانورد' || scientistRoles.includes(chatTarget?.role as any)) {
        return handleBackToMain;
    }
    return handleBackToSimulation;
  }

  const renderView = () => {
    switch (view) {
      case 'simulation':
        if (selectedPlanet && simulationData) {
          return <SimulationView 
                    planet={selectedPlanet} 
                    data={simulationData} 
                    onStartChat={handleStartChat}
                    onBack={handleBackToMain}
                 />;
        }
        return null;
      case 'chat':
        if (selectedPlanet && simulationData && chatTarget) {
          return <ChatView 
                    planet={selectedPlanet} 
                    simulationData={simulationData} 
                    chatTarget={chatTarget}
                    onBack={getBackAction()}
                 />;
        }
        return null;
      case 'main':
      default:
        return <MainView 
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  onSelectPlanet={handleSelectPlanet}
                  onGenerate={handleGenerateCustomPlanet}
                  onAnalyzeLife={handleAnalyzeLife}
                  onStartScientistChat={handleStartScientistChat}
                  onStartAstronautChat={handleStartAstronautChat}
                />;
    }
  };

  return (
    <div className="App">
      {isLoading && <LoadingSpinner />}
      {error && (
        <div className="fixed top-5 right-5 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50 animate-pulse">
          <button onClick={() => setError(null)} className="float-left ml-2 text-xl font-bold">&times;</button>
          {error}
        </div>
      )}
      {lifeAnalysisData && selectedPlanet && (
          <LifeAnalysisResultModal 
            planetName={selectedPlanet.name}
            data={lifeAnalysisData}
            onClose={() => setLifeAnalysisData(null)}
          />
      )}
      {renderView()}
    </div>
  );
};

export default App;
