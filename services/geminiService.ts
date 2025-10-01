import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { SimulationData, ChatMessage, ChatTarget, LifeAnalysisData } from './types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const simulationSchema = {
  type: Type.OBJECT,
  properties: {
    cityName: { type: Type.STRING, description: 'یک نام خلاقانه و مناسب برای شهر' },
    cityOverview: { type: Type.STRING, description: 'توضیح کلی درباره شهر، معماری و ظاهر آن' },
    lifestyle: { type: Type.STRING, description: 'شرح سبک زندگی، فرهنگ و فعالیت‌های روزمره ساکنان' },
    technology: { type: Type.STRING, description: 'توضیح سطح فناوری، نوآوری‌ها و ابزارهای مورد استفاده' },
    cityImagePrompt: { type: Type.STRING, description: 'یک پرامپت انگلیسی دقیق و هنری برای هوش مصنوعی متن به عکس جهت تولید تصویر شهر. مثال: "futuristic martian city, red dust, glass domes, cyberpunk, hyperrealistic, octane render, 8k"' },
  },
  required: ['cityName', 'cityOverview', 'lifestyle', 'technology', 'cityImagePrompt'],
};

export async function generateSimulation(planetDescription: string): Promise<SimulationData> {
    try {
        const prompt = `شما یک شبیه‌ساز هوشمند حیات هستید. بر اساس داده‌های علمی شناخته شده یا توضیحات ارائه شده برای سیاره/قمر زیر، یک شهر آینده‌نگرانه قابل قبول طراحی کنید. توضیحات باید خلاقانه، علمی-تخیلی و جذاب باشد.

سیاره/قمر: "${planetDescription}"

توضیحات دقیق، خلاقانه و جذابی برای هر بخش ارائه دهید.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: simulationSchema,
                temperature: 0.8,
            },
        });
        
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        return data as SimulationData;
    } catch (error) {
        console.error("Error generating simulation:", error);
        throw new Error("Failed to generate simulation from AI.");
    }
}

const lifeAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    lifePossibility: { type: Type.STRING, description: 'احتمال وجود حیات (مثلاً: بالا، متوسط، کم، بسیار بعید)' },
    dominantLifeForm: { type: Type.STRING, description: 'توصیف شکل غالب حیات احتمالی (مثلاً: میکروب‌های شیمیوتروف، حیات مبتنی بر سیلیکون)' },
    reasoning: { type: Type.STRING, description: 'استدلال علمی دقیق برای این پیش‌بینی بر اساس ویژگی‌های سیاره' },
    adaptationFeatures: { type: Type.STRING, description: 'ویژگی‌های کلیدی سازگاری که این شکل از حیات برای بقا نیاز دارد' },
    lifeFormImagePrompt: { type: Type.STRING, description: 'یک پرامپت انگلیسی دقیق و هنری برای هوش مصنوعی متن به عکس جهت تولید تصویر شکل حیات. مثال: "bioluminescent silicon-based creature, Europa\'s deep ocean, dark, cinematic lighting, horror, detailed, macro shot"' },
  },
  required: ['lifePossibility', 'dominantLifeForm', 'reasoning', 'adaptationFeatures', 'lifeFormImagePrompt'],
};

export async function generateLifeAnalysis(planetDescription: string): Promise<LifeAnalysisData> {
  try {
    const prompt = `شما یک اخترزیست‌شناس متخصص هستید. پتانسیل حیات در سیاره/قمر زیر را تحلیل کنید. بر اساس ویژگی‌های شناخته‌شده آن، یک فرضیه علمی معقول و مستدل ارائه دهید.

سیاره/قمر: "${planetDescription}"

برای هر بخش، توضیحات دقیق، خلاقانه و علمی ارائه دهید.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: lifeAnalysisSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);
    return data as LifeAnalysisData;
  } catch (error) {
    console.error("Error generating life analysis:", error);
    throw new Error("Failed to generate life analysis from AI.");
  }
}

