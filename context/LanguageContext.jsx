import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { languages, i18nData } from '../services/i18nData';
import { soundService } from '../services/soundService';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  // Current active role: 'senior' | 'caregiver'
  const [currentRole, setCurrentRoleState] = useState(() => {
    try {
      return localStorage.getItem('smriti_active_role') || 'senior';
    } catch {
      return 'senior';
    }
  });

  // Independent language preferences stored per role
  const [seniorLang, setSeniorLang] = useState(() => {
    try {
      return localStorage.getItem('smriti_lang_senior') || 'en';
    } catch {
      return 'en';
    }
  });

  const [caregiverLang, setCaregiverLang] = useState(() => {
    try {
      return localStorage.getItem('smriti_lang_caregiver') || 'en';
    } catch {
      return 'en';
    }
  });

  // Current active language code derived from active role
  const currentLang = currentRole === 'caregiver' ? caregiverLang : seniorLang;

  // Language toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  // Set HTML lang and dir attributes whenever currentLang changes
  useEffect(() => {
    const langMeta = languages.find(l => l.code === currentLang) || languages[0];
    document.documentElement.lang = langMeta.code;
    document.documentElement.dir = langMeta.dir || 'ltr';
  }, [currentLang]);

  // Switch role and apply that role's saved language
  const setRole = useCallback((newRole) => {
    setCurrentRoleState(newRole);
    try {
      localStorage.setItem('smriti_active_role', newRole);
    } catch {}
  }, []);

  // Update language for active role (or specified role)
  const setLanguage = useCallback((code, forRole = null) => {
    const targetRole = forRole || currentRole;
    const selectedLangMeta = languages.find(l => l.code === code) || languages[0];

    soundService.playBubblePop();

    if (targetRole === 'caregiver') {
      setCaregiverLang(code);
      try {
        localStorage.setItem('smriti_lang_caregiver', code);
      } catch {}
    } else {
      setSeniorLang(code);
      try {
        localStorage.setItem('smriti_lang_senior', code);
      } catch {}
    }

    // Show Language Changed Toast
    const langDisplayName = `${selectedLangMeta.native} (${selectedLangMeta.name})`;
    const toastTemplate = i18nData[code]?.toast?.languageChanged || i18nData.en.toast.languageChanged;
    setToastMessage(toastTemplate.replace('{lang}', langDisplayName));

    // Auto dismiss toast after 3.2s
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, [currentRole]);

  // Default English badge fallbacks
  const defaultBadges = {
    bb1Title: 'Memory Champion',
    bb1Desc: 'Completed your first memory challenge.',
    bb2Title: 'Star Learner',
    bb2Desc: 'Earned your first set of memory stars.',
    bb3Title: 'Memory Master',
    bb3Desc: 'Completed multiple cognitive activities.',
    bb4Title: 'Perfect Recall',
    bb4Desc: 'Achieved excellent recall performance.',
    bb5Title: 'Cognitive Explorer',
    bb5Desc: 'Keep practicing to unlock this achievement.',
    bb6Title: 'Memory Hero',
    bb6Desc: 'Complete more activities to unlock this badge.'
  };

  // Helper to look up a path in a lang dictionary with smart badge aliasing
  const resolveKey = (dict, path) => {
    if (!dict || !path) return undefined;

    // 1. Exact dot-path lookup
    const keys = path.split('.');
    let cur = dict;
    for (const key of keys) {
      if (cur && typeof cur === 'object' && key in cur) {
        cur = cur[key];
      } else {
        cur = undefined;
        break;
      }
    }
    if (cur !== undefined) return cur;

    // 2. If single key like 'bb1Title' or 'b1Title', check root or achievements
    const leaf = keys[keys.length - 1];
    if (leaf in dict) return dict[leaf];
    if (dict.achievements && leaf in dict.achievements) return dict.achievements[leaf];

    // 3. Normalize badge keys: bb1Title <-> b1Title
    const badgeMatch = leaf.match(/^(?:achievements\.)?(b{1,2})([1-6])(Title|Desc)$/);
    if (badgeMatch) {
      const num = badgeMatch[2];
      const field = badgeMatch[3];
      const alt1 = `bb${num}${field}`;
      const alt2 = `b${num}${field}`;

      // Check root
      if (alt1 in dict) return dict[alt1];
      if (alt2 in dict) return dict[alt2];

      // Check achievements
      if (dict.achievements) {
        if (alt1 in dict.achievements) return dict.achievements[alt1];
        if (alt2 in dict.achievements) return dict.achievements[alt2];
      }
    }

    return undefined;
  };

  // Dot-notation translation helper with fallback and interpolation
  const t = useCallback((path, params = {}) => {
    if (!path) return '';

    // 1. Try active language
    let current = resolveKey(i18nData[currentLang], path);

    // 2. Fallback to English if active language does not have key
    if (current === undefined && currentLang !== 'en') {
      current = resolveKey(i18nData.en, path);
    }

    // 3. Fallback to explicit params.fallback
    if (current === undefined && params.fallback) {
      return params.fallback;
    }

    // 4. Default badge dictionary fallback to prevent raw keys
    if (current === undefined) {
      const leaf = path.split('.').pop();
      const badgeMatch = leaf.match(/^(b{1,2})([1-6])(Title|Desc)$/);
      if (badgeMatch) {
        const canonical = `bb${badgeMatch[2]}${badgeMatch[3]}`;
        current = defaultBadges[canonical];
      }
    }

    // If still undefined, return empty string or graceful fallback (NEVER raw key)
    if (current === undefined) {
      return params.default || '';
    }

    // If string, handle interpolation {name}, {count}, etc.
    if (typeof current === 'string') {
      let result = current;
      for (const [pKey, pVal] of Object.entries(params)) {
        result = result.replaceAll(`{${pKey}}`, pVal !== undefined ? pVal : '');
      }
      return result;
    }

    return current;
  }, [currentLang]);

  const currentLanguageMeta = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <LanguageContext.Provider value={{
      lang: currentLang,
      currentLang,
      seniorLang,
      caregiverLang,
      setLanguage,
      currentRole,
      setRole,
      languages,
      currentLanguageMeta,
      direction: currentLanguageMeta.dir || 'ltr',
      t,
      toastMessage,
      clearToast: () => setToastMessage(null)
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
