export interface Planet {
  name: string;
  nameEn: string;
  description: string;
}

export interface Scientist {
  name: 'آلبرت اینشتین' | 'ماری کوری' | 'اسحاق نیوتن' | 'گالیلئو گالیله' | 'نیکولا تسلا' | 'لئوناردو داوینچی' | 'الن تورینگ' | 'روزالیند فرانکلین' | 'برایان کاکس' | 'ایلان ماسک' | 'نیل دگراس تایسون' | 'جنیفر دودنا';
  description: string;
  lifespan: string;
}

export interface SimulationData {
  cityName: string;
  cityOverview: string;
  lifestyle: string;
  technology: string;
  cityImagePrompt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text?: string;
  imageUrl?: string;
}

export type View = 'main' | 'simulation' | 'chat';
export type MainViewTab = 'explore' | 'create' | 'life' | 'scientists' | 'astronaut';

export type ChatRole = 'راهنمای تور' | 'مهندس' | 'شهروند' | 'پزشک' | 'دانشمند' | 'فضانورد' | 'آلبرت اینشتین' | 'ماری کوری' | 'اسحاق نیوتن' | 'گالیلئو گالیله' | 'نیکولا تسلا' | 'لئوناردو داوینچی' | 'الن تورینگ' | 'روزالیند فرانکلین' | 'برایان کاکس' | 'ایلان ماسک' | 'نیل دگراس تایسون' | 'جنیفر دودنا';

export interface ChatTarget {
  role: ChatRole;
  persona: string;
}

export interface CustomPlanetParams {
  name: string;
  planetType: string;
  atmosphere: string;
  gravity: string;
  lifeForm: string;
  resources: string;
  description: string;
}

export interface LifeAnalysisData {
  lifePossibility: string;
  dominantLifeForm: string;
  reasoning: string;
  adaptationFeatures: string;
  lifeFormImagePrompt: string;
}