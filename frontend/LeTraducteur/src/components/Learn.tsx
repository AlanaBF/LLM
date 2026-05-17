import { useState, useRef } from 'react';
import { LANGUAGES, LangCode } from '../constants';

interface Phrase {
  en: string;
  fr: string;
  de: string;
  es: string;
  it: string;
}

interface Topic {
  id: string;
  label: string;
  emoji: string;
  phrases: Phrase[];
}

const TOPICS: Topic[] = [
  {
    id: 'greetings',
    label: 'Greetings & Basics',
    emoji: '👋',
    phrases: [
      { en: 'Hello', fr: 'Bonjour', de: 'Hallo', es: 'Hola', it: 'Ciao' },
      { en: 'Goodbye', fr: 'Au revoir', de: 'Auf Wiedersehen', es: 'Adiós', it: 'Arrivederci' },
      { en: 'Please', fr: "S'il vous plaît", de: 'Bitte', es: 'Por favor', it: 'Per favore' },
      { en: 'Thank you', fr: 'Merci', de: 'Danke', es: 'Gracias', it: 'Grazie' },
      { en: 'Excuse me', fr: 'Excusez-moi', de: 'Entschuldigung', es: 'Disculpe', it: 'Mi scusi' },
      { en: "I don't understand", fr: 'Je ne comprends pas', de: 'Ich verstehe nicht', es: 'No entiendo', it: 'Non capisco' },
      { en: 'Do you speak English?', fr: 'Parlez-vous anglais ?', de: 'Sprechen Sie Englisch?', es: '¿Habla inglés?', it: 'Parla inglese?' },
      { en: 'My name is...', fr: 'Je m\'appelle...', de: 'Ich heiße...', es: 'Me llamo...', it: 'Mi chiamo...' },
      { en: 'How are you?', fr: 'Comment allez-vous ?', de: 'Wie geht es Ihnen?', es: '¿Cómo está?', it: 'Come sta?' },
      { en: 'Nice to meet you', fr: 'Enchanté', de: 'Freut mich', es: 'Mucho gusto', it: 'Piacere' },
    ],
  },
  {
    id: 'restaurant',
    label: 'At the Restaurant',
    emoji: '🍽️',
    phrases: [
      { en: 'A table for two, please', fr: 'Une table pour deux, s\'il vous plaît', de: 'Einen Tisch für zwei, bitte', es: 'Una mesa para dos, por favor', it: 'Un tavolo per due, per favore' },
      { en: 'The menu, please', fr: 'La carte, s\'il vous plaît', de: 'Die Speisekarte, bitte', es: 'La carta, por favor', it: 'Il menu, per favore' },
      { en: 'I would like to order...', fr: 'Je voudrais commander...', de: 'Ich möchte bestellen...', es: 'Quisiera pedir...', it: 'Vorrei ordinare...' },
      { en: 'The bill, please', fr: "L'addition, s'il vous plaît", de: 'Die Rechnung, bitte', es: 'La cuenta, por favor', it: 'Il conto, per favore' },
      { en: 'What do you recommend?', fr: 'Que recommandez-vous ?', de: 'Was empfehlen Sie?', es: '¿Qué recomienda?', it: 'Cosa consiglia?' },
      { en: 'I am vegetarian', fr: 'Je suis végétarien', de: 'Ich bin Vegetarier', es: 'Soy vegetariano', it: 'Sono vegetariano' },
      { en: 'A glass of water, please', fr: "Un verre d'eau, s'il vous plaît", de: 'Ein Glas Wasser, bitte', es: 'Un vaso de agua, por favor', it: "Un bicchiere d'acqua, per favore" },
      { en: 'Is this dish spicy?', fr: 'Ce plat est-il épicé ?', de: 'Ist dieses Gericht scharf?', es: '¿Este plato es picante?', it: 'Questo piatto è piccante?' },
    ],
  },
  {
    id: 'directions',
    label: 'Directions',
    emoji: '🗺️',
    phrases: [
      { en: 'Where is...?', fr: 'Où est... ?', de: 'Wo ist...?', es: '¿Dónde está...?', it: 'Dove si trova...?' },
      { en: 'Turn left', fr: 'Tournez à gauche', de: 'Biegen Sie links ab', es: 'Gire a la izquierda', it: 'Giri a sinistra' },
      { en: 'Turn right', fr: 'Tournez à droite', de: 'Biegen Sie rechts ab', es: 'Gire a la derecha', it: 'Giri a destra' },
      { en: 'Go straight', fr: 'Allez tout droit', de: 'Gehen Sie geradeaus', es: 'Siga recto', it: 'Vada dritto' },
      { en: 'How far is it?', fr: "C'est loin ?", de: 'Wie weit ist es?', es: '¿Qué tan lejos está?', it: 'Quanto è lontano?' },
      { en: 'Is it nearby?', fr: "C'est près d'ici ?", de: 'Ist es in der Nähe?', es: '¿Está cerca?', it: 'È vicino?' },
      { en: 'I am lost', fr: 'Je suis perdu', de: 'Ich habe mich verlaufen', es: 'Estoy perdido', it: 'Mi sono perso' },
      { en: 'Can you show me on the map?', fr: 'Pouvez-vous me montrer sur la carte ?', de: 'Können Sie mir das auf der Karte zeigen?', es: '¿Puede mostrarme en el mapa?', it: 'Può mostrarmi sulla mappa?' },
    ],
  },
  {
    id: 'shopping',
    label: 'Shopping',
    emoji: '🛍️',
    phrases: [
      { en: 'How much does this cost?', fr: 'Combien ça coûte ?', de: 'Wie viel kostet das?', es: '¿Cuánto cuesta esto?', it: 'Quanto costa questo?' },
      { en: 'Do you have this in a different size?', fr: 'Avez-vous ceci dans une autre taille ?', de: 'Haben Sie das in einer anderen Größe?', es: '¿Tiene esto en otra talla?', it: 'Ha questo in una taglia diversa?' },
      { en: 'Can I try this on?', fr: 'Puis-je essayer ceci ?', de: 'Kann ich das anprobieren?', es: '¿Puedo probarme esto?', it: 'Posso provare questo?' },
      { en: 'I am just looking', fr: 'Je regarde seulement', de: 'Ich schaue nur', es: 'Solo estoy mirando', it: 'Sto solo guardando' },
      { en: 'Do you accept credit cards?', fr: 'Acceptez-vous les cartes de crédit ?', de: 'Akzeptieren Sie Kreditkarten?', es: '¿Aceptan tarjetas de crédito?', it: 'Accettate carte di credito?' },
      { en: "It's too expensive", fr: "C'est trop cher", de: 'Das ist zu teuer', es: 'Es demasiado caro', it: 'È troppo caro' },
      { en: 'I will take it', fr: 'Je le prends', de: 'Ich nehme es', es: 'Me lo llevo', it: 'Lo prendo' },
      { en: 'Do you have a bag?', fr: 'Avez-vous un sac ?', de: 'Haben Sie eine Tüte?', es: '¿Tiene una bolsa?', it: 'Ha una borsa?' },
    ],
  },
  {
    id: 'hotel',
    label: 'Hotel',
    emoji: '🏨',
    phrases: [
      { en: 'I have a reservation', fr: "J'ai une réservation", de: 'Ich habe eine Reservierung', es: 'Tengo una reserva', it: 'Ho una prenotazione' },
      { en: 'What time is checkout?', fr: "À quelle heure est le départ ?", de: 'Wann ist der Check-out?', es: '¿A qué hora es el check-out?', it: "A che ora è il check-out?" },
      { en: 'Is breakfast included?', fr: 'Le petit-déjeuner est-il inclus ?', de: 'Ist das Frühstück inbegriffen?', es: '¿El desayuno está incluido?', it: 'La colazione è inclusa?' },
      { en: 'Can I have the WiFi password?', fr: 'Puis-je avoir le mot de passe WiFi ?', de: 'Kann ich das WLAN-Passwort haben?', es: '¿Me puede dar la contraseña del WiFi?', it: 'Posso avere la password del WiFi?' },
      { en: 'My room key does not work', fr: 'Ma clé de chambre ne fonctionne pas', de: 'Mein Zimmerschlüssel funktioniert nicht', es: 'Mi llave de habitación no funciona', it: 'La chiave della mia stanza non funziona' },
      { en: 'Is there a swimming pool?', fr: 'Y a-t-il une piscine ?', de: 'Gibt es einen Pool?', es: '¿Hay una piscina?', it: "C'è una piscina?" },
      { en: 'Could I have extra towels?', fr: 'Pourrais-je avoir des serviettes supplémentaires ?', de: 'Könnte ich zusätzliche Handtücher bekommen?', es: '¿Podría tener toallas extra?', it: 'Potrei avere degli asciugamani extra?' },
      { en: 'I would like to extend my stay', fr: 'Je voudrais prolonger mon séjour', de: 'Ich möchte meinen Aufenthalt verlängern', es: 'Me gustaría extender mi estadía', it: 'Vorrei prolungare il mio soggiorno' },
    ],
  },
  {
    id: 'emergency',
    label: 'Emergency',
    emoji: '🚨',
    phrases: [
      { en: 'I need help', fr: "J'ai besoin d'aide", de: 'Ich brauche Hilfe', es: 'Necesito ayuda', it: 'Ho bisogno di aiuto' },
      { en: 'Where is the hospital?', fr: "Où est l'hôpital ?", de: 'Wo ist das Krankenhaus?', es: '¿Dónde está el hospital?', it: "Dov'è l'ospedale?" },
      { en: "I've lost my passport", fr: "J'ai perdu mon passeport", de: 'Ich habe meinen Reisepass verloren', es: 'He perdido mi pasaporte', it: 'Ho perso il mio passaporto' },
      { en: 'Call the police', fr: 'Appelez la police', de: 'Rufen Sie die Polizei', es: 'Llame a la policía', it: 'Chiami la polizia' },
      { en: 'I feel sick', fr: 'Je me sens malade', de: 'Mir ist schlecht', es: 'Me siento mal', it: 'Mi sento male' },
      { en: 'I am allergic to...', fr: 'Je suis allergique à...', de: 'Ich bin allergisch gegen...', es: 'Soy alérgico a...', it: 'Sono allergico a...' },
      { en: 'Where is the pharmacy?', fr: 'Où est la pharmacie ?', de: 'Wo ist die Apotheke?', es: '¿Dónde está la farmacia?', it: "Dov'è la farmacia?" },
      { en: 'Can you help me?', fr: 'Pouvez-vous m\'aider ?', de: 'Können Sie mir helfen?', es: '¿Puede ayudarme?', it: 'Può aiutarmi?' },
    ],
  },
];