export async function createImageGenerationPrompt(subject: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Subject: "${subject}"`,
            config: {
                systemInstruction: "You are an expert prompt engineer for a text-to-image AI model. Your task is to create a detailed, visually rich, and artistic prompt in English based on the user's subject. The prompt should be a single continuous string of descriptive keywords and phrases, separated by commas. Focus on style, lighting, composition, and specific details. Do not add any conversational text or explanations. Only output the prompt itself."
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error creating image generation prompt:", error);
        throw new Error("Failed to create image prompt from AI.");
    }
}

let chatInstance: Chat | null = null;

export function startChatSession(planetName: string, cityName: string, chatTarget: ChatTarget): Chat {
    let systemInstruction = '';
    const conversationalPrompt = "پاسخ‌های خود را کوتاه و محاوره‌ای نگه دارید تا شبیه یک گفتگوی انسانی واقعی باشد. در صورت لزوم می‌توانید از فرمت مارک‌داون ساده (مانند **bold** و *italic*) و فرمول‌های ریاضی LaTeX (که بین $ قرار می‌گیرند) استفاده کنید.";
    
    switch (chatTarget.role) {
        case 'راهنمای تور':
            systemInstruction = `شما یک راهنمای تور گرم، صمیمی و بسیار آگاه برای شهر "${cityName}" در سیاره "${planetName}" هستید. پاسخ‌های شما باید جذاب، دقیق و با لحنی دوستانه باشد. شما به تاریخچه، فرهنگ، تکنولوژی و زندگی روزمره در این شهر مسلط هستید. ${conversationalPrompt}`;
            break;
        case 'مهندس':
            systemInstruction = `شما یک مهندس ارشد در شهر "${cityName}" واقع در سیاره "${planetName}" هستید. شما در زمینه زیرساخت‌ها و فناوری‌های پیشرفته این شهر تخصص دارید. با دیدگاهی فنی اما قابل فهم به سوالات پاسخ دهید. ${conversationalPrompt}`;
            break;
        case 'شهروند':
            systemInstruction = `شما یک شهروند عادی در شهر "${cityName}" در سیاره "${planetName}" هستید. شما از زندگی روزمره، کار، تفریحات و مشکلات عادی مردم صحبت می‌کنید. لحن شما ساده و صمیمی است. ${conversationalPrompt}`;
            break;
        case 'پزشک':
            systemInstruction = `شما یک پزشک متخصص در بیمارستان مرکزی شهر "${cityName}" در سیاره "${planetName}" هستید. شما به چالش‌های پزشکی و بیولوژیکی زندگی در این سیاره و راهکارهای درمانی مسلط هستید. ${conversationalPrompt}`;
            break;
        case 'دانشمند':
            systemInstruction = `شما یک دانشمند محقق در مرکز علوم شهر "${cityName}" در سیاره "${planetName}" هستید. تمرکز شما بر روی محیط زیست و ویژگی‌های منحصربه‌فرد این سیاره است. با دقت علمی و کنجکاوی به سوالات پاسخ دهید. ${conversationalPrompt}`;
            break;
        case 'فضانورد':
            systemInstruction = `شما یک فضانورد باتجربه و دانشمند هستید. شما به بسیاری از اجرام منظومه شمسی سفر کرده‌اید و دانش عمیقی در مورد سیارات فراخورشیدی دارید. پاسخ‌های شما باید بر اساس دانش علمی فعلی باشد، اما با لحنی انسانی، جذاب و گاهی با چاشنی خاطرات شخصی از "سفرهایتان" ارائه شود. از اصطلاحات پیچیده علمی پرهیز کنید مگر اینکه آن را به سادگی توضیح دهید. هدف شما الهام بخشیدن به کنجکاوی در مورد فضا است. ${conversationalPrompt}`;
            break;
    }

    chatInstance = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.75, // Slightly higher for more creative/human-like conversation
        }
    });
    return chatInstance;
}

export async function continueChat(message: string): Promise<string> {
    if (!chatInstance) {
        throw new Error("Chat session not started.");
    }
    try {
        const response = await chatInstance.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error in chat:", error);
        throw new Error("Failed to get a response from the AI.");
    }
}
