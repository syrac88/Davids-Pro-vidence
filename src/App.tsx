import { useState, useEffect } from 'react';
import { DUNGEON_METADATA, translations } from './constants';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentLang, setCurrentLang] = useState<'en' | 'de'>('en');
  const [currentDungeon, setCurrentDungeon] = useState<string | null>(null);
  const [failCount, setFailCount] = useState<number>(0);
  const [currentQuote, setCurrentQuote] = useState<string>('');

  const t = translations[currentLang];

  useEffect(() => {
    const savedFails = localStorage.getItem('davidFails');
    if (savedFails) {
      setFailCount(parseInt(savedFails));
    }
    setCurrentQuote(translations[currentLang].failQuotes[0]);
  }, []);

  useEffect(() => {
    localStorage.setItem('davidFails', failCount.toString());
  }, [failCount]);

  const toggleLanguage = () => {
    const nextLang = currentLang === 'en' ? 'de' : 'en';
    setCurrentLang(nextLang);
    setCurrentQuote(translations[nextLang].failQuotes[0]);
  };

  const changeFails = (amount: number) => {
    const newCount = Math.max(0, failCount + amount);
    setFailCount(newCount);
    
    if (amount > 0) {
      const quotes = translations[currentLang].failQuotes;
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setCurrentQuote(randomQuote);
    }
  };

  const dungeonNames = Object.keys(translations.en.dungeons);

  return (
    <div className="min-h-screen bg-[#0f0f12] text-[#e0e0e0]">
      <header>
        <div className="header-content relative">
          <button id="lang-btn" onClick={toggleLanguage}>
            {currentLang === 'en' ? 'DE' : 'EN'}
          </button>
          <h1 className="text-3xl font-bold text-[#ffb400] mb-2">{t.title}</h1>
          <p className="text-sm opacity-80">{t.subtitle}</p>
          
          <nav id="dungeon-nav" className="mt-6">
            {dungeonNames.map(name => (
              <button
                key={name}
                className={`nav-btn ${currentDungeon === name ? 'active' : ''}`}
                onClick={() => setCurrentDungeon(name)}
              >
                {name}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main id="boss-container" className="py-10">
        <AnimatePresence mode="wait">
          {!currentDungeon ? (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="placeholder"
            >
              <p>{t.selectDungeon}</p>
            </motion.div>
          ) : (
            <motion.div
              key={currentDungeon}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-6"
            >
              {t.dungeons[currentDungeon].map((boss: any) => {
                const meta = DUNGEON_METADATA[currentDungeon];
                const bossMeta = meta?.bosses?.[boss.name];
                const bossImg = bossMeta?.img || "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
                const bossLink = bossMeta?.link || meta?.link || "#";

                return (
                  <article key={boss.name} className="boss-card">
                    <div className="boss-card-sidebar">
                      <img
                        src={bossImg}
                        alt={boss.name}
                        className="boss-img-round"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
                        }}
                      />
                    </div>
                    <div className="boss-content">
                      <h3>{boss.name}</h3>
                      <ul className="tips-list">
                        {boss.tips.map((tip: string, i: number) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                      <a href={bossLink} target="_blank" rel="noopener noreferrer" className="guide-link mt-4 inline-block">
                        {t.fullGuide}
                      </a>
                    </div>
                  </article>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div id="fail-counter-container">
        <div className="fail-label">{t.failLabel}</div>
        <div className="fail-controls">
          <button onClick={() => changeFails(-1)}>-</button>
          <span id="fail-count" className="transition-colors duration-300">
            {failCount}
          </span>
          <button onClick={() => changeFails(1)}>+</button>
        </div>
        <div className="fail-quote italic opacity-80 text-xs max-w-[150px] mx-auto">
          "{currentQuote}"
        </div>
      </div>

      <footer className="mt-auto">
        <p>{t.launch}</p>
        <p className="mt-2">© 2026 WorldOfDuckCraft | For Pros who don't need to read.</p>
      </footer>
    </div>
  );
}
