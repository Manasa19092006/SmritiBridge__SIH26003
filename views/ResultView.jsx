import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, Volume2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useActivity } from '../context/ActivityContext';
import { soundService } from '../services/soundService';
import { speechService } from '../services/speechService';

export function ResultView({ onContinue }) {
  const { t, lang } = useLanguage();
  const { performanceTier } = useActivity();
  const [selectedTier, setSelectedTier] = useState(performanceTier || 'good');

  React.useEffect(() => {
    if (performanceTier) {
      setSelectedTier(performanceTier);
    }
  }, [performanceTier]);

  const tiers = {
    good: {
      id: 'good',
      badge: t('results.goodBadge'),
      bg: 'linear-gradient(135deg, rgba(209, 250, 229, 0.9), rgba(236, 253, 245, 0.9))',
      borderColor: 'var(--c-mint-500)',
      heading: t('results.goodHeading'),
      description: t('results.goodDesc'),
      recommendation: t('results.goodNextLevel'),
      recommendationDesc: t('results.goodNextDesc')
    },
    attention: {
      id: 'attention',
      badge: t('results.attentionBadge'),
      bg: 'linear-gradient(135deg, rgba(254, 243, 199, 0.9), rgba(255, 237, 213, 0.9))',
      borderColor: 'var(--c-yellow-500)',
      heading: t('results.attentionHeading'),
      description: t('results.attentionDesc'),
      recommendation: t('results.attentionNextLevel'),
      recommendationDesc: t('results.attentionNextDesc')
    },
    assessment: {
      id: 'assessment',
      badge: t('results.assessBadge'),
      bg: 'linear-gradient(135deg, rgba(255, 228, 230, 0.9), rgba(255, 241, 242, 0.9))',
      borderColor: 'var(--c-coral-500)',
      heading: t('results.assessHeading'),
      description: t('results.assessDesc'),
      recommendation: t('results.assessNextLevel'),
      recommendationDesc: t('results.assessNextDesc')
    }
  };

  const currentData = tiers[selectedTier];

  const handleSpeak = () => {
    soundService.playBubblePop();
    speechService.speak(
      `${currentData.heading} ${currentData.description} ${t('results.aiRecStep')} ${currentData.recommendation}.`,
      lang
    );
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '16px' }}>
      {/* Tier Switcher for Demonstration / Testing */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <span style={{ fontSize: 'var(--fs-sm)', fontWeight: '700', alignSelf: 'center', color: 'var(--text-sub)' }}>
          {t('results.simulateTier')}
        </span>
        {Object.values(tiers).map(tItem => (
          <button
            key={tItem.id}
            className={`btn-elderly ${selectedTier === tItem.id ? 'btn-primary-purple' : 'btn-secondary'}`}
            onClick={() => {
              soundService.playBubblePop();
              setSelectedTier(tItem.id);
            }}
            style={{ padding: '8px 16px', minHeight: '44px', fontSize: 'var(--fs-sm)' }}
          >
            {tItem.badge}
          </button>
        ))}
      </div>

      {/* Main Result Card */}
      <div 
        className="card-elderly"
        style={{
          background: currentData.bg,
          border: `4px solid ${currentData.borderColor}`,
          textAlign: 'center',
          padding: '36px 28px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Badge Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#FFFFFF',
          padding: '8px 20px',
          borderRadius: 'var(--radius-full)',
          fontSize: 'var(--fs-base)',
          fontWeight: '900',
          color: 'var(--text-main)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '20px'
        }}>
          <span>{currentData.badge}</span>
        </div>

        <h1 style={{
          fontSize: 'var(--fs-2xl)',
          color: 'var(--text-main)',
          marginBottom: '16px',
          lineHeight: 1.3
        }}>
          {currentData.heading}
        </h1>

        <p style={{
          fontSize: 'var(--fs-lg)',
          color: 'var(--text-muted)',
          maxWidth: '620px',
          margin: '0 auto 28px',
          lineHeight: 1.5
        }}>
          {currentData.description}
        </p>

        {/* AI Recommended Next Level Box */}
        <div style={{
          background: 'var(--bg-card)',
          border: '3px dashed var(--c-purple-400)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          maxWidth: '560px',
          margin: '0 auto 28px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Sparkles size={24} color="var(--c-purple-600)" />
            <strong style={{ fontSize: 'var(--fs-lg)', color: 'var(--c-purple-700)' }}>
              {t('results.aiRecStep')}
            </strong>
          </div>

          <div style={{ fontSize: 'var(--fs-xl)', fontWeight: '900', color: 'var(--text-main)', marginBottom: '6px' }}>
            {currentData.recommendation}
          </div>

          <p style={{ fontSize: 'var(--fs-base)', color: 'var(--text-muted)' }}>
            {currentData.recommendationDesc}
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button
            className="btn-tts"
            onClick={handleSpeak}
            title={t('app.tapToListen')}
          >
            <Volume2 size={24} />
          </button>

          <button
            className="btn-elderly btn-primary-purple"
            onClick={() => {
              soundService.playChime();
              onContinue();
            }}
            style={{ minWidth: '280px', minHeight: '56px', fontSize: 'var(--fs-lg)' }}
          >
            <span>{t('results.continueToGames')}</span>
            <ArrowRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