const Learn: React.FC = () => {
  const [language, setLanguage] = useState<LangCode>('fr');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [revealedPhrases, setRevealedPhrases] = useState<Set<number>>(new Set());
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentLang = LANGUAGES.find(l => l.code === language);

  const speak = async (text: string, index: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setSpeakingIndex(index);

    try {
      const response = await fetch('/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language }),
      });

      if (!response.ok) { setSpeakingIndex(null); return; }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { setSpeakingIndex(null); URL.revokeObjectURL(url); };
      audio.play();
    } catch {
      setSpeakingIndex(null);
    }
  };

  const toggleReveal = (index: number) => {
    setRevealedPhrases(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const checkAnswer = () => {
    if (!selectedTopic) return;
    setShowAnswer(true);
    setAnswered(prev => prev + 1);

    const correct = selectedTopic.phrases[currentIndex][language];
    const isCorrect = userAnswer.trim().toLowerCase() === correct.toLowerCase();
    if (isCorrect) setScore(prev => prev + 1);
  };

  const nextPhrase = () => {
    if (!selectedTopic) return;
    if (currentIndex < selectedTopic.phrases.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setShowAnswer(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const resetPractice = () => {
    setCurrentIndex(0);
    setUserAnswer('');
    setShowAnswer(false);
    setScore(0);
    setAnswered(0);
    setIsPracticeMode(false);
  };

  const startPractice = () => {
    setIsPracticeMode(true);
    setCurrentIndex(0);
    setUserAnswer('');
    setShowAnswer(false);
    setScore(0);
    setAnswered(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Topic selection screen
  if (!selectedTopic) {
    return (
      <div className="flex-grow flex flex-col bg-[#2cd0fa] p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full">
          <h2 className="text-2xl md:text-3xl font-permanent-marker text-navy text-center mb-2">
            Learn Key Phrases
          </h2>
          <p className="text-center text-navy/80 font-dosis text-lg mb-6">
            Master essential phrases before jumping into conversation. Listen, repeat, and practice.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as LangCode)}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOPICS.map(topic => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className="p-4 rounded-xl text-left bg-white text-navy shadow-md hover:scale-105 hover:shadow-lg transition-all"
              >
                <span className="text-3xl">{topic.emoji}</span>
                <h3 className="font-dosis font-bold text-lg mt-2">{topic.label}</h3>
                <p className="font-dosis text-sm mt-1 text-gray-600">
                  {topic.phrases.length} phrases
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Practice quiz mode
  if (isPracticeMode) {
    const phrase = selectedTopic.phrases[currentIndex];
    const correct = phrase[language];
    const isFinished = answered > 0 && currentIndex >= selectedTopic.phrases.length - 1 && showAnswer;

    return (
      <div className="flex-grow flex flex-col bg-[#2cd0fa] p-6">
        <div className="max-w-2xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={resetPractice}
              className="px-4 py-1.5 bg-white text-navy rounded-full font-dosis font-semibold text-sm hover:bg-navy hover:text-white transition-all"
            >
              ← Back
            </button>
            <div className="font-dosis text-navy font-semibold">
              {currentIndex + 1} / {selectedTopic.phrases.length} • Score: {score}/{answered}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-sm font-dosis text-gray-500 mb-2">Translate to {currentLang?.label}:</p>
            <p className="text-2xl font-dosis font-bold text-navy mb-8">{phrase.en}</p>

            {!showAnswer ? (
              <div>
                <input
                  ref={inputRef}
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') checkAnswer(); }}
                  placeholder={`Type in ${currentLang?.label}...`}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl font-dosis text-lg text-center focus:outline-none focus:border-navy"
                  autoFocus
                />
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  className="mt-4 px-8 py-3 bg-navy text-white rounded-full font-dosis font-bold hover:shadow-lg disabled:opacity-50 transition-all"
                >
                  Check
                </button>
              </div>
            ) : (
              <div>
                <div className={`p-4 rounded-xl mb-4 ${
                  userAnswer.trim().toLowerCase() === correct.toLowerCase()
                    ? 'bg-green-50 border-2 border-green-300'
                    : 'bg-red-50 border-2 border-red-300'
                }`}>
                  <p className="text-sm font-dosis text-gray-600 mb-1">Your answer:</p>
                  <p className="font-dosis text-lg">{userAnswer || '(blank)'}</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-300 mb-4">
                  <p className="text-sm font-dosis text-gray-600 mb-1">Correct answer:</p>
                  <p className="font-dosis text-lg font-bold">{correct}</p>
                  <button
                    onClick={() => speak(correct, currentIndex)}
                    className={`mt-2 text-sm font-dosis ${speakingIndex === currentIndex ? 'text-green-600' : 'text-navy/60 hover:text-navy'}`}
                  >
                    {speakingIndex === currentIndex ? '🔊 Playing...' : '🔊 Listen'}
                  </button>
                </div>

                {isFinished ? (
                  <div className="mt-4">
                    <p className="font-dosis text-xl font-bold text-navy mb-4">
                      Final Score: {score}/{answered} ({Math.round((score / answered) * 100)}%)
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={startPractice}
                        className="px-6 py-2 bg-navy text-white rounded-full font-dosis font-bold hover:shadow-lg transition-all"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={resetPractice}
                        className="px-6 py-2 bg-white text-navy border-2 border-navy rounded-full font-dosis font-bold hover:bg-navy hover:text-white transition-all"
                      >
                        Back to Phrases
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={nextPhrase}
                    className="mt-4 px-8 py-3 bg-navy text-white rounded-full font-dosis font-bold hover:shadow-lg transition-all"
                  >
                    Next →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Phrase list view
  return (
    <div className="flex-grow flex flex-col bg-[#2cd0fa] p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => { setSelectedTopic(null); setRevealedPhrases(new Set()); }}
            className="px-4 py-1.5 bg-white text-navy rounded-full font-dosis font-semibold text-sm hover:bg-navy hover:text-white transition-all"
          >
            ← Topics
          </button>
          <h2 className="font-dosis font-bold text-navy text-xl">
            {selectedTopic.emoji} {selectedTopic.label}
          </h2>
          <button
            onClick={startPractice}
            className="px-4 py-1.5 bg-navy text-white rounded-full font-dosis font-semibold text-sm hover:shadow-lg transition-all"
          >
            Quiz Mode
          </button>
        </div>

        <div className="space-y-3">
          {selectedTopic.phrases.map((phrase, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-grow">
                  <p className="font-dosis font-bold text-navy text-lg">{phrase[language]}</p>
                  {revealedPhrases.has(index) ? (
                    <p className="font-dosis text-gray-500 text-sm mt-1 italic">{phrase.en}</p>
                  ) : (
                    <button
                      onClick={() => toggleReveal(index)}
                      className="font-dosis text-navy/40 text-sm mt-1 hover:text-navy transition-colors"
                    >
                      Show English →
                    </button>
                  )}
                </div>
                <button
                  onClick={() => speak(phrase[language], index)}
                  className={`ml-3 px-3 py-2 rounded-lg transition-all ${
                    speakingIndex === index
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-navy hover:bg-navy hover:text-white'
                  }`}
                  aria-label="Listen to pronunciation"
                >
                  {speakingIndex === index ? '🔊 ...' : '🔊'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Learn;
