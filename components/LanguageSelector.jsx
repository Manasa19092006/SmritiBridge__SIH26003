import React, { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function LanguageSelector({ 
  variant = 'pills', // 'pills' | 'cards' | 'dropdown' | 'compact'
  title = null,
  forRole = null,
  className = ''
}) {
  const { lang, seniorLang, caregiverLang, setLanguage, languages, t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const effectiveLang = forRole === 'caregiver' ? caregiverLang : forRole === 'senior' ? seniorLang : lang;

  // Variant 1: Cards (Large, touch-friendly, ideal for Landing / Login / Prominent banners)
  if (variant === 'cards') {
    return (
      <div className={`lang-selector-cards-container ${className}`} style={{ width: '100%' }}>
        {title !== false && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Globe size={22} color="var(--c-purple-600)" />
            <h3 style={{ fontSize: 'var(--fs-lg)', color: 'var(--text-main)', margin: 0 }}>
              {title || t('settings.languageTitle')}
            </h3>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '10px'
        }}>
          {languages.map((l) => {
            const isSelected = effectiveLang === l.code;
            return (
              <button
                key={l.code}
                type="button"
                className="btn-elderly"
                onClick={() => setLanguage(l.code, forRole)}
                style={{
                  padding: '12px 14px',
                  minHeight: '62px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  background: isSelected 
                    ? 'linear-gradient(135deg, var(--c-purple-600), var(--c-blue-600))' 
                    : 'var(--bg-card)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-main)',
                  border: `3px solid ${isSelected ? 'var(--c-purple-400)' : 'var(--border-color)'}`,
                  boxShadow: isSelected ? 'var(--shadow-glow-purple)' : 'var(--shadow-sm)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all 0.25s ease'
                }}
                aria-pressed={isSelected}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{l.flag}</span>
                  <span style={{ fontSize: 'var(--fs-base)', fontWeight: '900' }}>
                    {l.native}
                  </span>
                  {isSelected && <Check size={16} />}
                </div>
                <span style={{ fontSize: 'var(--fs-xs)', opacity: isSelected ? 0.9 : 0.7 }}>
                  {l.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Variant 2: Pills (Great for Senior Dashboard, Profile & Settings tabs)
  if (variant === 'pills') {
    return (
      <div className={`lang-selector-pills-container ${className}`} style={{ width: '100%' }}>
        {title !== false && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Globe size={20} color="var(--c-blue-600)" />
            <span style={{ fontWeight: '800', fontSize: 'var(--fs-base)', color: 'var(--text-main)' }}>
              {title || '🌐 ' + t('settings.languageTitle')}
            </span>
          </div>
        )}

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          {languages.map((l) => {
            const isSelected = effectiveLang === l.code;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code, forRole)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  minHeight: '48px',
                  borderRadius: 'var(--radius-full)',
                  background: isSelected ? 'var(--c-purple-600)' : 'var(--bg-card)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-main)',
                  border: `2px solid ${isSelected ? 'var(--c-purple-500)' : 'var(--border-color)'}`,
                  boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                  fontWeight: isSelected ? '900' : '700',
                  fontSize: 'var(--fs-base)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                aria-pressed={isSelected}
              >
                <span>{l.flag}</span>
                <span>{l.native}</span>
                <span style={{ fontSize: 'var(--fs-xs)', opacity: 0.75 }}>({l.name})</span>
                {isSelected && <Check size={16} />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Variant 3: Dropdown (Navbar or compact header)
  return (
    <div style={{ position: 'relative' }} className={className}>
      <button 
        type="button"
        className="lang-selector-btn"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
        aria-label="Select global language"
        style={{ minHeight: '46px', padding: '8px 16px', borderRadius: 'var(--radius-lg)' }}
      >
        <Globe size={20} color="var(--c-blue-600)" />
        <span>{languages.find(l => l.code === effectiveLang)?.native || 'Language'}</span>
      </button>

      {dropdownOpen && (
        <div style={{
          position: 'absolute',
          top: '110%',
          right: 0,
          background: 'var(--bg-card)',
          border: '2px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 150,
          minWidth: '220px',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          {languages.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLanguage(l.code, forRole);
                setDropdownOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: effectiveLang === l.code ? 'var(--c-blue-100)' : 'transparent',
                color: effectiveLang === l.code ? 'var(--c-blue-700)' : 'var(--text-main)',
                fontWeight: effectiveLang === l.code ? '800' : '600',
                fontSize: 'var(--fs-base)',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span>{l.flag} {l.name}</span>
              <span style={{ opacity: 0.8, fontSize: 'var(--fs-sm)' }}>{l.native}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
