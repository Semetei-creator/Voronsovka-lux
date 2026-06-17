import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";
import { Resend } from "resend";


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

// Lazy initialization helper for Stripe SDK to avoid crashing if env variables aren't set
let stripeClient: Stripe | null = null;
const getStripe = (): Stripe | null => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: "2025-02-18-preview" as any,
    });
  }
  return stripeClient;
};

// Stripe Create Payment Intent endpoint
app.post("/api/stripe/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency, doctorName, patientName, appointmentId } = req.body;
    const stripe = getStripe();

    if (!stripe) {
      console.log("Stripe Secret Key is absent. Falling back to Demo Sandbox State.");
      return res.json({
        simulated: true,
        clientSecret: `demo_secret_${appointmentId || Date.now()}_for_${doctorName || "physio"}`,
        amount: amount || 1500,
        currency: currency || "USD",
        docName: doctorName,
        patName: patientName,
      });
    }

    // Try to create a real checkout session/payment intent via Stripe API
    const finalAmount = amount || 1500;
    const finalCurrency = (currency || 'USD').toLowerCase();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: finalCurrency,
      metadata: {
        appointmentId: appointmentId || "",
        doctorName: doctorName || "",
        patientName: patientName || ""
      }
    });

    return res.json({
      simulated: false,
      clientSecret: paymentIntent.client_secret,
      amount: finalAmount,
      currency: finalCurrency,
    });
  } catch (error: any) {
    console.error("Stripe payment intent creation failed:", error);
    return res.status(500).json({ error: error.message || "Failed to create Stripe payment intent" });
  }
});

// Lazy initialization helper for Resend SDK to avoid crashing if env variables are absent
let resendClient: Resend | null = null;
const getResend = (): Resend | null => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
};

// Telegram Notification Helper
const sendTelegramNotification = async (message: string) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.log("-----------------------------------------");
    console.log("TELEGRAM BOT CONFIRMATION LOG (NO API KEYS SET):");
    console.log(message);
    console.log("-----------------------------------------");
    return { simulated: true, reason: "Credentials not configured in env" };
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Failed to send message via Telegram API:", errText);
      return { success: false, error: errText };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    console.error("Telegram notification delivery errored:", error);
    return { success: false, error: error.message || error };
  }
};

app.get("/api/resend/config-status", (req, res) => {
  res.json({
    resend: {
      configured: !!process.env.RESEND_API_KEY,
      fromEmail: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      isDefaultSandbox: !process.env.RESEND_FROM_EMAIL || process.env.RESEND_FROM_EMAIL === "onboarding@resend.dev"
    },
    stripe: {
      configured: !!process.env.STRIPE_SECRET_KEY
    },
    telegram: {
      configured: !!process.env.TELEGRAM_BOT_TOKEN && !!process.env.TELEGRAM_CHAT_ID
    }
  });
});

