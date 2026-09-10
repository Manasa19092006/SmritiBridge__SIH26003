import React from 'react';
import { Volume2, Sparkles, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { speechService } from '../services/speechService';
import { soundService } from '../services/soundService';

export function AssistantAvatar({ 
  message, 
  emotion = 'happy',
  onActionClick = null,
  actionText = null 
}) {
  const { lang, t } = useLanguage();

  const handleSpeak = () => {
    soundService.playBubblePop();
    speechService.speak(message, lang);
  };

  const getEmoji = () => {
    switch (emotion) {
      case 'celebrating': return '🎉';
      case 'listening': return '👂🏽';
      case 'encouraging': return '🌟';
      default: return '👵🏽';
    }
  };

  return (
    <div className="assistant-avatar-card">
      <div className="assistant-character-box">
        <span>{getEmoji()}</span>
        <div className="character-badge" title="AI Companion Active">
          <Sparkles size={16} />
        </div>
      </div>

      <div className="assistant-speech-bubble">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '800', color: 'var(--c-purple-700)', fontSize: 'var(--fs-base)' }}>
              {t('assistant.name')}
            </span>
            <span style={{ fontSize: 'var(--fs-xs)', background: 'var(--c-purple-100)', color: 'var(--c-purple-700)', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
              {t('assistant.title')}
            </span>
          </div>

          <button 
            className="btn-tts" 
            style={{ width: '38px', height: '38px' }}
            onClick={handleSpeak}
            title={t('assistant.listenBtn')}
            aria-label={t('assistant.listenBtn')}
          >
            <Volume2 size={20} />
          </button>
        </div>

        <p>{message}</p>

        {actionText && onActionClick && (
          <button 
            className="btn-elderly btn-primary-purple"
            style={{ marginTop: '14px', padding: '10px 20px', minHeight: '44px', fontSize: 'var(--fs-base)' }}
            onClick={onActionClick}
          >
            <Heart size={18} fill="#FFFFFF" />
            <span>{actionText}</span>
          </button>
        )}
      </div>
    </div>
  );
}
