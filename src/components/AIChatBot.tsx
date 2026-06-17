import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  X, 
  Sparkles, 
  Bot, 
  ArrowRight,
  User,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../translations';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

interface AIChatBotProps {
  language: Language;
}

const getQuickQuestions = (lang: Language): string[] => {
  if (lang === 'kg') {
    return [
      "Бишкектен сизге кантип жетсе болот?",
      "Сизде кандай дарыгерлер жана процедуралар бар?",
      "Калыбына келтирүүгө кантип онлайн жазылса болот?",
      "Навигатор үчүн координаттар кандай?"
    ];
  }
  if (lang === 'en') {
    return [
      "How do I travel to you from Bishkek?",
      "What physicians and procedures do you offer?",
      "How do I book rehabilitation online?",
      "What are the navigator coordinates?"
    ];
  }
  return [
    "Как к вам доехать из Бишкека?",
    "Какие врачи и процедуры у вас есть?",
    "Как записаться онлайн на реабилитацию?",
    "Какие координаты для навигатора?"
  ];
};

export function AIChatBot({ language }: AIChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = TRANSLATIONS[language] || TRANSLATIONS.ru;
  const quickQuestions = getQuickQuestions(language);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: t.chatBotWelcome,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Synchronize dynamic welcome message when language changes
  useEffect(() => {
    setMessages(prev => {
      if (prev.length <= 1) {
        return [
          {
            id: 'welcome',
            role: 'model',
            text: t.chatBotWelcome,
            timestamp: new Date()
          }
        ];
      }
      return prev;
    });
  }, [language, t.chatBotWelcome]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setErrorStatus(null);
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Keep only client-facing format needed to pass back history to the server
      const chatHistory = [...messages, userMsg].map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          messages: chatHistory,
          language: language 
        })
      });

      if (!res.ok) {
        throw new Error(t.chatBotErrorNoAnswer);
      }

      const data = await res.json();
      
      const botMsg: ChatMessage = {
        id: `msg-${Date.now()}-bot`,
        role: 'model',
        text: data.text || t.chatBotErrorNoAnswer,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      setErrorStatus(t.chatBotErrorDesc);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage(inputValue);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="ai-chatbot-wrapper">
      <AnimatePresence>
        {/* Floating Bubble Icon */}
        {!isOpen && (
          <motion.button
            id="chatbot-trigger-btn"
            layoutId="chatbot-window"
            onClick={() => setIsOpen(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-lg hover:shadow-emerald-500/10 hover:shadow-xl transition-all duration-300 cursor-pointer group"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <MessageSquare className="h-5.5 w-5.5 stroke-[2]" />
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-400 border border-emerald-600 animate-pulse"></span>
            </div>
            <span className="hidden sm:inline text-xs font-extrabold tracking-wide uppercase">{t.chatBotTitleBadge}</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* Chat Window Popup */}
        {isOpen && (
          <motion.div
            id="chatbot-dialog-panel"
            layoutId="chatbot-window"
            className="bg-white border border-slate-200/80 rounded-3xl shadow-2xl w-[350px] sm:w-[400px] h-[520px] flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="p-1.5 bg-emerald-500/20 rounded-xl border border-emerald-500/30 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-emerald-400 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-tight flex items-center space-x-1.5">
                    <span>{t.chatBotTitle}</span>
                    <Sparkles className="h-3 w-3 text-amber-400 animate-pulse fill-amber-400/25" />
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-bold block mt-0.5 font-sans">{t.chatBotStatus}</span>
                </div>
              </div>
              <button 
                id="chatbot-close-btn"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70" id="chatbot-messages-container">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start space-x-2`}
                >
                  {msg.role !== 'user' && (
                    <div className="p-1 bg-emerald-100 rounded-lg text-emerald-700 shrink-0 mt-0.5">
                      <Bot className="h-3 w-3 stroke-[2.2]" />
                    </div>
                  )}
                  <div 
                    className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-emerald-600 text-white rounded-tr-none font-sans font-medium' 
                        : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none font-sans'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                    <span className={`block text-[8px] mt-1.5 text-right ${msg.role === 'user' ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {msg.timestamp.toLocaleTimeString(language === 'kg' ? 'ky-KG' : language === 'en' ? 'en-US' : 'ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {msg.role === 'user' && (
                    <div className="p-1 bg-slate-200 rounded-lg text-slate-600 shrink-0 mt-0.5">
                      <User className="h-3 w-3" />
                    </div>
                  )}
                </div>
              ))}

              {/* Loader */}
              {isLoading && (
                <div className="flex justify-start items-center space-x-2">
                  <div className="p-1 bg-emerald-100 rounded-lg text-emerald-700 shrink-0">
                    <Bot className="h-3 w-3 animate-spin" />
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center space-x-1.5 text-[11px] text-slate-400 font-medium">
                    <Loader2 className="h-3 w-3 animate-spin text-emerald-600" />
                    <span>{t.chatBotTyping}</span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorStatus && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-start space-x-2 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">{t.chatBotErrorTitle}</p>
                    <p className="opacity-90">{errorStatus}</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions Block */}
            {messages.length === 1 && (
              <div className="p-3 bg-white border-t border-slate-100" id="chatbot-quick-triggers">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest px-1 mb-2">{t.chatBotQuickStart}</p>
                <div className="flex flex-col space-y-1.5">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(q)}
                      className="text-left w-full px-3 py-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-[10px] font-bold rounded-xl border border-slate-150 hover:border-emerald-200 transition flex items-center justify-between cursor-pointer group"
                    >
                      <span>{q}</span>
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transform translate-x-[-4px] group-hover:translate-x-0 transition duration-150 text-emerald-600" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2">
              <input
                id="chatbot-input"
                type="text"
                placeholder={t.chatBotInputPlaceholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white transition"
              />
              <button
                id="chatbot-send-btn"
                onClick={() => sendMessage(inputValue)}
                disabled={!inputValue.trim() || isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-2xl disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none shadow transition-all duration-150 cursor-pointer flex items-center justify-center"
              >
                <Send className="h-3.5 w-3.5 stroke-[2]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
