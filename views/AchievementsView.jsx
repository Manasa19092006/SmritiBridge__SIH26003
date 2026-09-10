import React, { useState } from 'react';
import { 
  Award, Star, Flame, Trophy, Sparkles, Check, 
  Lock, Volume2, ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../services/soundService';
import { speechService } from '../services/speechService';
import { badgesList } from '../data/demoData';
import { useLanguage } from '../context/LanguageContext';
import { useActivity } from '../context/ActivityContext';

export function AchievementsView({ profile }) {
  const { t, currentLang } = useLanguage();
  const { activities } = useActivity();
  const [selectedBadge, setSelectedBadge] = useState(null);

  const isBadgeUnlocked = (badge) => {
    const num = parseInt((badge?.id || '').replace(/\D/g, ''), 10) || 1;
    if (num === 1) return activities.length >= 1;
    if (num === 2) return profile.stars >= 10 || activities.length >= 2;
    if (num === 3) return activities.length >= 3;
    if (num === 4) return activities.some(a => a.accuracy === 100);
    if (num === 5) return activities.length >= 5;
    if (num === 6) return activities.length >= 7;
    return badge.unlocked;
  };

  const getBadgeTitle = (badge) => {
    const num = (badge?.id || '').replace(/\D/g, '') || '1';
    return t(`bb${num}Title`) || t(`achievements.bb${num}Title`) || badge.title;
  };

  const getBadgeDesc = (badge) => {
    const num = (badge?.id || '').replace(/\D/g, '') || '1';
    return t(`bb${num}Desc`) || t(`achievements.bb${num}Desc`) || badge.desc;
  };

  const handleBadgeClick = (badge) => {
    soundService.playBubblePop();
    const unlocked = isBadgeUnlocked(badge);
    setSelectedBadge({ ...badge, unlocked });

    const title = getBadgeTitle(badge);
    const desc = getBadgeDesc(badge);

    if (unlocked) {
      soundService.playFanfare();
      speechService.speak(`${title}. ${desc}`, currentLang);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } else {
      speechService.speak(`${title}. ${desc}`, currentLang);
    }
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '16px' }}>
      {/* Top Banner */}
      <div 
        className="card-elderly"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '28px',
          background: 'linear-gradient(135deg, rgba(254, 240, 138, 0.9), rgba(255, 237, 213, 0.9))',
          border: '3px solid var(--c-yellow-500)',
          flexWrap: 'wrap'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              background: '#FFFFFF',
              color: '#78350F',
              fontWeight: '900',
              padding: '4px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--fs-sm)'
            }}>
              🏆 {t('achievements.badgeHeader')}
            </span>
          </div>

          <h1 style={{ fontSize: 'var(--fs-2xl)', color: '#78350F', marginBottom: '8px' }}>
            {t('achievements.title', { name: profile.name })}
          </h1>

          <p style={{ fontSize: 'var(--fs-base)', color: '#92400E' }}>
            {t('achievements.subtitle')}
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          background: '#FFFFFF',
          padding: '12px 24px',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 'var(--fs-2xl)', fontWeight: '900', color: '#D97706', display: 'block' }}>
              {profile.stars}
            </span>
            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-sub)', fontWeight: '700' }}>
              {t('achievements.starsEarned')}
            </span>
          </div>

          <div style={{ width: '2px', height: '40px', background: 'var(--border-color)' }} />

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 'var(--fs-2xl)', fontWeight: '900', color: '#059669', display: 'block' }}>
              {profile.coins}
            </span>
            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-sub)', fontWeight: '700' }}>
              {t('achievements.coinsEarned')}
            </span>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '22px',
        marginBottom: '32px'
      }}>
        {badgesList.map(badge => {
          const title = getBadgeTitle(badge);
          const desc = getBadgeDesc(badge);
          const unlocked = isBadgeUnlocked(badge);

          return (
            <div
              key={badge.id}
              className="card-elderly card-interactive"
              onClick={() => handleBadgeClick(badge)}
              style={{
                background: 'var(--bg-card)',
                border: `3px solid ${unlocked ? 'var(--c-yellow-400)' : 'var(--border-color)'}`,
                opacity: unlocked ? 1 : 0.75,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '18px',
                padding: '24px'
              }}
            >
              <div style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                background: unlocked ? badge.color : 'var(--border-color)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                boxShadow: unlocked ? 'var(--shadow-md)' : 'none',
                flexShrink: 0
              }}>
                {unlocked ? badge.icon : <Lock size={28} color="#64748B" />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: 'var(--fs-lg)', color: 'var(--text-main)' }}>
                    {title}
                  </h3>
                  {unlocked ? (
                    <span style={{
                      background: 'var(--c-mint-100)',
                      color: 'var(--c-mint-700)',
                      fontSize: 'var(--fs-xs)',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '10px'
                    }}>
                      {t('achievements.unlocked')}
                    </span>
                  ) : (
                    <span style={{
                      background: 'var(--bg-card-subtle)',
                      color: 'var(--text-sub)',
                      fontSize: 'var(--fs-xs)',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '10px'
                    }}>
                      {t('achievements.inProgress')}
                    </span>
                  )}
                </div>

                <p style={{ fontSize: 'var(--fs-base)', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {desc}
                </p>

                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-purple-600)', fontWeight: '700', marginTop: '8px', display: 'block' }}>
                  {t('achievements.tapToHear')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Badge Detail Modal */}
      {selectedBadge && (
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
              maxWidth: '480px',
              width: '100%',
              textAlign: 'center',
              background: 'var(--bg-card)',
              border: '4px solid var(--c-yellow-400)'
            }}
          >
            <div style={{
              width: '90px',
              height: '90px',
              margin: '0 auto 16px',
              borderRadius: '50%',
              background: selectedBadge.unlocked ? selectedBadge.color : 'var(--border-color)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3.6rem',
              boxShadow: 'var(--shadow-lg)'
            }}>
              {selectedBadge.icon}
            </div>

            <h2 style={{ fontSize: 'var(--fs-2xl)', color: 'var(--text-main)', marginBottom: '8px' }}>
              {getBadgeTitle(selectedBadge)}
            </h2>

            <p style={{ fontSize: 'var(--fs-lg)', color: 'var(--text-muted)', marginBottom: '24px' }}>
              {getBadgeDesc(selectedBadge)}
            </p>

            <button
              className="btn-elderly btn-primary-yellow"
              onClick={() => setSelectedBadge(null)}
              style={{ width: '100%', maxWidth: '240px', margin: '0 auto' }}
            >
              <span>{t('achievements.awesome')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
