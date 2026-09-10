import React, { useState } from 'react';
import { 
  User, Heart, Volume2, Plus, Sparkles, MapPin, 
  Eye, Check, Edit2, Shield, Settings, Sliders, Globe
} from 'lucide-react';
import { soundService } from '../services/soundService';
import { speechService } from '../services/speechService';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';

export function ProfileView({ 
  profile, 
  onUpdateProfile, 
  fontSizeLevel, 
  cycleFontSize,
  theme,
  toggleTheme,
  reduceMotion,
  toggleReduceMotion
}) {
  const { t, currentLang } = useLanguage();
  const [activeTab, setActiveTab] = useState('people'); // 'people' | 'objects' | 'places' | 'settings'
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonRelation, setNewPersonRelation] = useState('');
  const [newPersonNote, setNewPersonNote] = useState('');

  const handleSpeakMemory = (text) => {
    soundService.playBubblePop();
    speechService.speak(text, currentLang);
  };

  const handleAddPerson = (e) => {
    e.preventDefault();
    if (!newPersonName) return;
    soundService.playChime();
    const updated = {
      ...profile,
      familiarPeople: [
        ...profile.familiarPeople,
        {
          id: `p-${Date.now()}`,
          name: newPersonName,
          relation: newPersonRelation || 'Family Member',
          emoji: '🥰',
          note: newPersonNote || 'A beloved family member.',
          voiceGreeting: `Namaste! I am ${newPersonName}.`,
          favoriteMemory: 'Sharing happy family dinners together.'
        }
      ]
    };
    onUpdateProfile(updated);
    setShowAddPersonModal(false);
    setNewPersonName('');
    setNewPersonRelation('');
    setNewPersonNote('');
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px' }}>
      {/* Top Profile Summary Card */}
      <div 
        className="card-elderly"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          marginBottom: '28px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), var(--c-purple-50))',
          border: '3px solid var(--c-purple-300)',
          flexWrap: 'wrap'
        }}
      >
        <div style={{
          width: '110px',
          height: '110px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--c-purple-100), var(--c-blue-100))',
          border: '4px solid #FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '4.5rem',
          boxShadow: 'var(--shadow-lg)',
          flexShrink: 0
        }}>
          {profile.avatarEmoji || '👴🏽'}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <h1 style={{ fontSize: 'var(--fs-2xl)', color: 'var(--text-main)' }}>
              {profile.name}
            </h1>
            <span style={{
              background: 'var(--c-purple-100)',
              color: 'var(--c-purple-700)',
              fontWeight: '800',
              padding: '4px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--fs-sm)'
            }}>
              Age {profile.age}
            </span>
            <span style={{
              background: 'var(--c-mint-100)',
              color: 'var(--c-mint-700)',
              fontWeight: '800',
              padding: '4px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--fs-sm)'
            }}>
              {profile.condition}
            </span>
          </div>

          <p style={{ fontSize: 'var(--fs-base)', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {t('profile.caregiverPrefix')} <strong>{profile.caregiver?.name || 'Kavitha'}</strong> ({profile.caregiver?.phone || '+91 98401 23456'})
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn-tts"
              onClick={() => handleSpeakMemory(`Here is the memory profile for ${profile.name}, age ${profile.age}. You have ${profile.familiarPeople.length} loving family members and ${profile.familiarObjects.length} familiar objects registered.`)}
              title={t('profile.audioSummary')}
            >
              <Volume2 size={22} />
            </button>
            <span style={{ fontSize: 'var(--fs-sm)', alignSelf: 'center', color: 'var(--text-sub)' }}>
              {t('profile.audioSummary')}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs: Familiar People | Familiar Objects | Favorite Places | Accessibility */}
      <div style={{
        display: 'flex',
        gap: '12px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '24px'
      }}>
        {[
          { id: 'people', label: t('profile.peopleTab', { count: profile.familiarPeople.length }), icon: Heart, color: 'var(--c-coral-500)' },
          { id: 'objects', label: t('profile.objectsTab', { count: profile.familiarObjects.length }), icon: Sparkles, color: 'var(--c-yellow-500)' },
          { id: 'places', label: t('profile.placesTab', { count: profile.favoritePlaces.length }), icon: MapPin, color: 'var(--c-mint-500)' },
          { id: 'settings', label: t('profile.settingsTab'), icon: Sliders, color: 'var(--c-purple-500)' }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`btn-elderly ${isActive ? 'btn-primary-purple' : 'btn-secondary'}`}
              onClick={() => {
                soundService.playBubblePop();
                setActiveTab(tab.id);
              }}
              style={{ minHeight: '52px', fontSize: 'var(--fs-base)', whiteSpace: 'nowrap' }}
            >
              <Icon size={20} color={isActive ? '#FFFFFF' : tab.color} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: FAMILIAR PEOPLE */}
      {activeTab === 'people' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: 'var(--fs-xl)', color: 'var(--c-coral-600)' }}>
                {t('profile.peopleTitle')}
              </h2>
              <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                {t('profile.peopleSub', { name: profile.honorific || profile.name })}
              </p>
            </div>

            <button
              className="btn-elderly btn-primary-coral"
              onClick={() => {
                soundService.playBubblePop();
                setShowAddPersonModal(true);
              }}
              style={{ minHeight: '48px', fontSize: 'var(--fs-base)' }}
            >
              <Plus size={20} />
              <span>{t('profile.addPersonBtn')}</span>
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {profile.familiarPeople.map(person => (
              <div 
                key={person.id}
                className="card-elderly"
                style={{
                  background: 'var(--bg-card)',
                  border: '2px solid var(--c-coral-200)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '50%',
                    background: 'var(--c-coral-50)',
                    border: '3px solid var(--c-coral-300)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.8rem',
                    flexShrink: 0
                  }}>
                    {person.emoji}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 'var(--fs-lg)', color: 'var(--text-main)', marginBottom: '2px' }}>
                      {person.name}
                    </h3>
                    <div style={{
                      display: 'inline-block',
                      background: 'var(--c-coral-100)',
                      color: 'var(--c-coral-700)',
                      padding: '2px 10px',
                      borderRadius: '12px',
                      fontWeight: '800',
                      fontSize: 'var(--fs-xs)'
                    }}>
                      {person.relation} {person.age ? `• Age ${person.age}` : ''}
                    </div>
                  </div>

                  <button
                    className="btn-tts"
                    onClick={() => handleSpeakMemory(`${person.name} is your ${person.relation}. ${person.note}`)}
                    title={`Hear details about ${person.name}`}
                  >
                    <Volume2 size={20} />
                  </button>
                </div>

                <p style={{ fontSize: 'var(--fs-base)', color: 'var(--text-muted)' }}>
                  {person.note}
                </p>

                {person.favoriteMemory && (
                  <div style={{
                    background: 'var(--c-yellow-50)',
                    border: '1px solid var(--c-yellow-400)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--fs-sm)',
                    color: 'var(--c-yellow-700)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}>
                    <span>🌟</span>
                    <span><strong>{t('profile.sweetMemory')}</strong> {person.favoriteMemory}</span>
                  </div>
                )}

                {person.voiceGreeting && (
                  <button
                    className="btn-elderly btn-secondary"
                    onClick={() => handleSpeakMemory(person.voiceGreeting)}
                    style={{ minHeight: '44px', fontSize: 'var(--fs-sm)', marginTop: 'auto' }}
                  >
                    <Volume2 size={18} color="var(--c-coral-600)" />
                    <span>{t('profile.playVoiceNote', { greeting: person.voiceGreeting })}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FAMILIAR OBJECTS */}
      {activeTab === 'objects' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: 'var(--fs-xl)', color: 'var(--c-yellow-600)' }}>
              {t('profile.objectsTitle')}
            </h2>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
              {t('profile.objectsSub')}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {profile.familiarObjects.map(obj => (
              <div
                key={obj.id}
                className="card-elderly"
                style={{
                  background: 'var(--bg-card)',
                  border: '2px solid var(--c-yellow-300)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--c-yellow-50)',
                    border: '3px solid var(--c-yellow-400)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.8rem',
                    flexShrink: 0
                  }}>
                    {obj.emoji}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 'var(--fs-lg)', color: 'var(--text-main)', marginBottom: '2px' }}>
                      {obj.name}
                    </h3>
                    <div style={{
                      display: 'inline-block',
                      background: 'var(--c-yellow-100)',
                      color: 'var(--c-yellow-700)',
                      padding: '2px 10px',
                      borderRadius: '12px',
                      fontWeight: '800',
                      fontSize: 'var(--fs-xs)'
                    }}>
                      {obj.category}
                    </div>
                  </div>

                  <button
                    className="btn-tts"
                    onClick={() => handleSpeakMemory(`${obj.name}. ${obj.description}`)}
                    title="Hear description"
                  >
                    <Volume2 size={20} />
                  </button>
                </div>

                <p style={{ fontSize: 'var(--fs-base)', color: 'var(--text-muted)' }}>
                  {obj.description}
                </p>

                <div style={{
                  background: 'var(--c-mint-50)',
                  border: '1px solid var(--c-mint-400)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--fs-sm)',
                  color: 'var(--c-mint-700)',
                  marginTop: 'auto'
                }}>
                  💡 <strong>{t('profile.memoryClue')}</strong> {obj.hint}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FAVORITE PLACES */}
      {activeTab === 'places' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: 'var(--fs-xl)', color: 'var(--c-mint-600)' }}>
              {t('profile.placesTitle')}
            </h2>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
              {t('profile.placesSub')}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {profile.favoritePlaces.map(place => (
              <div
                key={place.id}
                className="card-elderly"
                style={{
                  background: 'var(--bg-card)',
                  border: '2px solid var(--c-mint-300)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--c-mint-50)',
                    border: '3px solid var(--c-mint-400)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.8rem',
                    flexShrink: 0
                  }}>
                    {place.emoji}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 'var(--fs-lg)', color: 'var(--text-main)', marginBottom: '2px' }}>
                      {place.title}
                    </h3>
                    <div style={{
                      display: 'inline-block',
                      background: 'var(--c-mint-100)',
                      color: 'var(--c-mint-700)',
                      padding: '2px 10px',
                      borderRadius: '12px',
                      fontWeight: '800',
                      fontSize: 'var(--fs-xs)'
                    }}>
                      📍 {place.city}
                    </div>
                  </div>

                  <button
                    className="btn-tts"
                    onClick={() => handleSpeakMemory(`${place.title} in ${place.city}. ${place.desc}`)}
                    title="Hear description"
                  >
                    <Volume2 size={20} />
                  </button>
                </div>

                <p style={{ fontSize: 'var(--fs-base)', color: 'var(--text-muted)' }}>
                  {place.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ACCESSIBILITY & LANGUAGE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="card-elderly" style={{ border: '2px solid var(--c-purple-300)' }}>
          <h2 style={{ fontSize: 'var(--fs-xl)', color: 'var(--c-purple-700)', marginBottom: '18px' }}>
            {t('settings.title')}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* GLOBAL LANGUAGE SELECTOR */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(236, 72, 153, 0.08))',
              border: '2px solid var(--c-purple-300)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <strong style={{ fontSize: 'var(--fs-lg)', color: 'var(--c-purple-700)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe size={22} color="var(--c-purple-600)" />
                  <span>{t('settings.languageTitle')}</span>
                </strong>
                <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                  {t('settings.languageSub')}
                </span>
              </div>
              
              <LanguageSelector variant="cards" />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

            {/* Font size */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <strong style={{ fontSize: 'var(--fs-lg)', display: 'block' }}>{t('settings.fontSizeTitle')}</strong>
                <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>{t('settings.fontSizeSub')}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className={`btn-elderly ${fontSizeLevel === 1 ? 'btn-primary-purple' : 'btn-secondary'}`}
                  onClick={() => cycleFontSize(1)}
                  style={{ minHeight: '46px', padding: '8px 16px', fontSize: 'var(--fs-base)' }}
                >
                  {t('settings.fontSizeNormal')}
                </button>
                <button 
                  className={`btn-elderly ${fontSizeLevel === 1.2 ? 'btn-primary-purple' : 'btn-secondary'}`}
                  onClick={() => cycleFontSize(1.2)}
                  style={{ minHeight: '46px', padding: '8px 16px', fontSize: 'var(--fs-base)' }}
                >
                  {t('settings.fontSizeLarge')}
                </button>
                <button 
                  className={`btn-elderly ${fontSizeLevel === 1.4 ? 'btn-primary-purple' : 'btn-secondary'}`}
                  onClick={() => cycleFontSize(1.4)}
                  style={{ minHeight: '46px', padding: '8px 16px', fontSize: 'var(--fs-base)' }}
                >
                  {t('settings.fontSizeExtraLarge')}
                </button>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

            {/* Reduce Motion */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <strong style={{ fontSize: 'var(--fs-lg)', display: 'block' }}>{t('settings.motionTitle')}</strong>
                <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>{t('settings.motionSub')}</span>
              </div>
              <button 
                className={`btn-elderly ${reduceMotion ? 'btn-primary-mint' : 'btn-secondary'}`}
                onClick={toggleReduceMotion}
                style={{ minHeight: '46px', fontSize: 'var(--fs-base)' }}
              >
                <Eye size={20} />
                <span>{reduceMotion ? t('settings.motionActive') : t('settings.motionStandard')}</span>
              </button>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

            {/* Light / Dark Mode */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <strong style={{ fontSize: 'var(--fs-lg)', display: 'block' }}>{t('settings.themeTitle')}</strong>
                <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>{t('settings.themeSub')}</span>
              </div>
              <button 
                className="btn-elderly btn-secondary"
                onClick={toggleTheme}
                style={{ minHeight: '46px', fontSize: 'var(--fs-base)' }}
              >
                <span>{theme === 'dark' ? t('settings.themeCurrentMoonlit') : t('settings.themeCurrentSunlight')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Person Modal */}
      {showAddPersonModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '20px'
        }}>
          <div className="card-elderly" style={{ maxWidth: '480px', width: '100%', background: 'var(--bg-card)' }}>
            <h2 style={{ fontSize: 'var(--fs-xl)', color: 'var(--c-coral-600)', marginBottom: '16px' }}>
              {t('profile.addPersonModalTitle')}
            </h2>

            <form onSubmit={handleAddPerson} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '6px' }}>{t('profile.nameField')}</label>
                <input
                  type="text"
                  placeholder="e.g. Maya"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '2px solid var(--border-color)', fontSize: 'var(--fs-base)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '6px' }}>{t('profile.relationField')}</label>
                <input
                  type="text"
                  placeholder="e.g. Granddaughter / Sister / Childhood Friend"
                  value={newPersonRelation}
                  onChange={(e) => setNewPersonRelation(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '2px solid var(--border-color)', fontSize: 'var(--fs-base)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '6px' }}>{t('profile.noteField')}</label>
                <textarea
                  placeholder="e.g. Loves bringing homemade sweets on Diwali"
                  value={newPersonNote}
                  onChange={(e) => setNewPersonNote(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '2px solid var(--border-color)', fontSize: 'var(--fs-base)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn-elderly btn-secondary"
                  onClick={() => setShowAddPersonModal(false)}
                  style={{ minHeight: '46px' }}
                >
                  {t('app.cancel')}
                </button>
                <button
                  type="submit"
                  className="btn-elderly btn-primary-coral"
                  style={{ minHeight: '46px' }}
                >
                  {t('profile.savePersonBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
