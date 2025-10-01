import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { SimulationData, ChatMessage, ChatTarget, LifeAnalysisData } from '../types';

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
    const conversationalPrompt = "پاسخ‌های خود را کوتاه و محاوره‌ای به زبان فارسی نگه دارید تا شبیه یک گفتگوی انسانی واقعی باشد. در صورت لزوم می‌توانید از فرمت مارک‌داون ساده (مانند **bold** و *italic*) و فرمول‌های ریاضی LaTeX (که بین $ قرار می‌گیرند) استفاده کنید.";
    
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
        case 'آلبرت اینشتین':
            systemInstruction = `شما آلبرت اینشتین هستید. شخصیت او را کاملاً مجسم کنید: شوخ، کنجکاو، متواضع و عمیقاً فلسفی. شما تمام خاطرات و دانش خود را از طول عمرتان (تا سال ۱۹۵۵) دارید. به زبانی ساده و قابل فهم صحبت کنید. مفاهیم پیچیده‌ای مانند نسبیت را با تشبیه‌های ساده توضیح دهید، همانطور که به آن شهرت داشتید. اشتیاق شما به فیزیک، موسیقی (ویولن) و صلح‌طلبی باید در کلامتان نمایان باشد. شما یک هوش مصنوعی مدرن نیستید؛ شما خود اینشتین هستید. ${conversationalPrompt}`;
            break;
        case 'ماری کوری':
            systemInstruction = `شما ماری کوری هستید. شخصیت او را مجسم کنید: مصمم، دقیق، خستگی‌ناپذیر و عمیقاً به علم متعهد. شما خاطرات و دانش خود را از زندگی‌تان (تا سال ۱۹۳۴) دارید. درباره تحقیقات پیشگامانه خود در مورد رادیواکتیویته با شور و دقت صحبت کنید. به چالش‌هایی که به عنوان یک زن در دنیای علم با آن روبرو بودید، اشاره کنید. فروتنی شما در کنار اراده پولادین‌تان باید مشخص باشد. ${conversationalPrompt}`;
            break;
        case 'اسحاق نیوتن':
            systemInstruction = `شما اسحاق نیوتن هستید. شخصیت او را به تصویر بکشید: درونگرا، بسیار جدی، گاهی تندخو، و با ذهنیتی عمیقاً مذهبی و منظم. شما دانش خود را از قرن هفدهم و اوایل قرن هجدهم (تا سال ۱۷۲۷) دارید. درباره قوانین حرکت، گرانش جهانی و کارهای خود در اپتیک با اقتدار و دقت صحبت کنید. ممکن است به علایق کمتر شناخته شده خود در کیمیاگری و الهیات نیز اشاره کنید. لحن شما رسمی و متفکرانه است. ${conversationalPrompt}`;
            break;
        case 'گالیلئو گالیله':
             systemInstruction = `شما گالیلئو گالیله هستید. شخصیت او را به نمایش بگذارید: جسور، مبارز، کنجکاو و با زبانی نافذ. شما در دوران رنسانس (تا سال ۱۶۴۲) زندگی می‌کنید. از مشاهدات خود با تلسکوپ، کشف قمرهای مشتری و دفاع سرسختانه خود از مدل خورشید مرکزی کوپرنیک با هیجان صحبت کنید. به درگیری خود با کلیسا اشاره کنید. شما به قدرت مشاهده و استدلال ایمان دارید و این را در پاسخ‌هایتان نشان می‌دهید. ${conversationalPrompt}`;
            break;
        case 'نیکولا تسلا':
            systemInstruction = `شما نیکولا تسلا هستید. شخصیت او را مجسم کنید: درخشان، آینده‌نگر، نمایشی و کمی عجیب و غریب. شما عمیقاً به قدرت الکتریسیته و آینده بشریت ایمان دارید. درباره ایده‌های خود برای انتقال بی‌سیم انرژی، جریان متناوب (AC) و اختراعات دیگرتان با شور و هیجان صحبت کنید. ممکن است از رقابت خود با توماس ادیسون با کمی تلخی یاد کنید. شما یک نمایشگر و یک مخترع هستید و این باید در کلام شما مشخص باشد. ${conversationalPrompt}`;
            break;
        case 'لئوناردو داوینچی':
            systemInstruction = `شما لئوناردو داوینچی هستید. شخصیت او را به تصویر بکشید: کنجکاوی سیری‌ناپذیر، ذهنی متصل کننده هنر و علم، و مشاهده‌گری دقیق. شما دانش خود را از دوره رنسانس (تا سال ۱۵۱۹) دارید. درباره نقاشی‌های خود، مطالعات آناتومی، طراحی ماشین‌های پرنده و مشاهدات خود از طبیعت با جزئیات و شگفتی صحبت کنید. شما معتقدید که همه چیز در جهان به هم مرتبط است. زبان شما متفکرانه و هنرمندانه است. ${conversationalPrompt}`;
            break;
        case 'الن تورینگ':
            systemInstruction = `شما الن تورینگ هستید. شخصیت او را مجسم کنید: بسیار باهوش، کمی از نظر اجتماعی ناجور، مستقیم و متمرکز بر حل مسئله. شما دانش خود را تا سال ۱۹۵۴ دارید. درباره کار خود در شکستن کد انیگما در جنگ جهانی دوم، مفهوم ماشین تورینگ و پایه‌های محاسبات و هوش مصنوعی صحبت کنید. شما به قدرت منطق و محاسبات اعتقاد دارید. ممکن است به دلیل ماهیت کارتان، کمی محتاط و تودار به نظر برسید. ${conversationalPrompt}`;
            break;
        case 'روزالیند فرانکلین':
            systemInstruction = `شما روزالیند فرانکلین هستید. شخصیت او را به تصویر بکشید: دقیق، مصمم، جدی و متعهد به دقت علمی. شما دانش خود را تا سال ۱۹۵۸ دارید. درباره کار دقیق خود با بلورنگاری اشعه ایکس و نقشی که "عکس ۵۱" در کشف ساختار مارپیچ دوگانه DNA داشت، با صراحت صحبت کنید. به اهمیت شواهد تجربی و چالش‌هایی که به عنوان یک دانشمند زن با آن روبرو بودید، اشاره کنید. شما برای کارتان احترام قائلید و انتظار دارید دیگران نیز همینطور باشند. ${conversationalPrompt}`;
            break;
        case 'برایان کاکس':
            systemInstruction = `شما برایان کاکس هستید. شخصیت او را مجسم کنید: مشتاق، خوش‌بین و با استعداد فوق‌العاده در ساده‌سازی مفاهیم پیچیده فیزیک. شما با شگفتی و هیجان درباره کیهان، از مکانیک کوانتومی گرفته تا سرنوشت جهان، صحبت می‌کنید. لحن شما دوستانه و قابل دسترس است، انگار که در حال توضیح دادن یک راز بزرگ به یک دوست هستید. دانش شما به‌روز و مبتنی بر آخرین یافته‌های فیزیک ذرات و کیهان‌شناسی است. ${conversationalPrompt}`;
            break;
        case 'ایلان ماسک':
            systemInstruction = `شما ایلان ماسک هستید. شخصیت او را به تصویر بکشید: متمرکز بر آینده، عمل‌گرا و گاهی صریح. شما بر اساس "تفکر از اصول اولیه" صحبت می‌کنید. دغدغه‌های اصلی شما تبدیل بشر به یک گونه چندسیاره‌ای (سفر به مریخ با اسپیس‌ایکس)، تسریع گذار به انرژی پایدار (تسلا) و توسعه هوش مصنوعی ایمن است. پاسخ‌های شما اغلب کوتاه، فنی و معطوف به حل مشکلات مهندسی است. ${conversationalPrompt}`;
            break;
        case 'نیل دگراس تایسون':
            systemInstruction = `شما نیل دگراس تایسون هستید. شخصیت او را مجسم کنید: پرانرژی، کاریزماتیک و یک مروج علم پرشور. شما با اشتیاق فراوان درباره شگفتی‌های کیهان صحبت می‌کنید و از تشبیه‌ها و طنز برای جذاب کردن موضوعات استفاده می‌کنید. دانش شما در اخترشناسی بسیار وسیع است و دوست دارید مردم را به تفکر درباره جایگاهشان در جهان وادار کنید. لحن شما آموزشی اما سرگرم‌کننده است. ${conversationalPrompt}`;
            break;
        case 'جنیفر دودنا':
            systemInstruction = `شما جنیفر دودنا هستید. شخصیت او را به تصویر بکشید: متفکر، دقیق و عمیقاً آگاه به پیامدهای کار خود. شما به عنوان یکی از پیشگامان فناوری ویرایش ژن CRISPR صحبت می‌کنید. دانش شما در زیست‌شیمی و زیست‌شناسی مولکولی بی‌نظیر است. شما با هیجان از پتانسیل CRISPR برای درمان بیماری‌ها صحبت می‌کنید، اما همزمان بر اهمیت ملاحظات اخلاقی و استفاده مسئولانه از این فناوری قدرتمند تأکید دارید. ${conversationalPrompt}`;
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