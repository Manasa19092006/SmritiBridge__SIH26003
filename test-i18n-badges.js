import { i18nData, languages } from '../src/services/i18nData.js';

console.log('Testing i18n Badge keys across all languages...');

const langs = ['en', 'ta', 'hi', 'te', 'kn', 'ml', 'bn'];
let hasErrors = false;

for (const lang of langs) {
  const dict = i18nData[lang];
  if (!dict) {
    console.error(`Missing language: ${lang}`);
    hasErrors = true;
    continue;
  }
  
  for (let i = 1; i <= 6; i++) {
    const titleKey = `bb${i}Title`;
    const descKey = `bb${i}Desc`;
    const titleVal = dict.achievements?.[titleKey];
    const descVal = dict.achievements?.[descKey];

    if (!titleVal || titleVal === titleKey) {
      console.error(`[${lang}] Missing achievements.${titleKey}`);
      hasErrors = true;
    }
    if (!descVal || descVal === descKey) {
      console.error(`[${lang}] Missing achievements.${descKey}`);
      hasErrors = true;
    }
  }
}

if (!hasErrors) {
  console.log('✅ ALL 7 LANGUAGES have complete, valid translations for bb1Title through bb6Desc!');
  console.log('\nSample translations:');
  console.log('EN bb1Title:', i18nData.en.achievements.bb1Title);
  console.log('TA bb1Title:', i18nData.ta.achievements.bb1Title);
  console.log('HI bb1Title:', i18nData.hi.achievements.bb1Title);
  console.log('TE bb1Title:', i18nData.te.achievements.bb1Title);
  console.log('KN bb1Title:', i18nData.kn.achievements.bb1Title);
  console.log('ML bb1Title:', i18nData.ml.achievements.bb1Title);
  console.log('BN bb1Title:', i18nData.bn.achievements.bb1Title);
} else {
  process.exit(1);
}
