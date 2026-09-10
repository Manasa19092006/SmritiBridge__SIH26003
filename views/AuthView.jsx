import React, { useState } from 'react';
import { 
  Heart, Star, Volume2, Shield, Sparkles, 
  ArrowRight, Phone, Mail, UserCheck, Smile
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { soundService } from '../services/soundService';
import { speechService } from '../services/speechService';
import { seniorProfiles } from '../data/demoData';

export function AuthView({ 
  onSelectProfile, 
  onEnterCaregiver 
}) {
  const { t, lang, setRole } = useLanguage();
  const [authMode, setAuthMode] = useState('senior'); // 'senior' or 'caregiver'
  const [authMethod, setAuthMethod] = useState('quick'); // 'quick' or 'phone' or 'email'
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [customName, setCustomName] = useState('');

  const handleVoiceWelcome = () => {
    soundService.playBubblePop();
    speechService.speak(
      `${t('auth.welcomeTitle')} ${t('auth.welcomeSubtitle')}`,
      lang
    );
  };

  const handleProfileSelect = (profile) => {
    setRole('senior');
    soundService.playBubblePop();
    soundService.playChime();
    onSelectProfile(profile);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    setRole('senior');
    soundService.playChime();
    const newProfile = {
      ...seniorProfiles[0],
      name: customName || 'Senior Loved One',
      honorific: `${customName || 'Senior'} ji`,
      age: 70
    };
    onSelectProfile(newProfile);
  };

  const handleCaregiverAccess = () => {
    setRole('caregiver');
    soundService.playChime();
    onEnterCaregiver();
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative'
    }}>
      {/* Floating background celebratory particles */}
      <div className="floating-bg-particle" style={{ top: '10%', left: '8%', fontSize: '2.5rem' }}>💖</div>
      <div className="floating-bg-particle" style={{ top: '25%', right: '10%', fontSize: '3rem', animationDelay: '2s' }}>⭐</div>
      <div className="floating-bg-particle" style={{ bottom: '20%', left: '12%', fontSize: '2.8rem', animationDelay: '4s' }}>☕</div>
      <div className="floating-bg-particle" style={{ bottom: '15%', right: '12%', fontSize: '2.5rem', animationDelay: '1s' }}>🌸</div>
      <div className="floating-bg-particle" style={{ top: '55%', left: '4%', fontSize: '2rem', animationDelay: '3s' }}>📻</div>

      <div style={{ maxWidth: '840px', width: '100%', margin: '0 auto' }}>
        {/* Top welcoming illustration card */}
        <div 
          className="card-elderly"
          style={{
            textAlign: 'center',
            marginBottom: '28px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(237, 233, 254, 0.7))',
            border: '3px solid var(--c-purple-300)'
          }}
        >
          {/* Friendly Illustration of Elder and Caregiver */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--c-peach-100), var(--c-yellow-100))',
              border: '4px solid #FFFFFF',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3.6rem'
            }}>
              👴🏽
            </div>
            <div style={{
              fontSize: '2rem',
              color: 'var(--c-coral-500)',
              animation: 'pulse-ring 2s infinite',
              borderRadius: '50%',
              padding: '6px'
            }}>
              ❤️
            </div>
            <div style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--c-blue-100), var(--c-purple-100))',
              border: '4px solid #FFFFFF',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3.6rem'
            }}>
              👩🏽‍⚕️
            </div>
          </div>

          <h1 style={{ 
            fontSize: 'var(--fs-3xl)', 
            marginBottom: '12px',
            background: 'linear-gradient(135deg, var(--c-purple-700), var(--c-blue-600))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {t('auth.welcomeTitle')}
          </h1>

          <p style={{ 
            fontSize: 'var(--fs-lg)', 
            color: 'var(--text-muted)', 
            maxWidth: '650px', 
            margin: '0 auto 20px',
            lineHeight: 1.5
          }}>
            {t('auth.welcomeSubtitle')}
          </p>

          {/* Voice Assistance Button */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <button
              className="btn-elderly btn-secondary"
              onClick={handleVoiceWelcome}
              style={{ minHeight: '50px', fontSize: 'var(--fs-base)', borderRadius: 'var(--radius-full)' }}
            >
              <Volume2 size={24} color="var(--c-blue-600)" />
              <span>{t('app.tapToListen')}</span>
            </button>
          </div>

          {/* Prominent Global Language Selector on Landing Page */}
          <div style={{
            background: 'var(--bg-card)',
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            border: '2px dashed var(--c-purple-300)',
            marginTop: '8px'
          }}>
            <LanguageSelector variant="cards" />
          </div>
        </div>

        {/* Mode Selector Tabs: Senior Mode vs Caregiver Mode */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <button
            className={`btn-elderly ${authMode === 'senior' ? 'btn-primary-purple' : 'btn-secondary'}`}
            onClick={() => {
              soundService.playBubblePop();
              setAuthMode('senior');
              setRole('senior');
            }}
            style={{ flex: 1, maxWidth: '280px' }}
          >
            <Smile size={24} />
            <span>{t('auth.roleSenior')}</span>
          </button>

          <button
            className={`btn-elderly ${authMode === 'caregiver' ? 'btn-primary-blue' : 'btn-secondary'}`}
            onClick={() => {
              soundService.playBubblePop();
              setAuthMode('caregiver');
              setRole('caregiver');
            }}
            style={{ flex: 1, maxWidth: '280px' }}
          >
            <Shield size={24} />
            <span>{t('auth.roleCaregiver')}</span>
          </button>
        </div>

        {/* Senior Authentication & Quick 1-Tap Profiles */}
        {authMode === 'senior' ? (
          <div className="card-elderly" style={{ border: '2px solid var(--c-purple-300)' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: 'var(--fs-2xl)', color: 'var(--c-purple-700)', marginBottom: '6px' }}>
                {t('auth.seniorLoginTitle')}
              </h2>
              <p style={{ fontSize: 'var(--fs-base)', color: 'var(--text-muted)' }}>
                {t('auth.seniorLoginSubtitle')}
              </p>
            </div>

            {/* 1-Tap Senior Profile Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '18px',
              marginBottom: '24px'
            }}>
              {seniorProfiles.map((prof) => (
                <div
                  key={prof.id}
                  className="card-elderly card-interactive"
                  onClick={() => handleProfileSelect(prof)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '24px',
                    border: '3px solid var(--c-purple-300)',
                    background: prof.id === 'ramesh' 
                      ? 'linear-gradient(135deg, #FFFFFF, var(--c-blue-50))' 
                      : 'linear-gradient(135deg, #FFFFFF, var(--c-peach-50))'
                  }}
                >
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: '3px solid var(--c-purple-400)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    marginBottom: '12px',
                    boxShadow: 'var(--shadow-md)'
                  }}>
                    {prof.avatarEmoji}
                  </div>

                  <h3 style={{ fontSize: 'var(--fs-xl)', color: 'var(--text-main)', marginBottom: '4px' }}>
                    {prof.name}
                  </h3>

                  <div style={{ 
                    fontSize: 'var(--fs-sm)', 
                    color: 'var(--c-purple-600)', 
                    fontWeight: '800',
                    marginBottom: '8px' 
                  }}>
                    {t('auth.ageLabel')} {prof.age} • {prof.condition}
                  </div>

                  <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    {prof.caregiver.name}
                  </p>

                  <button 
                    className="btn-elderly btn-primary-purple"
                    style={{ width: '100%', minHeight: '52px', fontSize: 'var(--fs-base)' }}
                  >
                    <span>{t('auth.startPlaying')}</span>
                    <ArrowRight size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Custom Senior Login / Registration Form */}
            <details style={{
              background: 'var(--bg-card-subtle)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--border-color)',
              cursor: 'pointer'
            }}>
              <summary style={{ fontWeight: '800', fontSize: 'var(--fs-base)', color: 'var(--c-blue-600)' }}>
                ➕ {t('auth.newPatientToggle')}
              </summary>
              <form onSubmit={handleCustomSubmit} style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', marginBottom: '6px', fontSize: 'var(--fs-base)' }}>
                    {t('auth.newPatientName')}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Uncle / Savitri Amma"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--border-color)',
                      fontSize: 'var(--fs-base)'
                    }}
                  />
                </div>
                <button type="submit" className="btn-elderly btn-primary-mint" style={{ alignSelf: 'flex-start' }}>
                  <UserCheck size={22} />
                  <span>{t('auth.createProfileBtn')}</span>
                </button>
              </form>
            </details>
          </div>
        ) : (
          /* Caregiver Authentication */
          <div className="card-elderly" style={{ border: '2px solid var(--c-blue-300)' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: 'var(--fs-2xl)', color: 'var(--c-blue-700)', marginBottom: '6px' }}>
                {t('auth.caregiverLoginTitle')}
              </h2>
              <p style={{ fontSize: 'var(--fs-base)', color: 'var(--text-muted)' }}>
                {t('auth.caregiverLoginSubtitle')}
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap'
            }}>
              <button
                className={`btn-elderly ${authMethod === 'quick' ? 'btn-primary-blue' : 'btn-secondary'}`}
                onClick={() => setAuthMethod('quick')}
                style={{ padding: '10px 18px', minHeight: '44px', fontSize: 'var(--fs-base)' }}
              >
                <Sparkles size={18} />
                <span>{t('auth.instantAccess')}</span>
              </button>
              <button
                className={`btn-elderly ${authMethod === 'phone' ? 'btn-primary-blue' : 'btn-secondary'}`}
                onClick={() => setAuthMethod('phone')}
                style={{ padding: '10px 18px', minHeight: '44px', fontSize: 'var(--fs-base)' }}
              >
                <Phone size={18} />
                <span>{t('auth.mobileOtp')}</span>
              </button>
              <button
                className={`btn-elderly ${authMethod === 'email' ? 'btn-primary-blue' : 'btn-secondary'}`}
                onClick={() => setAuthMethod('email')}
                style={{ padding: '10px 18px', minHeight: '44px', fontSize: 'var(--fs-base)' }}
              >
                <Mail size={18} />
                <span>{t('auth.emailSignIn')}</span>
              </button>
            </div>

            {authMethod === 'quick' && (
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <p style={{ fontSize: 'var(--fs-base)', marginBottom: '16px' }}>
                  {t('auth.signInAs')} <strong>{t('auth.caregiverName')}</strong>:
                </p>
                <button
                  className="btn-elderly btn-primary-blue"
                  onClick={handleCaregiverAccess}
                  style={{ minWidth: '280px' }}
                >
                  <Shield size={22} />
                  <span>{t('auth.openCaregiverPortal')}</span>
                </button>
              </div>
            )}

            {authMethod === 'phone' && (
              <div style={{ maxWidth: '380px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <label style={{ fontWeight: '700', fontSize: 'var(--fs-base)' }}>{t('auth.enterMobile')}</label>
                <input
                  type="tel"
                  placeholder="+91 98401 23456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--border-color)',
                    fontSize: 'var(--fs-lg)'
                  }}
                />
                <button
                  className="btn-elderly btn-primary-blue"
                  onClick={handleCaregiverAccess}
                >
                  <span>{t('auth.sendOtp')}</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            )}

            {authMethod === 'email' && (
              <div style={{ maxWidth: '380px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <label style={{ fontWeight: '700', fontSize: 'var(--fs-base)' }}>{t('auth.enterEmail')}</label>
                <input
                  type="email"
                  placeholder="caregiver@family.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--border-color)',
                    fontSize: 'var(--fs-lg)'
                  }}
                />
                <button
                  className="btn-elderly btn-primary-blue"
                  onClick={handleCaregiverAccess}
                >
                  <span>{t('auth.continueToPortal')}</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
