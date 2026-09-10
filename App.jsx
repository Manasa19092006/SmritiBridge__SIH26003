import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { CelebrationModal } from './components/CelebrationModal';
import { LanguageToast } from './components/LanguageToast';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ActivityProvider, useActivity } from './context/ActivityContext';

import { AuthView } from './views/AuthView';
import { ProfileView } from './views/ProfileView';
import { DashboardView } from './views/DashboardView';
import { GamesHubView } from './views/GamesHubView';
import { DailyRecallView } from './views/DailyRecallView';
import { AnalyticsView } from './views/AnalyticsView';
import { ResultView } from './views/ResultView';
import { CaregiverView } from './views/CaregiverView';
import { AchievementsView } from './views/AchievementsView';

import { seniorProfiles } from './data/demoData';
import { soundService } from './services/soundService';
import { speechService } from './services/speechService';

function AppContent() {
  const { t, currentLang, setRole, setLanguage } = useLanguage();
  const { setProfileId } = useActivity();

  // Navigation & View States
  const [currentView, setCurrentView] = useState('auth'); // 'auth' | 'dashboard' | 'games' | 'recall' | 'assistant' | 'analytics' | 'results' | 'caregiver' | 'achievements' | 'profile'
  const [gamesSubTarget, setGamesSubTarget] = useState('hub');
  const [currentProfile, setCurrentProfile] = useState(seniorProfiles[0]);

  // Accessibility & Visual Preferences
  const [theme, setTheme] = useState('light');
  const [fontSizeLevel, setFontSizeLevel] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Celebration Modal state
  const [celebration, setCelebration] = useState({
    isOpen: false,
    title: '',
    message: '',
    stars: 3,
    coins: 50
  });

  // Apply theme & font scale to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontSizeLevel);
  }, [fontSizeLevel]);

  useEffect(() => {
    if (reduceMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
  }, [reduceMotion]);

  const toggleTheme = () => {
    soundService.playBubblePop();
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const cycleFontSize = (level) => {
    soundService.playBubblePop();
    setFontSizeLevel(level);
  };

  const toggleMute = () => {
    const muted = soundService.toggleMute();
    setIsMuted(muted);
  };

  const toggleReduceMotion = () => {
    soundService.playBubblePop();
    setReduceMotion(prev => !prev);
  };

  const handleSelectProfile = (profile) => {
    setCurrentProfile(profile);
    setProfileId(profile.id);
    setRole('senior');
    if (profile.preferredLanguage) {
      setLanguage(profile.preferredLanguage, 'senior');
    }
    setCurrentView('dashboard');
  };

  const handleEnterCaregiver = () => {
    setRole('caregiver');
    setCurrentView('caregiver');
  };

  const handleExitCaregiver = () => {
    setRole('senior');
    setCurrentView('dashboard');
  };

  const handleNavigate = (view, subtarget = 'hub') => {
    soundService.playBubblePop();
    if (view === 'caregiver') {
      setRole('caregiver');
    } else if (currentView === 'caregiver') {
      setRole('senior');
    }
    if (view === 'games' && subtarget) {
      setGamesSubTarget(subtarget);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRewardEarned = (rewardData) => {
    setCurrentProfile(prev => ({
      ...prev,
      coins: prev.coins + (rewardData.coins || 40),
      stars: prev.stars + (rewardData.stars || 3)
    }));

    setCelebration({
      isOpen: true,
      title: rewardData.title,
      message: rewardData.message,
      stars: rewardData.stars || 3,
      coins: rewardData.coins || 40
    });
  };

  // Text-To-Speech Read Current Page Aloud in active language
  const handleReadPageAloud = () => {
    if (isSpeaking) {
      speechService.stop();
      setIsSpeaking(false);
      return;
    }

    soundService.playBubblePop();
    setIsSpeaking(true);

    let speechScript = '';
    switch (currentView) {
      case 'auth':
        speechScript = `${t('auth.welcomeTitle')} ${t('auth.welcomeSub')}.`;
        break;
      case 'dashboard':
        speechScript = `${t('dashboard.greeting', { name: currentProfile.honorific || currentProfile.name })}. ${t('dashboard.scoreLabel')}: ${currentProfile.todayScore}.`;
        break;
      case 'games':
        speechScript = `${t('games.hubTitle')}. ${t('games.hubSubtitle')}. ${t('games.gentlePace')}.`;
        break;
      case 'recall':
      case 'assistant':
        speechScript = `${t('dailyRecall.title', { name: currentProfile.name })}. ${t('dailyRecall.subtitle')}.`;
        break;
      case 'analytics':
        speechScript = `${t('analytics.title')}. ${t('analytics.subtitle', { name: currentProfile.name })}.`;
        break;
      case 'results':
        speechScript = `${t('results.title')}. ${t('results.goodHeading')}.`;
        break;
      case 'caregiver':
        speechScript = `${t('caregiver.title', { name: currentProfile.name })}. ${t('caregiver.safeBannerTitle')}.`;
        break;
      case 'achievements':
        speechScript = `${t('achievements.title', { name: currentProfile.name })}. ${t('achievements.subtitle')}.`;
        break;
      case 'profile':
        speechScript = `${t('profile.title', { name: currentProfile.name })}.`;
        break;
      default:
        speechScript = `${t('app.name')} - ${t('app.tagline')}`;
    }

    speechService.speak(speechScript, currentLang, {
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  return (
    <div className="app-container">
      {/* Dynamic Animated Language Toast */}
      <LanguageToast />

      {/* Top Navbar Header */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        fontSizeLevel={fontSizeLevel}
        cycleFontSize={cycleFontSize}
        isMuted={isMuted}
        toggleMute={toggleMute}
        reduceMotion={reduceMotion}
        toggleReduceMotion={toggleReduceMotion}
        isCaregiverMode={currentView === 'caregiver'}
        setCaregiverMode={(isCaregiver) => {
          if (isCaregiver) {
            handleEnterCaregiver();
          } else {
            handleExitCaregiver();
          }
        }}
        onReadPageAloud={handleReadPageAloud}
        isSpeaking={isSpeaking}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '16px 8px' }}>
        {currentView === 'auth' && (
          <AuthView
            onSelectProfile={handleSelectProfile}
            onEnterCaregiver={handleEnterCaregiver}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            profile={currentProfile}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'games' && (
          <GamesHubView
            profile={currentProfile}
            initialGame={gamesSubTarget}
            onBackToDashboard={() => handleNavigate('dashboard')}
            onRewardEarned={handleRewardEarned}
          />
        )}

        {(currentView === 'recall' || currentView === 'assistant') && (
          <DailyRecallView
            profile={currentProfile}
            onRewardEarned={handleRewardEarned}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsView
            profile={currentProfile}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'results' && (
          <ResultView
            profile={currentProfile}
            onContinue={() => handleNavigate('games')}
          />
        )}

        {currentView === 'caregiver' && (
          <CaregiverView
            profile={currentProfile}
            onExitCaregiver={handleExitCaregiver}
          />
        )}

        {currentView === 'achievements' && (
          <AchievementsView
            profile={currentProfile}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView
            profile={currentProfile}
            onUpdateProfile={setCurrentProfile}
            fontSizeLevel={fontSizeLevel}
            cycleFontSize={cycleFontSize}
            theme={theme}
            toggleTheme={toggleTheme}
            reduceMotion={reduceMotion}
            toggleReduceMotion={toggleReduceMotion}
          />
        )}
      </main>

      {/* Bottom Navigation for Seniors (shown on all authenticated screens) */}
      {currentView !== 'auth' && (
        <BottomNav
          activeTab={
            currentView === 'games' ? 'games' :
            currentView === 'recall' ? 'recall' :
            currentView === 'assistant' ? 'assistant' :
            currentView === 'caregiver' ? 'caregiver' :
            currentView === 'achievements' ? 'achievements' :
            currentView === 'profile' ? 'profile' : 'dashboard'
          }
          setActiveTab={(tab) => handleNavigate(tab)}
        />
      )}

      {/* Celebration Fanfare & Confetti Modal */}
      <CelebrationModal
        isOpen={celebration.isOpen}
        title={celebration.title}
        message={celebration.message}
        starsEarned={celebration.stars}
        coinsEarned={celebration.coins}
        onClose={() => setCelebration(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <ActivityProvider>
        <AppContent />
      </ActivityProvider>
    </LanguageProvider>
  );
}

export default App;
