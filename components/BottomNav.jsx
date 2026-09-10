import React from 'react';
import { Home, Gamepad2, Calendar, Mic, ShieldAlert, Award, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { soundService } from '../services/soundService';

export function BottomNav({ activeTab, setActiveTab }) {
  const { t } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: t('nav.home'), icon: Home, color: 'var(--c-blue-500)' },
    { id: 'games', label: t('nav.games'), icon: Gamepad2, color: 'var(--c-purple-500)' },
    { id: 'recall', label: t('nav.recall'), icon: Calendar, color: 'var(--c-mint-500)' },
    { id: 'assistant', label: t('nav.assistant'), icon: Mic, color: 'var(--c-coral-500)' },
    { id: 'caregiver', label: t('nav.caregiver'), icon: ShieldAlert, color: 'var(--c-yellow-500)' },
    { id: 'achievements', label: t('nav.achievements'), icon: Award, color: 'var(--c-peach-500)' },
    { id: 'profile', label: t('nav.profile'), icon: User, color: 'var(--c-blue-600)' }
  ];

  return (
    <nav className="bottom-nav-bar" role="navigation" aria-label="Main Navigation">
      <div className="bottom-nav-inner">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                soundService.playBubblePop();
                setActiveTab(item.id);
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="bottom-nav-icon-wrapper">
                <Icon size={26} strokeWidth={isActive ? 2.6 : 2} color={isActive ? item.color : 'currentColor'} />
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
