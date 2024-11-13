import React, { useState } from 'react';
import { Languages, Globe2, ArrowRightLeft, Volume2 } from 'lucide-react';

const LANGUAGES = {
  en: 'English',
  fr: 'French',
  es: 'Spanish',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
};

function App() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('fr');
  const [targetLang, setTargetLang] = useState('en');
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          sourceText
        )}&langpair=${sourceLang}|${targetLang}`
      );
      const data = await response.json();
      setTranslatedText(data.responseData.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const speak = (text: string, lang: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Languages className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-800">Universal Translator</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.entries(LANGUAGES).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>

            <button
              onClick={switchLanguages}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowRightLeft className="w-6 h-6 text-indigo-600" />
            </button>

            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.entries(LANGUAGES).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Enter text to translate..."
                className="w-full h-48 p-4 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <button
                onClick={() => speak(sourceText, sourceLang)}
                className="absolute bottom-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Volume2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="relative">
              <textarea
                value={translatedText}
                readOnly
                placeholder="Translation will appear here..."
                className="w-full h-48 p-4 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none resize-none"
              />
              <button
                onClick={() => speak(translatedText, targetLang)}
                className="absolute bottom-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Volume2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleTranslate}
              disabled={isLoading || !sourceText.trim()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Globe2 className="w-5 h-5" />
              {isLoading ? 'Translating...' : 'Translate'}
            </button>
          </div>
        </div>

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by MyMemory Translation API</p>
        </footer>
      </div>
    </div>
  );
}

export default App;