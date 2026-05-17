import { useState, useRef, useEffect } from 'react';
import { LANGUAGES } from '../constants';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  correction?: string;
  translation?: string;
  feedback?: string;
  showTranslation?: boolean;
}

interface Scenario {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

const SCENARIOS: Scenario[] = [
  { id: 'restaurant', label: 'Restaurant', emoji: '🍽️', description: 'Order food and drinks at a local restaurant' },
  { id: 'directions', label: 'Directions', emoji: '🗺️', description: 'Ask for and give directions around the city' },
  { id: 'job_interview', label: 'Job Interview', emoji: '💼', description: 'Practice answering common interview questions' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️', description: 'Buy clothes and ask about sizes and prices' },
  { id: 'hotel', label: 'Hotel Check-in', emoji: '🏨', description: 'Check into a hotel and ask about amenities' },
];


const DIFFICULTIES = [
  { id: 'beginner', label: 'Beginner', emoji: '🌱', description: 'Simple vocabulary, short sentences' },
  { id: 'intermediate', label: 'Intermediate', emoji: '📚', description: 'Normal conversation, some complexity' },
  { id: 'advanced', label: 'Advanced', emoji: '🎓', description: 'Native-level with idioms and slang' },
];

const Practice: React.FC = () => {
  const [language, setLanguage] = useState('fr');
  const [scenario, setScenario] = useState<string>('restaurant');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isStarted && !isLoading) {
      inputRef.current?.focus();
    }
  }, [isStarted, isLoading, messages]);

  const speak = async (text: string, messageId: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setSpeakingId(messageId);

    try {
      const response = await fetch('/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language }),
      });

      if (!response.ok) {
        setSpeakingId(null);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setSpeakingId(null);
        URL.revokeObjectURL(url);
      };

      audio.play();
    } catch {
      setSpeakingId(null);
    }
  };

  const toggleTranslation = (messageId: string) => {
    setMessages(prev => prev.map(m =>
      m.id === messageId ? { ...m, showTranslation: !m.showTranslation } : m
    ));
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    const langConfig = LANGUAGES.find(l => l.code === language);
    recognition.lang = langConfig?.speechCode || 'fr-FR';
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const startConversation = async () => {
    setIsStarted(true);
    setIsLoading(true);

    try {
      const response = await fetch('/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [], language, scenario, difficulty }),
      });

      const data = await response.json();

      if (data.error) {
        setMessages([{ id: crypto.randomUUID(), role: 'assistant', content: data.message || data.error }]);
      } else {
        setMessages([{
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.reply,
          translation: data.translation || undefined,
        }]);
      }
    } catch {
      setMessages([{ id: crypto.randomUUID(), role: 'assistant', content: 'Failed to connect. Please check the backend is running.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          language,
          scenario,
          difficulty,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.message || 'The AI service is temporarily unavailable. Translation still works!',
        }]);
      } else {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.reply,
          correction: data.correction || undefined,
          translation: data.translation || undefined,
          feedback: data.feedback || undefined,
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Unable to connect to the server. Please check your connection.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetConversation = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setMessages([]);
    setIsStarted(false);
    setInput('');
    setSpeakingId(null);
  };

  const currentLang = LANGUAGES.find(l => l.code === language);

  if (!isStarted) {
    return (
      <div className="flex-grow flex flex-col bg-[#2cd0fa] p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full">
          <h2 className="text-2xl md:text-3xl font-permanent-marker text-navy text-center mb-2">
            Conversation Practice
          </h2>
          <p className="text-center text-navy/80 font-dosis text-lg mb-6">
            Practice speaking {currentLang?.label} in real-world scenarios. The AI will respond in your target language and correct your mistakes.
          </p>

          {/* Language Selection */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-4 py-2 rounded-full font-dosis font-semibold transition-all ${
                  language === lang.code
                    ? 'bg-navy text-white shadow-md'
                    : 'bg-white text-navy hover:bg-navy hover:text-white'
                }`}
              >
                {lang.flag} {lang.label}
              </button>
            ))}
          </div>

          {/* Difficulty Selection */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {DIFFICULTIES.map(d => (
              <button
                key={d.id}
                onClick={() => setDifficulty(d.id)}
                className={`px-4 py-2 rounded-full font-dosis transition-all ${
                  difficulty === d.id
                    ? 'bg-green-600 text-white shadow-md font-bold'
                    : 'bg-white text-navy hover:bg-green-600 hover:text-white font-semibold'
                }`}
              >
                {d.emoji} {d.label}
              </button>
            ))}
          </div>
          <p className="text-center text-navy/60 font-dosis text-sm mb-6">
            {DIFFICULTIES.find(d => d.id === difficulty)?.description}
          </p>

          {/* Scenario Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SCENARIOS.map(s => (
              <button
                key={s.id}
                onClick={() => setScenario(s.id)}
                className={`p-4 rounded-xl text-left transition-all hover:scale-105 hover:shadow-lg ${
                  scenario === s.id
                    ? 'bg-navy text-white shadow-lg scale-105'
                    : 'bg-white text-navy shadow-md'
                }`}
              >
                <span className="text-3xl">{s.emoji}</span>
                <h3 className="font-dosis font-bold text-lg mt-2">{s.label}</h3>
                <p className={`font-dosis text-sm mt-1 ${scenario === s.id ? 'text-white/80' : 'text-gray-600'}`}>
                  {s.description}
                </p>
              </button>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={startConversation}
              className="px-8 py-3 bg-navy text-white rounded-full font-dosis font-bold text-lg hover:shadow-lg hover:scale-105 transition-all"
            >
              Start Conversation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col bg-[#2cd0fa]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-navy/10">
        <div className="flex items-center gap-2 font-dosis">
          <span className="text-xl">{SCENARIOS.find(s => s.id === scenario)?.emoji}</span>
          <span className="font-semibold text-navy">
            {SCENARIOS.find(s => s.id === scenario)?.label}
          </span>
          <span className="text-navy/60">
            ({currentLang?.flag} {currentLang?.label})
          </span>
          <span className="text-navy/40 text-sm">
            • {DIFFICULTIES.find(d => d.id === difficulty)?.emoji} {DIFFICULTIES.find(d => d.id === difficulty)?.label}
          </span>
        </div>
        <button
          onClick={resetConversation}
          className="px-4 py-1.5 bg-white text-navy rounded-full font-dosis font-semibold text-sm hover:bg-navy hover:text-white transition-all"
        >
          New Conversation
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-bottom`}
          >
            {message.role === 'assistant' ? (
              <div className="flex items-start gap-2 max-w-[80%]">
                <img src="/assets/botlogo.png" className="w-10 h-10 rounded-full flex-shrink-0" alt="AI" />
                <div className="flex flex-col">
                  <div className="bg-white text-navy p-3 rounded-2xl rounded-tl-sm shadow-sm">
                    <p className="font-dosis">{message.content}</p>
                    <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => speak(message.content, message.id)}
                        className={`text-xs transition-colors font-dosis ${
                          speakingId === message.id ? 'text-green-600' : 'text-navy/50 hover:text-navy'
                        }`}
                        title="Listen to pronunciation"
                      >
                        {speakingId === message.id ? '🔊 Playing...' : '🔊 Listen'}
                      </button>
                      {message.translation && (
                        <button
                          onClick={() => toggleTranslation(message.id)}
                          className="text-xs text-navy/50 hover:text-navy transition-colors font-dosis"
                          title="Show English translation"
                        >
                          {message.showTranslation ? '🇬🇧 Hide English' : '🇬🇧 Show English'}
                        </button>
                      )}
                    </div>
                  </div>
                  {message.showTranslation && message.translation && (
                    <div className="mt-2 ml-2 bg-blue-50 border-l-4 border-blue-300 p-2 rounded-r-lg">
                      <p className="text-sm text-gray-700 font-dosis italic">{message.translation}</p>
                    </div>
                  )}
                  {message.correction && (
                    <div className="mt-2 ml-2 bg-amber-50 border-l-4 border-amber-400 p-2 rounded-r-lg">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-amber-500 text-xs">💡</span>
                        <span className="text-xs font-semibold text-amber-700 font-dosis">Correction</span>
                      </div>
                      <p className="text-sm text-gray-700 font-dosis">{message.correction}</p>
                    </div>
                  )}
                  {message.feedback && (
                    <div className="mt-2 ml-2 bg-green-50 border-l-4 border-green-400 p-2 rounded-r-lg">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-green-500 text-xs">⭐</span>
                        <span className="text-xs font-semibold text-green-700 font-dosis">Feedback</span>
                      </div>
                      <p className="text-sm text-gray-700 font-dosis">{message.feedback}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 max-w-[80%]">
                <div className="bg-navy text-white p-3 rounded-2xl rounded-tr-sm shadow-sm">
                  <p className="font-dosis">{message.content}</p>
                </div>
                <img src="/assets/britishlogo.png" className="w-10 h-10 rounded-full flex-shrink-0" alt="User" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in-bottom">
            <div className="flex items-start gap-2">
              <img src="/assets/botlogo.png" className="w-10 h-10 rounded-full" alt="AI" />
              <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form
        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
        className="flex items-center justify-center p-4 bg-navy rounded-lg shadow-md w-10/12 mx-auto mb-4"
      >
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className={`px-3 py-2 mr-2 rounded-lg transition-all ${
            isListening
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-[#2cd0fa] text-white hover:bg-[#2cd0fa]/80'
          }`}
          title={isListening ? 'Stop recording' : 'Speak your answer'}
        >
          🎤
        </button>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Type in ${currentLang?.label}...`}
          className="flex-grow p-2 mr-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#2cd0fa] bg-white text-navy font-dosis"
          rows={1}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-[#2cd0fa] text-white rounded-lg hover:bg-[#2cd0fa]/80 focus:outline-none focus:ring-2 focus:ring-[#2cd0fa] disabled:opacity-50 transition-all"
        >
          ➤
        </button>
      </form>
    </div>
  );
};

export default Practice;
