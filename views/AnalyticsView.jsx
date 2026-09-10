import React from 'react';
import { 
  BarChart3, Brain, Target, MessageCircle, Clock, 
  TrendingUp, Volume2, Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useActivity } from '../context/ActivityContext';
import { soundService } from '../services/soundService';
import { speechService } from '../services/speechService';

export function AnalyticsView({ profile, onNavigate }) {
  const { t, lang } = useLanguage();
  const { metrics: activityMetrics, weeklyTrend, cognitiveScore } = useActivity();

  const weeklyData = weeklyTrend;

  const metrics = [
    {
      id: 'memory',
      title: t('analytics.memoryScore'),
      score: activityMetrics.memoryScore,
      displayScore: `${activityMetrics.memoryScore}%`,
      sub: t('analytics.memorySub'),
      icon: Brain,
      color: 'var(--c-purple-600)',
      bg: 'var(--c-purple-100)',
      border: 'var(--c-purple-400)'
    },
    {
      id: 'attention',
      title: t('analytics.attentionScore'),
      score: activityMetrics.attentionScore,
      displayScore: `${activityMetrics.attentionScore}%`,
      sub: t('analytics.attentionSub'),
      icon: Target,
      color: 'var(--c-blue-600)',
      bg: 'var(--c-blue-100)',
      border: 'var(--c-blue-400)'
    },
    {
      id: 'recall',
      title: t('analytics.recallAccuracy'),
      score: activityMetrics.recallAccuracy,
      displayScore: `${activityMetrics.recallAccuracy}%`,
      sub: t('analytics.recallSub'),
      icon: MessageCircle,
      color: 'var(--c-mint-600)',
      bg: 'var(--c-mint-100)',
      border: 'var(--c-mint-400)'
    },
    {
      id: 'speed',
      title: t('analytics.responseTime'),
      score: Math.min(100, Math.max(50, Math.round(100 - (parseFloat(activityMetrics.responseTimeSec) - 1.2) * 16))),
      displayScore: `${activityMetrics.responseTimeSec}s`,
      sub: `${activityMetrics.responseTimeSec}s avg speed`,
      icon: Clock,
      color: 'var(--c-peach-600)',
      bg: 'var(--c-peach-100)',
      border: 'var(--c-peach-400)'
    }
  ];

  const handleSpeakSummary = () => {
    soundService.playBubblePop();
    const text = `${t('analytics.title')}. ${t('analytics.subtitle', { name: profile.honorific || profile.name })}. ${t('analytics.memoryScore')} ${activityMetrics.memoryScore}%, ${t('analytics.attentionScore')} ${activityMetrics.attentionScore}%, ${t('analytics.recallAccuracy')} ${activityMetrics.recallAccuracy}%. ${t('analytics.disclaimerText')}`;
    speechService.speak(text, lang);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px' }}>
      {/* Top Banner */}
      <div 
        className="card-elderly"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, rgba(237, 233, 254, 0.95), var(--c-blue-50))',
          border: '3px solid var(--c-purple-400)',
          flexWrap: 'wrap'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              background: 'var(--c-purple-100)',
              color: 'var(--c-purple-700)',
              fontWeight: '800',
              padding: '4px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--fs-sm)'
            }}>
              📊 {t('analytics.title')}
            </span>
          </div>

          <h1 style={{ fontSize: 'var(--fs-2xl)', color: 'var(--text-main)', marginBottom: '8px' }}>
            {t('analytics.subtitle', { name: profile.name })}
          </h1>

          <p style={{ fontSize: 'var(--fs-base)', color: 'var(--text-muted)' }}>
            {t('analytics.desc')}
          </p>
        </div>

        <button
          className="btn-tts"
          onClick={handleSpeakSummary}
          title={t('app.tapToListen')}
        >
          <Volume2 size={24} />
        </button>
      </div>

      {/* Prominent Ethical Medical Disclaimer Alert Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #FEFCE8, #FFF7ED)',
        border: '2px solid var(--c-yellow-500)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <Info size={26} color="#B45309" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ fontSize: 'var(--fs-base)', color: '#92400E', display: 'block', marginBottom: '2px' }}>
            {t('analytics.disclaimerTitle')}
          </strong>
          <p style={{ fontSize: 'var(--fs-sm)', color: '#78350F', lineHeight: 1.4 }}>
            {t('analytics.disclaimerText')}
          </p>
        </div>
      </div>

      {/* 4 Core Cognitive Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {metrics.map(m => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              className="card-elderly"
              style={{
                background: 'var(--bg-card)',
                border: `3px solid ${m.border}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: 'var(--radius-md)',
                  background: m.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={28} color={m.color} />
                </div>

                <span style={{ fontSize: 'var(--fs-2xl)', fontWeight: '900', color: m.color }}>
                  {m.displayScore || `${m.score}%`}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: 'var(--fs-lg)', color: 'var(--text-main)', marginBottom: '4px' }}>
                  {m.title}
                </h3>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', fontWeight: '700' }}>
                  {m.sub}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{
                width: '100%',
                height: '10px',
                background: 'var(--border-color)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
                marginTop: 'auto'
              }}>
                <div style={{
                  width: `${m.score}%`,
                  height: '100%',
                  background: m.color,
                  borderRadius: 'var(--radius-full)'
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 7-Day Performance Trend Chart */}
      <div 
        className="card-elderly"
        style={{
          background: 'var(--bg-card)',
          border: '2px solid var(--border-color)',
          marginBottom: '32px',
          padding: '24px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: 'var(--fs-xl)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TrendingUp size={24} color="var(--c-mint-600)" />
              <span>{t('analytics.weeklyTrend')}</span>
            </h2>
            <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
              {t('analytics.weeklyTrendSub')}
            </span>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--c-mint-100)',
            color: 'var(--c-mint-700)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            fontWeight: '800',
            fontSize: 'var(--fs-base)'
          }}>
            <span>{t('analytics.improvementBadge')}</span>
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '14px',
          height: '220px',
          paddingTop: '20px',
          paddingBottom: '10px',
          borderBottom: '2px solid var(--border-color)'
        }}>
          {weeklyData.map((item, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'flex-end',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: 'var(--fs-xs)', fontWeight: '800', color: 'var(--text-main)' }}>
                {item.score}
              </span>

              {/* Bar */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '56px',
                  height: `${(item.score / 100) * 160}px`,
                  background: item.day === 'Today' 
                    ? 'linear-gradient(180deg, var(--c-purple-500), var(--c-blue-500))' 
                    : 'linear-gradient(180deg, var(--c-blue-400), var(--c-blue-500))',
                  borderRadius: '12px 12px 4px 4px',
                  boxShadow: item.day === 'Today' ? '0 0 16px rgba(139, 92, 246, 0.45)' : 'none',
                  transition: 'height 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />

              <span style={{
                fontSize: 'var(--fs-sm)',
                fontWeight: item.day === 'Today' ? '900' : '700',
                color: item.day === 'Today' ? 'var(--c-purple-700)' : 'var(--text-sub)'
              }}>
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Button to view Personalized Result Milestone */}
      <div style={{ textAlign: 'center' }}>
        <button
          className="btn-elderly btn-primary-purple"
          onClick={() => onNavigate('results')}
          style={{ minWidth: '320px', minHeight: '56px', fontSize: 'var(--fs-lg)' }}
        >
          <BarChart3 size={24} />
          <span>{t('analytics.viewResultsBtn')}</span>
        </button>
      </div>
    </div>
  );
}
