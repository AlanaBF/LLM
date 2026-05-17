import { useState, useRef, useEffect } from 'react';
import { LANGUAGES, LangCode } from '../constants';

interface Translation {
  id: string;
  input: string;
  output: string;
}

const Chatbot: React.FC = () => {
  const [language, setLanguage] = useState<LangCode>('de');
  const [input, setInput] = useState('');
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [translations]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message, language }),
      });

      const data = await response.json();

      setTranslations(prev => [...prev, {
        id: crypto.randomUUID(),
        input: message,
        output: data.response || data.error || 'Translation failed.',
      }]);
    } catch {
      setTranslations(prev => [...prev, {
        id: crypto.randomUUID(),
        input: message,
        output: 'An error occurred. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentLang = LANGUAGES.find(l => l.code === language);

  return (
    <div className="relative flex flex-col bg-[#2cd0fa]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50 md:opacity-70"
        style={{ backgroundImage: 'url(/assets/backgroundimage.png)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
      />

      <div className="relative flex flex-col min-h-80vh bg-transparent">
        <div className="flex items-center justify-center p-4">
          <label htmlFor="language-select" className="mr-2 text-white font-dosis">Translate to:</label>
          <select
            id="language-select"
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy bg-white text-navy font-dosis"
            value={language}
            onChange={(e) => setLanguage(e.target.value as LangCode)}
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {translations.map(t => (
            <div key={t.id} className="space-y-2">
              <div className="flex justify-end animate-fade-in-bottom">
                <div className="flex items-start gap-2 max-w-[70%]">
                  <p className="bg-white text-navy p-2 rounded-2xl font-dosis">{t.input}</p>
                  <img src="/assets/britishlogo.png" className="w-12 h-12 rounded-full" alt="English" />
                </div>
              </div>
              <div className="flex justify-start animate-fade-in-bottom">
                <div className="flex items-start gap-2 max-w-[70%]">
                  <img src="/assets/botlogo.png" className="w-12 h-12 rounded-full" alt={currentLang?.label} />
                  <p className="bg-white text-navy p-2 rounded-2xl font-dosis">{t.output}</p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-fade-in-bottom">
              <div className="flex items-start gap-2">
                <img src="/assets/botlogo.png" className="w-12 h-12 rounded-full" alt="Translating" />
                <div className="bg-white p-3 rounded-2xl">
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

        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center p-4 bg-navy rounded-lg shadow-md w-10/12 mx-auto mb-4"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
            placeholder="Type in English..."
            className="flex-grow p-2 mr-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-navy bg-white text-navy font-dosis"
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
    </div>
  );
};

export default Chatbot;