// Test Connection and Configuration API for Resend
app.post("/api/resend/test-connection", async (req, res) => {
  try {
    const resend = getResend();
    const apiKeySet = !!process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    
    if (!resend) {
      return res.json({
        success: false,
        envSet: false,
        error: "RESEND_API_KEY не задан в переменных окружения проекта.",
        hint: "Пожалуйста, откройте меню 'Settings' -> 'Environment Variables' в AI Studio, добавьте переменную RESEND_API_KEY и введите ваш API-ключ от Resend, затем перезапустите Dev-сервер."
      });
    }

    const { testEmail } = req.body;
    const targetEmail = testEmail || "semaarykov@gmail.com";

    console.log(`[Diagnostic] Sending test Resend email to ${targetEmail} from ${fromEmail}`);
    
    try {
      const response = await resend.emails.send({
        from: fromEmail,
        to: [targetEmail.trim()],
        subject: "🩺 Тест интеграции Resend — Медицинский Курорт",
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #059669;">🎉 Интеграция Resend настроена успешно!</h2>
            <p>Это автоматическое тестовое письмо от вашего приложения медицинского курорта.</p>
            <p><b>Отправитель:</b> ${fromEmail}</p>
            <p><b>Получатель:</b> ${targetEmail}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
            <small style="color: #666;">Если вы получили это письмо, значит ваш API-ключ работает исправно!</small>
          </div>
        `
      });

      console.log("[Diagnostic] Test Resend email sent successfully:", response);
      return res.json({
        success: true,
        envSet: true,
        fromUsed: fromEmail,
        targetEmail,
        response,
        hint: "Тестовое письмо успешно отправлено! Если оно не появилось на почте, непременно проверьте папку 'Спам' (Spam) или нежелательную почту, так как письма с тестового домена onboarding@resend.dev часто классифицируются как спам."
      });
    } catch (sendError: any) {
      console.error("[Diagnostic] Test Resend email error:", sendError);
      const isSandboxError = fromEmail === 'onboarding@resend.dev' || 
        (sendError.message && (
          sendError.message.includes("sandbox") || 
          sendError.message.includes("unverified") || 
          sendError.message.includes("restricted") ||
          sendError.message.includes("not verified")
        ));

      return res.json({
        success: false,
        envSet: true,
        error: sendError.message,
        isSandboxRestriction: isSandboxError,
        hint: isSandboxError
          ? `Вы используете бесплатную песочницу Resend с тестовым адресом '${fromEmail}'. В этом режиме Resend разрешает отправлять письма ТОЛЬКО на адрес владельца аккаунта Resend (тот email, на который вы регистрировали аккаунт Resend). Чтобы отправлять на другие адреса, вам нужно подтвердить свой домен (Domain Verification) в кабинете Resend, либо добавить адрес '${targetEmail}' в список 'Test Receivers' на панели управления Resend.`
          : `Произошла ошибка при отправке: ${sendError.message}. Убедитесь, что ваш API-ключ верен.`
      });
    }
  } catch (err: any) {
    console.error("Resend connection test error:", err);
    return res.status(500).json({ error: err.message || "Internal diagnostic error" });
  }
});

// Stripe & Resend & Telegram Confirmation flow
app.post("/api/stripe/confirm-payment", async (req, res) => {
  try {
    const { 
      appointmentId, 
      paymentId, 
      amount, 
      patientName, 
      doctorName, 
      doctorSpecialty,
      date,
      time,
      customerEmail
    } = req.body;

    console.log("Confirming payment, sending Resend email & Telegram alert for:", appointmentId);

    const resend = getResend();
    let emailSent = false;
    let resendDetails = null;

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px; text-align: center;">
        <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 24px; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03); text-align: left;">
          
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background-color: #e6f4ea; border-radius: 50%; padding: 12px; width: 48px; height: 48px; line-height: 48px; text-align: center; color: #137333; font-size: 24px;">
              ✓
            </div>
            <h2 style="color: #0f172a; margin-top: 16px; margin-bottom: 4px; font-weight: 800; font-size: 20px; letter-spacing: -0.025em;">Платеж Успешно Проведен</h2>
            <p style="color: #64748b; font-size: 13px; margin: 0;">Курортный медицинский центр подтверждения</p>
          </div>

          <div style="background-color: #f1f5f9; border-radius: 16px; padding: 18px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 700; margin-bottom: 2px;">Биллинг Stripe</div>
            <div style="font-size: 20px; font-weight: 900; color: #059669; font-family: monospace;">1500 KGS</div>
            <div style="font-size: 10px; color: #94a3b8; font-family: monospace; margin-top: 4px; word-break: break-all;">ID: ${paymentId || 'N/A'}</div>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #334155;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Пациент:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 700; color: #0f172a;">${patientName || 'Зарегистрированный гость'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Врач:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 700; color: #0f172a;">${doctorName || 'Дежурный врач'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Специальность:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 700; color: #10b981;">${doctorSpecialty || 'Общая медицина'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Дата сеанса:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 700; color: #0f172a;">${date || ''} (${time || ''})</td>
            </tr>
          </table>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.5;">
            Электронный чек сгенерирован автоматически.<br>Спасибо за выбор нашего оздоровительного курорта!
          </div>

        </div>
      </div>
    `;

    if (resend) {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      const results: any[] = [];
      
      // 1. Try sending to the primary admin/owner address
      try {
        console.log(`[Resend] Dispatching email copy to admin/owner: semaarykov@gmail.com (From: ${fromEmail})`);
        const ownerResponse = await resend.emails.send({
          from: fromEmail,
          to: ["semaarykov@gmail.com"],
          subject: `💳 Оплата подтверждена (Копия администратора): 1500 KGS — ${patientName || 'Гость'}`,
          html: emailHtml,
        });
        emailSent = true;
        results.push({ recipient: "semaarykov@gmail.com", success: true, details: ownerResponse });
        console.log("[Resend] Admin notification sent:", ownerResponse);
      } catch (ownerError: any) {
        console.error("[Resend] Admin notification delivery failed:", ownerError);
        results.push({ recipient: "semaarykov@gmail.com", success: false, error: ownerError.message });
      }

      // 2. Try sending to the actual patient address separately
      if (customerEmail && customerEmail.includes("@") && customerEmail.trim().toLowerCase() !== "semaarykov@gmail.com") {
        try {
          console.log(`[Resend] Dispatching email to patient: ${customerEmail} (From: ${fromEmail})`);
          const patientResponse = await resend.emails.send({
            from: fromEmail,
            to: [customerEmail.trim()],
            subject: `💳 Электронный чек об оплате: 1500 KGS — ${patientName || 'Уважаемый пациент'}`,
            html: emailHtml,
          });
          results.push({ recipient: customerEmail, success: true, details: patientResponse });
          console.log(`[Resend] Patient notification sent to ${customerEmail}:`, patientResponse);
        } catch (patientError: any) {
          console.error(`[Resend] Patient email delivery to ${customerEmail} failed:`, patientError);
          // Help clarify Resend sandbox limitations in the error status
          const isSandboxError = fromEmail === 'onboarding@resend.dev' || 
            (patientError.message && (
              patientError.message.includes("sandbox") || 
              patientError.message.includes("unverified") || 
              patientError.message.includes("restricted") ||
              patientError.message.includes("not verified")
            ));
          
          results.push({ 
            recipient: customerEmail, 
            success: false, 
            error: patientError.message,
            isSandboxRestriction: isSandboxError,
            hint: isSandboxError 
              ? "Для отправки писем внешним получателям (пациентам) в Resend необходимо подтвердить собственный домен (Domain Verification) на панели управления Resend, либо добавить адрес пациента в список протестированных адресов (Single Sender/Test Receivers)."
              : "Проверьте правильность API ключа или настройки адреса отправления."
          });
        }
      }

      resendDetails = {
        sent: emailSent,
        fromUsed: fromEmail,
        deliveries: results
      };
    } else {
      console.log("Resend API key is absent. Email was simulated in development log.");
      resendDetails = { simulated: true, note: "Resend API Key is unset. Visual template printed above." };
    }

    // Prepare Telegram message
    const telegramMessage = `<b>✅ Успешная Оплата через Stripe!</b>

💰 <b>Сумма платежа:</b> 1500 KGS
👤 <b>Пациент:</b> ${patientName || 'Неизвестно'}
👨‍⚕️ <b>Врач:</b> ${doctorName || 'Дежурный специалист'}
🩺 <b>Процедура:</b> ${doctorSpecialty || 'Общая реабилитация'}
📅 <b>Срок сеанса:</b> ${date || ''} в ${time || ''}
💳 <b>Идентификатор оплаты:</b> <code>${paymentId || 'N/A'}</code>
📧 <b>Куда отправлен email:</b> <code>${customerEmail || 'semaarykov@gmail.com'}</code>`;

    // Send Telegram Notification
    console.log("Sending Telegram message...");
    const telegramResult = await sendTelegramNotification(telegramMessage);

    return res.json({
      success: true,
      appointmentId,
      paymentId,
      emailSent,
      resendDetails,
      telegramSent: telegramResult.success || telegramResult.simulated || false,
      telegramDetails: telegramResult
    });
  } catch (error: any) {
    console.error("Endpoint error inside confirm-payment:", error);
    return res.status(500).json({ error: error.message || "Failed to finalize payment notification" });
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
