import React, { useState } from 'react';
import type { CustomPlanetParams } from '../types';

interface PlanetCreatorProps {
  onGenerate: (params: CustomPlanetParams) => void;
}

const InputField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean }> = 
  ({ label, id, value, onChange, required }) => (
    <div>
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-300">{label}{required && ' *'}</label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
      />
    </div>
);

const SelectField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }> = 
  ({ label, id, value, onChange, children }) => (
    <div>
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-300">{label}</label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
      >
        {children}
      </select>
    </div>
);

const TextAreaField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number }> = 
  ({ label, id, value, onChange, rows = 3 }) => (
    <div>
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-300">{label}</label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
      ></textarea>
    </div>
);


const PlanetCreator: React.FC<PlanetCreatorProps> = ({ onGenerate }) => {
  const [params, setParams] = useState<CustomPlanetParams>({
    name: '',
    planetType: 'سنگی',
    atmosphere: 'غنی از اکسیژن',
    gravity: 'شبیه زمین',
    lifeForm: 'مبتنی بر کربن',
    resources: '',
    description: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setParams({ ...params, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (params.name.trim() === '') {
      setError('نام سیاره نمی‌تواند خالی باشد.');
      return;
    }
    setError('');
    onGenerate(params);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 border border-gray-700">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            سیاره خود را خلق کنید
          </h1>
          <p className="text-gray-400 mt-2">ویژگی‌های دنیای جدید خود را مشخص کرده و آن را شبیه‌سازی کنید.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField label="نام سیاره" id="name" value={params.name} onChange={handleChange} required />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField label="نوع سیاره" id="planetType" value={params.planetType} onChange={handleChange}>
              <option>سنگی</option>
              <option>غول گازی</option>
              <option>غول یخی</option>
              <option>اقیانوسی</option>
              <option>آتشفشانی</option>
            </SelectField>

            <SelectField label="اتمسفر" id="atmosphere" value={params.atmosphere} onChange={handleChange}>
              <option>غنی از اکسیژن</option>
              <option>غنی از متان</option>
              <option>غنی از دی‌اکسید کربن</option>
              <option>نازک و رقیق</option>
              <option>بدون اتمسفر</option>
            </SelectField>
            
            <SelectField label="گرانش" id="gravity" value={params.gravity} onChange={handleChange}>
              <option>کم</option>
              <option>شبیه زمین</option>
              <option>زیاد</option>
              <option>بسیار زیاد</option>
            </SelectField>

            <SelectField label="حیات غالب" id="lifeForm" value={params.lifeForm} onChange={handleChange}>
              <option>مبتنی بر کربن</option>
              <option>مبتنی بر سیلیکون</option>
              <option>حیات میکروبی</option>
              <option>گیاهی/جانوری پیچیده</option>
              <option>بدون حیات</option>
            </SelectField>
          </div>
          
          <InputField label="منابع کلیدی" id="resources" value={params.resources} onChange={handleChange} />
          <TextAreaField label="توضیحات اضافی" id="description" value={params.description} onChange={handleChange} />

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105">
            شبیه‌سازی کن!
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlanetCreator;
