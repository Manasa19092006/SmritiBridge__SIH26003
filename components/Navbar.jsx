import React from 'react';
import { 
  Volume2, VolumeX, Sun, Moon, 
  ShieldCheck, Eye
} from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { soundService } from '../services/soundService';

export function Navbar({ 
  theme, 
  toggleTheme, 
  fontSizeLevel, 
  cycleFontSize, 
  isMuted, 
  toggleMute,
  reduceMotion,
  toggleReduceMotion,
  isCaregiverMode,
  setCaregiverMode,
  onReadPageAloud,
  isSpeaking
}) {
  const { t } = useLanguage();

  return (
    <header className="navbar-top">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div 
          className="brand-logo" 
          onClick={() => { soundService.playBubblePop(); }}
          role="button"
          tabIndex={0}
        >
          <div className="brand-icon-box">
            <span>🧠</span>
          </div>
          <div className="brand-text">
            <h1>{t('app.name')}</h1>
            <span className="brand-tagline">{t('app.tagline')}</span>
          </div>
        </div>

        {/* Elderly-Friendly Controls */}
        <div className="nav-controls">
          {/* Read Page Aloud (TTS) */}
          <button 
            className={`btn-tts ${isSpeaking ? 'is-speaking' : ''}`}
            onClick={onReadPageAloud}
            title={isSpeaking ? t('app.stopAudio') : t('app.readAloud')}
            aria-label={t('app.readAloud')}
          >
            <Volume2 size={24} />
          </button>

          {/* Sound FX Mute Toggle */}
          <button 
            className="icon-pill-btn"
            onClick={toggleMute}
            title={isMuted ? t('app.soundFxUnmute') : t('app.soundFxMute')}
            aria-label={t('app.soundFxMute')}
          >
            {isMuted ? <VolumeX size={22} color="#EF4444" /> : <Volume2 size={22} color="#10B981" />}
          </button>

          {/* Font Size Adjuster A- / A / A+ */}
          <div className="font-size-toggle" title={t('app.fontSize')}>
            <button 
              className={`font-size-btn ${fontSizeLevel === 1 ? 'active' : ''}`}
              onClick={() => cycleFontSize(1)}
              aria-label="Standard Font Size"
            >
              A
            </button>
            <button 
              className={`font-size-btn ${fontSizeLevel === 1.2 ? 'active' : ''}`}
              onClick={() => cycleFontSize(1.2)}
              aria-label="Large Font Size"
            >
              A+
            </button>
            <button 
              className={`font-size-btn ${fontSizeLevel === 1.4 ? 'active' : ''}`}
              onClick={() => cycleFontSize(1.4)}
              aria-label="Extra Large Font Size"
            >
              A++
            </button>
          </div>

          {/* Global Language Selector Dropdown */}
          <LanguageSelector variant="dropdown" />

          {/* Theme Light/Dark Mode */}
          <button 
            className="icon-pill-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? t('app.themeSunlight') : t('app.themeMoonlit')}
            aria-label={theme === 'dark' ? t('app.themeSunlight') : t('app.themeMoonlit')}
          >
            {theme === 'dark' ? <Sun size={22} color="#FACC15" /> : <Moon size={22} color="#8B5CF6" />}
          </button>

          {/* Motion Toggle */}
          <button 
            className="icon-pill-btn"
            onClick={toggleReduceMotion}
            title={t('app.reduceMotion')}
            style={{ borderColor: reduceMotion ? 'var(--c-peach-500)' : 'var(--border-color)' }}
            aria-label={t('app.reduceMotion')}
          >
            <Eye size={20} color={reduceMotion ? 'var(--c-peach-500)' : 'var(--text-sub)'} />
          </button>

          {/* Caregiver Portal Switch */}
          <button
            className="btn-elderly"
            style={{
              padding: '10px 16px',
              minHeight: '46px',
              fontSize: 'var(--fs-sm)',
              borderRadius: 'var(--radius-md)',
              background: isCaregiverMode ? 'linear-gradient(135deg, var(--c-purple-600), var(--c-blue-600))' : 'var(--bg-card)',
              color: isCaregiverMode ? '#FFFFFF' : 'var(--text-main)',
              border: '2px solid var(--border-color)'
            }}
            onClick={() => {
              soundService.playBubblePop();
              setCaregiverMode(!isCaregiverMode);
            }}
          >
            <ShieldCheck size={18} />
            <span>{isCaregiverMode ? t('nav.seniorMode') : t('nav.caregiverPortal')}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
