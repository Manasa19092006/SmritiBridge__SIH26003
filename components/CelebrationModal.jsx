import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Star, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { soundService } from '../services/soundService';
import { speechService } from '../services/speechService';

export function CelebrationModal({ 
  isOpen, 
  title = '', 
  message = '', 
  starsEarned = 3, 
  coinsEarned = 50, 
  onClose
}) {
  const { lang, t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      soundService.playFanfare();
      if (message) {
        speechService.speak(message, lang);
      }

      // Trigger colorful celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#F43F5E']
        });
      } catch (e) {
        console.warn('Confetti error', e);
      }
    }
  }, [isOpen, message, lang]);

  if (!isOpen) return null;

  const displayTitle = title || t('app.name');

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      padding: '20px'
    }}>
      <div 
        className="card-elderly"
        style={{
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          background: 'var(--bg-card)',
          border: '4px solid var(--c-yellow-400)',
          boxShadow: '0 25px 50px -12px rgba(234, 179, 8, 0.35)',
          animation: 'character-bob 0.6s ease-out'
        }}
      >
        <div style={{
          width: '90px',
          height: '90px',
          margin: '-60px auto 16px',
          background: 'linear-gradient(135deg, var(--c-yellow-400), var(--c-peach-400))',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-lg)',
          border: '5px solid var(--bg-card)'
        }}>
          <Sparkles size={46} color="#FFFFFF" />
        </div>

        <h2 style={{ fontSize: 'var(--fs-2xl)', color: 'var(--c-purple-700)', marginBottom: '8px' }}>
          {displayTitle}
        </h2>

        <p style={{ fontSize: 'var(--fs-lg)', color: 'var(--text-muted)', marginBottom: '20px' }}>
          {message}
        </p>

        {/* Stars Earned */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: i < starsEarned ? 'var(--c-yellow-100)' : 'var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `3px solid ${i < starsEarned ? 'var(--c-yellow-400)' : 'transparent'}`
              }}
            >
              <Star 
                size={32} 
                fill={i < starsEarned ? '#EAB308' : 'none'} 
                color={i < starsEarned ? '#EAB308' : '#94A3B8'} 
              />
            </div>
          ))}
        </div>

        {/* Rewards pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '16px',
          padding: '10px 24px',
          background: 'var(--c-mint-50)',
          border: '2px solid var(--c-mint-400)',
          borderRadius: 'var(--radius-full)',
          marginBottom: '28px',
          fontWeight: '800',
          fontSize: 'var(--fs-base)',
          color: 'var(--c-mint-700)'
        }}>
          <span>🪙 +{coinsEarned} {t('app.points')}</span>
          <span>•</span>
          <span>⭐ +{starsEarned} {t('app.stars')}</span>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn-elderly btn-primary-purple"
            onClick={() => {
              soundService.playBubblePop();
              onClose();
            }}
            style={{ width: '100%', maxWidth: '300px' }}
          >
            <span>{t('app.continue')}</span>
            <ArrowRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
