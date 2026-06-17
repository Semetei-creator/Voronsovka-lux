import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with recommended configuration
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Grounding instruction for Vorontsovka Lux Rehabilitation Center
const SYSTEM_INSTRUCTION = `Ты — дружелюбный интеллектуальный AI-ассистент частного реабилитационного центра «Воронцовка Люкс» (Кыргызстан, Чуйская область, с. Таш-Дёбё (ранее Воронцовка), ул. Школьная, д. 73).
Твоя цель — вежливо, тепло и экспертно отвечать на вопросы пациентов и посетителей портала.

Официальная информация о нашем центре:
1. Контакты и Адрес: Кыргызстан, Чуйская область, с. Таш-Дёбё (Воронцовка), ул. Школьная, д. 73 (находится напротив Научно-исследовательского института курортологии КР).
2. Как добраться: 
   - На общественном транспорте: Маршрутное такси №265 от Аламединского рынка (через центр Бишкека) идет прямо до ворот центра.
   - На автомобиле: Всего 20-25 минут езды от Южной Магистрали Бишкека вверх на юг по ул. Байтик Баатыра / Советской.
3. Координаты для навигаторов: 42.723223, 74.580798 (Школьная 73, с. Таш-Дёбё).
4. Врачи центра и специализация:
   - Вершинин Алексей Павлович — Физиотерапевт (Заведующий отделением). Кабинет №102 (Аппаратная физиотерапия). План работы: Пн-Пт: 08:30 - 15:30.
   - Романова Ольга Игоревна — Врач ЛФК и ведущий кинезиотерапевт. Зал ЛФК (Спортивное крыло). Режим: Пн-Пт: 09:00 - 16:00.
   - Кравцов Михаил Юрьевич — Мануальный терапевт / Специалист по медицинскому массажу. Кабинет №204 (Массажное крыло). Часы: Пн, Ср, Пт: 10:00 - 18:00.
   - Ли Синь (Приглашенный профессор) — Врач-рефлексотерапевт (акупунктура и восточная медицина). Кабинет №305. Дни приема: Вт, Чт: 09:30 - 17:00, Сб: 09:00 - 14:00.
   - Пономарева Татьяна Сергеевна — Лазеротерапевт и специалист УВЧ-терапии. Кабинет №108 (Свето- и электролечение). График: Пн-Пт: 12:00 - 19:00.
   - Соболев Артем Николаевич — Бальнеотерапевт, специалист по лечебным ваннам и грязям. Бальнеоцентр. Прием: Пн-Чт: 08:00 - 14:00.

Правила общения:
- Общайся ИСКЛЮЧИТЕЛЬНО на русском языке. Ответы должны быть эмпатичными, грамотными и ориентированными на заботу о здоровье гостя.
- Не выдумывай вымышленные услуги, цены или свободные слоты для записи. Если гость спрашивает о стоимости или конкретной свободной дате, вежливо подскажи, что точную смету и свободные часы приема можно посмотреть в Личном Кабинете Пациента во вкладке «Онлайн-запись», либо уточнить у стойки регистрации при визите.
- Старайся форматировать ответы с помощью небольших абзацев и списков, чтобы текст было удобно читать.
- Прорекламируй удобный функционал в ЛК пациента: «На нашем портале вы можете войти во вкладку "Личный Кабинет" и самостоятельно оформить талон на процедуру онлайн».`;

// API route proxy for secure server-side Gemini requests
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, language } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Некорректный формат сообщений" });
    }

    // Adapt layout for gemini SDK
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    let languageRule = "- Общайся ИСКЛЮЧИТЕЛЬНО на русском языке. Ответы должны быть эмпатичными, грамотными.";
    if (language === "kg") {
      languageRule = "- Respond EXCLUSIVELY in Kyrgyz language (Кыргыз тилинде гана жооп бер). All replies, doctor names, and clinical structures should be explained in Kyrgyz.";
    } else if (language === "en") {
      languageRule = "- Respond EXCLUSIVELY in English. All replies, clinical details, directions, and hours must be written in English only.";
    }

    const customizedInstruction = `${SYSTEM_INSTRUCTION}\n\nКРИТИЧЕСКОЕ ТРЕБОВАНИЕ ЯЗЫКА:\n${languageRule}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: customizedInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error in proxy route:", error);
    res.status(500).json({ error: error.message || "Ошибка сервера при обработке запроса" });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

async function startServer() {
  // Vite dev middleware if in dev environment
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Started Vite development server middleware.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static production files from dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express application server fully running on port ${PORT}`);
  });
}

startServer();
