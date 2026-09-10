import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, Download, User, Calendar, 
  Clock, Heart, Sparkles, CheckCircle2, TrendingUp, 
  FileText, Activity, Phone, Mail, Share2, Printer
} from 'lucide-react';
import { soundService } from '../services/soundService';
import { useLanguage } from '../context/LanguageContext';
import { useActivity } from '../context/ActivityContext';
import { LanguageSelector } from '../components/LanguageSelector';

export function CaregiverView({ profile, onExitCaregiver }) {
  const { t } = useLanguage();
  const { activities, todayActivities, caregiverSummary, cognitiveScore, metrics } = useActivity();
  const [showDoctorReportModal, setShowDoctorReportModal] = useState(false);
  const [simulatedAlertActive, setSimulatedAlertActive] = useState(false);

  const handlePrintReport = () => {
    soundService.playBubblePop();
    window.print();
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '16px' }}>
      {/* Caregiver Portal Header */}
      <div 
        className="card-elderly"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '28px',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.9))',
          color: '#FFFFFF',
          border: '3px solid #475569',
          flexWrap: 'wrap'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              background: '#3B82F6',
              color: '#FFFFFF',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--fs-xs)',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <ShieldCheck size={16} />
              <span>{t('caregiver.badge')}</span>
            </div>
          </div>

          <h1 style={{ fontSize: 'var(--fs-2xl)', color: '#FFFFFF', marginBottom: '6px' }}>
            {t('caregiver.title', { name: profile.name })}
          </h1>

          <p style={{ fontSize: 'var(--fs-base)', color: '#94A3B8' }}>
            {t('caregiver.subtitle', { caregiver: profile.caregiver?.name || 'Kavitha', phone: profile.caregiver?.phone || '+91 98401 23456' })}
          </p>

          {/* Caregiver Language Selector */}
          <div style={{ marginTop: '16px', background: 'rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '12px' }}>
            <LanguageSelector variant="pills" forRole="caregiver" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            className="btn-elderly"
            onClick={() => {
              soundService.playBubblePop();
              setShowDoctorReportModal(true);
            }}
            style={{
              background: '#3B82F6',
              color: '#FFFFFF',
              minHeight: '48px',
              padding: '10px 20px',
              fontSize: 'var(--fs-base)'
            }}
          >
            <FileText size={20} />
            <span>{t('caregiver.generateReport')}</span>
          </button>

          <button
            className="btn-elderly"
            onClick={onExitCaregiver}
            style={{
              background: 'transparent',
              color: '#FFFFFF',
              border: '2px solid #64748B',
              minHeight: '48px',
              padding: '10px 20px',
              fontSize: 'var(--fs-base)'
            }}
          >
            <span>{t('caregiver.returnSenior')}</span>
          </button>
        </div>
      </div>

      {/* Primary Safe Status Banner */}
      {!simulatedAlertActive ? (
        <div style={{
          background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
          border: '3px solid var(--c-mint-500)',
          borderRadius: 'var(--radius-xl)',
          padding: '20px 26px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: 'var(--shadow-md)',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--c-mint-500)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <CheckCircle2 size={32} />
            </div>

            <div>
              <h2 style={{ fontSize: 'var(--fs-xl)', color: 'var(--c-mint-700)', marginBottom: '4px' }}>
                {t('caregiver.safeBannerTitle')}
              </h2>
              <p style={{ fontSize: 'var(--fs-base)', color: 'var(--c-mint-600)' }}>
                {t('caregiver.safeBannerDesc', { name: profile.honorific || profile.name })}
              </p>
            </div>
          </div>

          <button
            className="btn-elderly btn-secondary"
            onClick={() => setSimulatedAlertActive(true)}
            style={{ minHeight: '42px', fontSize: 'var(--fs-xs)', background: '#FFFFFF' }}
          >
            {t('caregiver.simulateAlertBtn')}
          </button>
        </div>
      ) : (
        /* Gentle Alert Notice Without Claiming Diagnosis */
        <div style={{
          background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)',
          border: '3px solid var(--c-peach-500)',
          borderRadius: 'var(--radius-xl)',
          padding: '20px 26px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: 'var(--shadow-md)',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--c-peach-500)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <AlertTriangle size={32} />
            </div>

            <div>
              <h2 style={{ fontSize: 'var(--fs-xl)', color: 'var(--c-peach-700)', marginBottom: '4px' }}>
                {t('caregiver.alertBannerTitle')}
              </h2>
              <p style={{ fontSize: 'var(--fs-base)', color: 'var(--c-peach-600)' }}>
                {t('caregiver.alertBannerDesc')}
              </p>
            </div>
          </div>

          <button
            className="btn-elderly btn-secondary"
            onClick={() => setSimulatedAlertActive(false)}
            style={{ minHeight: '42px', fontSize: 'var(--fs-xs)', background: '#FFFFFF' }}
          >
            {t('caregiver.dismissAlertBtn')}
          </button>
        </div>
      )}

      {/* 3 Core Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '28px'
      }}>
        {/* Card 1: Family Recognition */}
        <div className="card-elderly" style={{ border: '2px solid var(--c-coral-300)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: 'var(--fs-lg)', color: 'var(--c-coral-600)' }}>
              {t('caregiver.familyAccuracyTitle')}
            </h3>
            <span style={{ fontSize: 'var(--fs-xl)', fontWeight: '900', color: 'var(--c-coral-600)' }}>
              {caregiverSummary.familyAccuracy}%
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {profile.familiarPeople.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--fs-sm)' }}>
                <span>{p.emoji} {p.name} ({p.relation})</span>
                <span style={{ fontWeight: '800', color: 'var(--c-mint-600)' }}>Instant (1.6s)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Today's Engagement Log */}
        <div className="card-elderly" style={{ border: '2px solid var(--c-blue-300)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: 'var(--fs-lg)', color: 'var(--c-blue-600)' }}>
              {t('caregiver.sessionEngagementTitle')}
            </h3>
            <span style={{ fontSize: 'var(--fs-xl)', fontWeight: '900', color: 'var(--c-blue-600)' }}>
              {caregiverSummary.engagementMinutes} mins
            </span>
          </div>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
            {todayActivities.length > 0 ? (
              todayActivities.slice(0, 4).map((act, i) => (
                <li key={act.id || i}>
                  ✓ {act.gameName}: {act.performance || act.status} ({act.accuracy}%)
                </li>
              ))
            ) : activities.length > 0 ? (
              activities.slice(0, 4).map((act, i) => (
                <li key={act.id || i}>
                  ✓ {act.gameName}: {act.performance || act.status} ({act.accuracy}%)
                </li>
              ))
            ) : (
              <li>✓ Ready for today's cognitive activities</li>
            )}
          </ul>
        </div>

        {/* Card 3: Caregiver Guidance & Recommended Actions */}
        <div className="card-elderly" style={{ border: '2px solid var(--c-purple-300)' }}>
          <h3 style={{ fontSize: 'var(--fs-lg)', color: 'var(--c-purple-700)', marginBottom: '12px' }}>
            {t('caregiver.tipsTitle')}
          </h3>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: 'var(--fs-sm)' }}>
            <li style={{ display: 'flex', gap: '8px' }}>
              <span>💧</span>
              <span>{t('caregiver.tipHydration')}</span>
            </li>
            <li style={{ display: 'flex', gap: '8px' }}>
              <span>🌿</span>
              <span>{t('caregiver.tipGarden')}</span>
            </li>
            <li style={{ display: 'flex', gap: '8px' }}>
              <span>📞</span>
              <span>{t('caregiver.tipCall')}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Activity Timeline Table - DYNAMIC FROM ACTUAL GAMEPLAY */}
      <div className="card-elderly" style={{ border: '2px solid var(--border-color)', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: 'var(--fs-xl)', color: 'var(--text-main)', margin: 0 }}>
            {t('caregiver.timelineTitle')}
          </h3>
          <span style={{
            background: 'var(--c-purple-100)',
            color: 'var(--c-purple-700)',
            fontSize: 'var(--fs-xs)',
            fontWeight: '800',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)'
          }}>
            ⚡ Live Activity Tracking ({activities.length} Recorded)
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--fs-base)' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-sub)' }}>
                <th style={{ padding: '12px 14px' }}>{t('caregiver.timeCol')}</th>
                <th style={{ padding: '12px 14px' }}>{t('caregiver.activityCol')}</th>
                <th style={{ padding: '12px 14px' }}>{t('caregiver.focusCol')}</th>
                <th style={{ padding: '12px 14px' }}>{t('caregiver.accuracyCol')}</th>
                <th style={{ padding: '12px 14px' }}>{t('caregiver.moodCol')}</th>
              </tr>
            </thead>
            <tbody>
              {activities && activities.length > 0 ? (
                activities.slice(0, 10).map((act, idx) => (
                  <tr key={act.id || idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: '800' }}>{act.time}</div>
                      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-sub)' }}>{act.date}</div>
                    </td>
                    <td style={{ padding: '14px', fontWeight: '800' }}>
                      <div>{act.gameName}</div>
                      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', fontWeight: 'normal', marginTop: '2px' }}>
                        ⏱ {act.responseTime} • {act.attempts} {act.attempts === 1 ? 'attempt' : 'attempts'} • {act.difficulty}
                      </div>
                    </td>
                    <td style={{ padding: '14px', color: 'var(--text-main)' }}>{act.cognitiveFocus}</td>
                    <td style={{ padding: '14px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontWeight: '800',
                        fontSize: 'var(--fs-sm)',
                        display: 'inline-block',
                        background: act.accuracy >= 90 ? 'var(--c-mint-100)' : act.accuracy >= 75 ? 'var(--c-yellow-100)' : 'var(--c-peach-100)',
                        color: act.accuracy >= 90 ? 'var(--c-mint-600)' : act.accuracy >= 75 ? 'var(--c-yellow-700)' : 'var(--c-peach-600)'
                      }}>
                        {act.accuracy}%
                      </span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: 'var(--fs-sm)',
                        background: 'var(--bg-main)',
                        border: '1px solid var(--border-color)',
                        display: 'inline-block'
                      }}>
                        {act.mood || act.performance || '😊 Calm & Focused'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No game activity logged yet. Play cognitive games or daily recall to see live timeline data!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clinical Summary Report Modal */}
      {showDoctorReportModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 250,
          padding: '20px'
        }}>
          <div 
            className="card-elderly"
            style={{
              maxWidth: '720px',
              width: '100%',
              background: '#FFFFFF',
              color: '#0F172A',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #E2E8F0', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: 'var(--fs-2xl)', color: '#1E293B' }}>
                  {t('caregiver.reportModalTitle')}
                </h2>
                <span style={{ fontSize: 'var(--fs-sm)', color: '#64748B' }}>
                  {t('caregiver.reportModalSub')}
                </span>
              </div>
              <button
                className="btn-elderly btn-secondary"
                onClick={() => setShowDoctorReportModal(false)}
                style={{ minHeight: '40px', padding: '6px 14px' }}
              >
                ✕ {t('app.close')}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: 'var(--fs-base)' }}>
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px' }}>
                <p><strong>Patient Name:</strong> {profile.name} (Age: {profile.age}, {profile.gender})</p>
                <p><strong>Primary Caregiver:</strong> {profile.caregiver.name} ({profile.caregiver.phone})</p>
                <p><strong>Assessment Period:</strong> Last 30 Days Activity Log</p>
                <p><strong>Current Supportive Condition:</strong> {profile.condition}</p>
              </div>

              <div>
                <h4 style={{ fontSize: 'var(--fs-lg)', color: '#334155', marginBottom: '6px' }}>
                  {t('caregiver.reportKeyMetrics')}
                </h4>
                <ul style={{ paddingLeft: '20px', lineHeight: 1.6 }}>
                  <li>{t('caregiver.reportMemoryScore')} <strong>{metrics.memoryScore}%</strong> (Overall: <strong>{cognitiveScore}/100</strong>)</li>
                  <li>{t('caregiver.reportFaceAccuracy')} <strong>{caregiverSummary.familyAccuracy}%</strong></li>
                  <li>{t('caregiver.reportObjectAccuracy')} <strong>{metrics.recallAccuracy}%</strong></li>
                  <li>{t('caregiver.reportPacing')} <strong>{metrics.responseTimeSec}s</strong></li>
                  <li>{t('caregiver.reportStreak', { streak: profile.streak })} • <strong>{metrics.totalSessions} sessions logged</strong></li>
                </ul>
              </div>

              <div style={{
                background: '#FEF3C7',
                border: '1px solid #F59E0B',
                borderRadius: '8px',
                padding: '12px',
                fontSize: 'var(--fs-sm)',
                color: '#92400E'
              }}>
                <strong>Clinical Note:</strong> {t('caregiver.reportClinicalNote')}
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '14px' }}>
                <button
                  className="btn-elderly btn-secondary"
                  onClick={handlePrintReport}
                  style={{ minHeight: '46px', fontSize: 'var(--fs-base)' }}
                >
                  <Printer size={20} />
                  <span>{t('caregiver.printPdf')}</span>
                </button>
                <button
                  className="btn-elderly btn-primary-blue"
                  onClick={() => setShowDoctorReportModal(false)}
                  style={{ minHeight: '46px', fontSize: 'var(--fs-base)' }}
                >
                  <span>{t('caregiver.done')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
