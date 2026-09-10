import React from 'react';
import { Globe, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function LanguageToast() {
  const { toastMessage, clearToast } = useLanguage();

  if (!toastMessage) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      background: 'linear-gradient(135deg, var(--c-purple-600), var(--c-blue-600))',
      color: '#FFFFFF',
      padding: '12px 24px',
      borderRadius: 'var(--radius-full)',
      boxShadow: '0 12px 30px rgba(59, 130, 246, 0.4)',
      border: '2px solid rgba(255, 255, 255, 0.35)',
      fontSize: 'var(--fs-base)',
      fontWeight: '800',
      animation: 'character-bob 0.5s ease-out'
    }}>
      <Globe size={22} className="spin-slow" />
      <span>{toastMessage}</span>
      <button 
        onClick={clearToast}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#FFFFFF',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center'
        }}
        aria-label="Close notification"
      >
        <X size={18} />
      </button>
    </div>
  );
}
