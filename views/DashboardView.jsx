import React from 'react';
import { 
  Gamepad2, UserCheck, Search, Calendar, Mic, 
  BarChart3, Volume2, Sparkles, Award, Star, Flame,
  CheckCircle, ArrowRight
} from 'lucide-react';
import { AssistantAvatar } from '../components/AssistantAvatar';
import { LanguageSelector } from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { useActivity } from '../context/ActivityContext';
import { soundService } from '../services/soundService';
import { speechService } from '../services/speechService';
import { badgesList } from '../data/demoData';

export function DashboardView({ 
  profile, 
  onNavigate 
}) {
  const { t, lang } = useLanguage();
  const { dailyProgress, cognitiveScore } = useActivity();

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.greetingMorning');
    if (hour < 17) return t('dashboard.greetingAfternoon');
    return t('dashboard.greetingEvening');
  };

  // Dynamic daily activity progress from actual game activities
  const completedActivities = dailyProgress.completed;
  const totalActivities = dailyProgress.total;
  const progressPercent = dailyProgress.percent;
  const healthScore = cognitiveScore;

  // SVG Progress Ring calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  const handleReadDashboard = () => {
    soundService.playBubblePop();
    const text = `${getTimeGreeting()}, ${profile.honorific || profile.name}! ${t('dashboard.cognitiveHealthScore')} ${healthScore} ${t('dashboard.outOf100')}. ${t('dashboard.streakBadge')}`;
    speechService.speak(text, lang);
  };

  const featureCards = [
    {
      id: 'games',
      target: 'games',
      subtarget: 'hub',
      title: '🎮 ' + t('dashboard.cardGamesTitle'),
      desc: t('dashboard.cardGamesDesc'),
      badge: t('dashboard.cardGamesBadge'),
      bgGradient: 'linear-gradient(135deg, rgba(237, 233, 254, 0.9), rgba(219, 234, 254, 0.9))',
      borderColor: 'var(--c-purple-400)',
      glowShadow: 'var(--shadow-glow-purple)',
      icon: Gamepad2,
      iconColor: 'var(--c-purple-600)'
    },
    {
      id: 'person-recognition',
      target: 'games',
      subtarget: 'faces',
      title: '👤 ' + t('dashboard.cardPersonTitle'),
      desc: t('dashboard.cardPersonDesc'),
      badge: t('dashboard.cardPersonBadge'),
      bgGradient: 'linear-gradient(135deg, rgba(255, 228, 230, 0.9), rgba(255, 241, 242, 0.9))',
      borderColor: 'var(--c-coral-400)',
      glowShadow: 'var(--shadow-glow-coral)',
      icon: UserCheck,
      iconColor: 'var(--c-coral-600)'
    },
    {
      id: 'object-recognition',
      target: 'games',
      subtarget: 'objects',
      title: '🧸 ' + t('dashboard.cardObjectTitle'),
      desc: t('dashboard.cardObjectDesc'),
      badge: t('dashboard.cardObjectBadge'),
      bgGradient: 'linear-gradient(135deg, rgba(254, 243, 199, 0.9), rgba(255, 237, 213, 0.9))',
      borderColor: 'var(--c-yellow-500)',
      glowShadow: '0 8px 24px rgba(245, 158, 11, 0.25)',
      icon: Search,
      iconColor: 'var(--c-yellow-600)'
    },
    {
      id: 'daily-recall',
      target: 'recall',
      title: '📅 ' + t('dashboard.cardRecallTitle'),
      desc: t('dashboard.cardRecallDesc'),
      badge: t('dashboard.cardRecallBadge'),
      bgGradient: 'linear-gradient(135deg, rgba(209, 250, 229, 0.9), rgba(236, 253, 245, 0.9))',
      borderColor: 'var(--c-mint-400)',
      glowShadow: 'var(--shadow-glow-mint)',
      icon: Calendar,
      iconColor: 'var(--c-mint-600)'
    },
    {
      id: 'voice-assistant',
      target: 'assistant',
      title: '🎤 ' + t('dashboard.cardAssistantTitle'),
      desc: t('dashboard.cardAssistantDesc'),
      badge: t('dashboard.cardAssistantBadge'),
      bgGradient: 'linear-gradient(135deg, rgba(219, 234, 254, 0.9), rgba(237, 233, 254, 0.9))',
      borderColor: 'var(--c-blue-400)',
      glowShadow: 'var(--shadow-glow-blue)',
      icon: Mic,
      iconColor: 'var(--c-blue-600)'
    },
    {
      id: 'my-progress',
      target: 'analytics',
      title: '📊 ' + t('dashboard.cardProgressTitle'),
      desc: t('dashboard.cardProgressDesc'),
      badge: t('dashboard.cardProgressBadge'),
      bgGradient: 'linear-gradient(135deg, rgba(245, 243, 255, 0.9), rgba(255, 247, 237, 0.9))',
      borderColor: 'var(--c-purple-400)',
      glowShadow: 'var(--shadow-glow-purple)',
      icon: BarChart3,
      iconColor: 'var(--c-purple-600)'
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
      {/* Prominent Global Language Selector Banner on Senior Dashboard */}
      <div 
        className="card-elderly"
        style={{
          marginBottom: '20px',
          padding: '16px 20px',
          background: 'var(--bg-card)',
          border: '2px dashed var(--c-purple-300)'
        }}
      >
        <LanguageSelector variant="pills" title={t('settings.languageTitle')} forRole="senior" />
      </div>

      {/* Top Greeting & Cognitive Health Banner */}
      <div 
        className="card-elderly"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '24px',
          marginBottom: '28px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), var(--c-blue-50))',
          border: '3px solid var(--c-blue-300)',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ flex: 1, minWidth: '280px' }}>
          {/* Streak badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #FFEDD5, #FEF3C7)',
            border: '2px solid var(--c-peach-400)',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            color: 'var(--c-peach-600)',
            fontWeight: '900',
            fontSize: 'var(--fs-base)',
            marginBottom: '14px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Flame size={22} color="#EA580C" fill="#EA580C" />
            <span>{t('dashboard.streakBadge')}</span>
          </div>

          <h1 style={{ fontSize: 'var(--fs-3xl)', marginBottom: '8px' }}>
            {getTimeGreeting()}, <span style={{ color: 'var(--c-blue-600)' }}>{profile.honorific || profile.name}</span>! ☀️
          </h1>

          <p style={{ fontSize: 'var(--fs-lg)', color: 'var(--text-muted)', marginBottom: '16px' }}>
            {t('dashboard.subGreeting')}
          </p>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn-elderly btn-primary-blue"
              onClick={() => onNavigate('games')}
              style={{ minHeight: '52px', fontSize: 'var(--fs-base)' }}
            >
              <Gamepad2 size={22} />
              <span>{t('dashboard.playTodayGames')}</span>
            </button>

            <button
              className="btn-tts"
              onClick={handleReadDashboard}
              title={t('app.tapToListen')}
            >
              <Volume2 size={22} />
            </button>
          </div>
        </div>

        {/* Circular Cognitive Score Progress Ring */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px'
        }}>
          <div className="progress-ring-container">
            <svg width="170" height="170">
              <circle
                stroke="var(--c-blue-100)"
                fill="transparent"
                strokeWidth="14"
                r={radius}
                cx="85"
                cy="85"
              />
              <circle
                className="progress-ring-circle"
                stroke="url(#bluePurpleGradient)"
                fill="transparent"
                strokeWidth="14"
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={radius}
                cx="85"
                cy="85"
              />
              <defs>
                <linearGradient id="bluePurpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>

            <div className="progress-ring-content">
              <span style={{ fontSize: 'var(--fs-3xl)', fontWeight: '900', color: 'var(--c-purple-700)', lineHeight: 1 }}>
                {healthScore}
              </span>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-sub)', fontWeight: '800' }}>
                {t('dashboard.outOf100')}
              </span>
              <span style={{ 
                fontSize: 'var(--fs-xs)', 
                color: 'var(--c-mint-600)', 
                fontWeight: '900',
                background: 'var(--c-mint-100)',
                padding: '2px 8px',
                borderRadius: '10px',
                marginTop: '4px'
              }}>
                {t('dashboard.vibrantActive')}
              </span>
            </div>
          </div>

          <span style={{ fontSize: 'var(--fs-sm)', fontWeight: '800', color: 'var(--text-muted)', marginTop: '8px' }}>
            {t('dashboard.cognitiveHealthScore')}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>
            {t('dashboard.wellnessDisclaimer')}
          </span>
        </div>
      </div>

      {/* AI Assistant Character Bubble */}
      <div style={{ marginBottom: '28px' }}>
        <AssistantAvatar
          message={`"${t('assistant.greeting', { name: profile.name, completed: completedActivities, total: totalActivities })}"`}
          actionText={t('assistant.actionBtn')}
          onActionClick={() => onNavigate('games', 'matching')}
        />
      </div>

      {/* Today's Activity Progress Bar */}
      <div 
        className="card-elderly"
        style={{
          marginBottom: '28px',
          background: 'var(--bg-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle size={24} color="var(--c-mint-500)" />
            <h3 style={{ fontSize: 'var(--fs-lg)', color: 'var(--text-main)' }}>
              {t('dashboard.todayActivities')} ({completedActivities}/{totalActivities})
            </h3>
          </div>
          <span style={{ fontWeight: '800', fontSize: 'var(--fs-base)', color: 'var(--c-mint-600)' }}>
            {progressPercent}% {t('dashboard.percentDone')}
          </span>
        </div>

        {/* Progress bar line */}
        <div style={{
          width: '100%',
          height: '16px',
          background: 'var(--c-mint-100)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--c-mint-400), var(--c-mint-600))',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.8s ease'
          }} />
        </div>
      </div>

      {/* SECTION 3 CORE: SIX LARGE ANIMATED ACTION CARDS */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: 'var(--fs-2xl)', 
          marginBottom: '18px', 
          color: 'var(--text-main)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span>{t('dashboard.exploreHub')}</span>
          <span style={{ fontSize: 'var(--fs-sm)', background: 'var(--c-purple-100)', color: 'var(--c-purple-700)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontWeight: '800' }}>
            {t('dashboard.sixButtons')}
          </span>
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '22px'
        }}>
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="card-elderly card-interactive"
                onClick={() => {
                  soundService.playBubblePop();
                  onNavigate(card.target, card.subtarget);
                }}
                style={{
                  background: card.bgGradient,
                  border: `3px solid ${card.borderColor}`,
                  boxShadow: card.glowShadow,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '210px',
                  padding: '24px'
                }}
                role="button"
                tabIndex={0}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-md)',
                      background: '#FFFFFF',
                      boxShadow: 'var(--shadow-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={34} color={card.iconColor} />
                    </div>

                    <span style={{
                      background: '#FFFFFF',
                      color: card.iconColor,
                      fontSize: 'var(--fs-xs)',
                      fontWeight: '800',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      {card.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 'var(--fs-xl)', color: 'var(--text-main)', marginBottom: '8px' }}>
                    {card.title}
                  </h3>

                  <p style={{ fontSize: 'var(--fs-base)', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {card.desc}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '16px',
                  color: card.iconColor,
                  fontWeight: '800',
                  fontSize: 'var(--fs-base)'
                }}>
                  <span>{t('dashboard.tapToOpen')}</span>
                  <ArrowRight size={20} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Achievements & Badges Preview */}
      <div 
        className="card-elderly"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), var(--c-yellow-50))',
          border: '2px solid var(--c-yellow-400)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={26} color="var(--c-yellow-600)" />
            <h3 style={{ fontSize: 'var(--fs-xl)', color: 'var(--text-main)' }}>
              {t('dashboard.recentBadgesTitle')}
            </h3>
          </div>

          <button
            className="btn-elderly btn-secondary"
            onClick={() => onNavigate('achievements')}
            style={{ minHeight: '44px', padding: '8px 16px', fontSize: 'var(--fs-sm)' }}
          >
            <span>{t('dashboard.viewAllBadges')}</span>
            <ArrowRight size={18} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px'
        }}>
          {badgesList.slice(0, 3).map(badge => (
            <div
              key={badge.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card)',
                border: '2px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: badge.color,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                flexShrink: 0
              }}>
                {badge.icon}
              </div>

              <div>
                <strong style={{ fontSize: 'var(--fs-base)', display: 'block', color: 'var(--text-main)' }}>
                  {t(`bb${(badge?.id || '').replace(/\D/g, '') || '1'}Title`) || badge.title}
                </strong>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-mint-600)', fontWeight: '700' }}>
                  {t('dashboard.unlockedPrefix')} {badge.unlockedDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
