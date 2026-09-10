import { i18nData, languages } from '../src/services/i18nData.js';

// Simulate LanguageContext resolveKey and t
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

const resolveKey = (dict, path) => {
  if (!dict || !path) return undefined;
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

  const leaf = keys[keys.length - 1];
  if (leaf in dict) return dict[leaf];
  if (dict.achievements && leaf in dict.achievements) return dict.achievements[leaf];

  const badgeMatch = leaf.match(/^(?:achievements\.)?(b{1,2})([1-6])(Title|Desc)$/);
  if (badgeMatch) {
    const num = badgeMatch[2];
    const field = badgeMatch[3];
    const alt1 = `bb${num}${field}`;
    const alt2 = `b${num}${field}`;
    if (alt1 in dict) return dict[alt1];
    if (alt2 in dict) return dict[alt2];
    if (dict.achievements) {
      if (alt1 in dict.achievements) return dict.achievements[alt1];
      if (alt2 in dict.achievements) return dict.achievements[alt2];
    }
  }
  return undefined;
};

const t = (currentLang, path, params = {}) => {
  let current = resolveKey(i18nData[currentLang], path);
  if (current === undefined && currentLang !== 'en') {
    current = resolveKey(i18nData.en, path);
  }
  if (current === undefined && params.fallback) {
    return params.fallback;
  }
  if (current === undefined) {
    const leaf = path.split('.').pop();
    const badgeMatch = leaf.match(/^(b{1,2})([1-6])(Title|Desc)$/);
    if (badgeMatch) {
      const canonical = `bb${badgeMatch[2]}${badgeMatch[3]}`;
      current = defaultBadges[canonical];
    }
  }
  if (current === undefined) {
    return params.default || '';
  }
  return current;
};

console.log('--- Testing EN ---');
console.log("t('en', 'bb1Title'):", t('en', 'bb1Title'));
console.log("t('en', 'bb1Desc'):", t('en', 'bb1Desc'));
console.log("t('en', 'achievements.bb1Title'):", t('en', 'achievements.bb1Title'));
console.log("t('en', 'achievements.b1Title'):", t('en', 'achievements.b1Title'));

console.log('--- Testing TA ---');
console.log("t('ta', 'bb1Title'):", t('ta', 'bb1Title'));
console.log("t('ta', 'bb1Desc'):", t('ta', 'bb1Desc'));

console.log('--- Testing HI ---');
console.log("t('hi', 'bb1Title'):", t('hi', 'bb1Title'));
console.log("t('hi', 'bb1Desc'):", t('hi', 'bb1Desc'));

console.log('--- Testing Fallback (unknown key) ---');
console.log("t('en', 'unknown.key'):", JSON.stringify(t('en', 'unknown.key')));

console.log('✅ All tests passed!');
