import React, { useState } from 'react';
import type { Planet, SimulationData, ChatRole } from '../types';

interface SimulationViewProps {
  planet: Planet;
  data: SimulationData;
  onStartChat: (role: ChatRole, persona: string) => void;
  onBack: () => void;
}

// Fix: Replaced JSX.Element with React.ReactNode to resolve namespace error.
const InfoCard: React.FC<{ title: string; content: string; icon: React.ReactNode }> = ({ title, content, icon }) => (
  <div className="bg-gray-800 bg-opacity-70 rounded-lg p-6 border border-gray-700 flex flex-col h-full">
    <div className="flex items-center mb-4">
      <div className="text-cyan-400 mr-3">{icon}</div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
    </div>
    <p className="text-gray-300 flex-grow whitespace-pre-line">{content}</p>
  </div>
);

const ResidentModal: React.FC<{ onSelect: (role: ChatRole, persona: string) => void; onClose: () => void; }> = ({ onSelect, onClose }) => {
  const residents: { role: ChatRole; persona: string; description: string }[] = [
    { role: 'مهندس', persona: 'یک مهندس سازه', description: 'درباره فناوری و زیرساخت‌ها' },
    { role: 'شهروند', persona: 'یک شهروند عادی', description: 'درباره زندگی روزمره و فرهنگ' },
    { role: 'پزشک', persona: 'یک پزشک متخصص', description: 'درباره سلامت و بیولوژی' },
    { role: 'دانشمند', persona: 'یک محقق سیاره‌شناس', description: 'درباره محیط زیست و علم' },
    { role: 'دولتمرد', persona: 'یک مقام دولتی', description: 'درباره قوانین و حکومت' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg p-8 max-w-lg w-full border border-cyan-500" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-center text-white">با یکی از ساکنان صحبت کنید</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {residents.map(res => (
            <button
              key={res.role}
              onClick={() => onSelect(res.role, res.persona)}
              className="bg-gray-700 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 text-right"
            >
              <p className="text-lg">{res.role}</p>
              <p className="text-sm text-gray-300">{res.description}</p>
            </button>
          ))}
        </div>
        <button onClick={onClose} className="mt-6 w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">
          بستن
        </button>
      </div>
    </div>
  );
};


const SimulationView: React.FC<SimulationViewProps> = ({ planet, data, onStartChat, onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cityImageUrl = `https://pollinations.ai/p/${encodeURIComponent(data.cityImagePrompt)}`;
  
  const icons = {
    lifestyle: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.004 3.004 0 015.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    government: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
    military: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20" /></svg>,
    technology: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
       {isModalOpen && <ResidentModal onSelect={(role, persona) => { onStartChat(role, persona); setIsModalOpen(false); }} onClose={() => setIsModalOpen(false)} />}
      <div className="max-w-7xl mx-auto">
        <button onClick={onBack} className="mb-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
          &rarr; بازگشت به انتخاب سیاره
        </button>
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            {data.cityName}
          </h1>
          <p className="text-xl text-gray-300 mt-2">شهری در سیاره {planet.name}</p>
        </div>

        <div className="mb-8 w-full aspect-video bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-2xl">
            <img src={cityImageUrl} alt={`نمایی از شهر ${data.cityName}`} className="w-full h-full object-cover" />
        </div>

        <div className="bg-gray-800 bg-opacity-70 rounded-lg p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-3">نمای کلی شهر</h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">{data.cityOverview}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <InfoCard title="سبک زندگی" content={data.lifestyle} icon={icons.lifestyle} />
          <InfoCard title="سیستم دولت" content={data.government} icon={icons.government} />
          <InfoCard title="سیستم نظامی" content={data.military} icon={icons.military} />
          <InfoCard title="تکنولوژی" content={data.technology} icon={icons.technology} />
        </div>

        <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">بیشتر کاوش کنید</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => onStartChat('راهنمای تور', 'راهنمای تور')}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
            >
              از راهنمای تور سوال بپرسید
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
            >
              با یکی از ساکنان صحبت کنید
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationView;
