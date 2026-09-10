import React, { useState, useEffect } from 'react';
import { 
  Mic, MicOff, Send, Heart, Volume2, Sparkles, 
  Calendar, Check, Plus, MessageSquare, Music
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { useActivity } from '../context/ActivityContext';
import { soundService } from '../services/soundService';
import { speechService } from '../services/speechService';

export function DailyRecallView({ 
  profile, 
  onRewardEarned 
}) {
  const { t, lang } = useLanguage();
  const { logGameActivity } = useActivity();
  const [inputText, setInputText] = useState('');
  const [selectedActivities, setSelectedActivities] = useState(['act1', 'act2']);
  const [isListening, setIsListening] = useState(false);

  // Dynamic initial conversation updated on language change
  const [conversationHistory, setConversationHistory] = useState([]);

  useEffect(() => {
    setConversationHistory([
      {
        id: 'm1',
        sender: 'mitra',
        text: t('dailyRecall.initialMitra1', { name: profile.honorific || profile.name }),
        time: '10:15 AM'
      },
      {
        id: 'm2',
        sender: 'user',
        text: t('dailyRecall.initialUser1'),
        time: '10:18 AM'
      },
      {
        id: 'm3',
        sender: 'mitra',
        text: t('dailyRecall.initialMitra2'),
        time: '10:19 AM'
      }
    ]);
  }, [lang, profile.name]);

  const activityList = [
    { id: 'act1', label: t('dailyRecall.activities.tea'), icon: '☕' },
    { id: 'act2', label: t('dailyRecall.activities.garden'), icon: '🌿' },
    { id: 'act3', label: t('dailyRecall.activities.newspaper'), icon: '📰' },
    { id: 'act4', label: t('dailyRecall.activities.music'), icon: '🎵' },
    { id: 'act5', label: t('dailyRecall.activities.family'), icon: '📞' },
    { id: 'act6', label: t('dailyRecall.activities.prayer'), icon: '🪔' },
    { id: 'act7', label: t('dailyRecall.activities.cinema'), icon: '📺' },
    { id: 'act8', label: t('dailyRecall.activities.plants'), icon: '🪴' }
  ];

  const handleSpeakText = (text) => {
    soundService.playBubblePop();
    speechService.speak(text, lang);
  };

  const handleToggleActivity = (act) => {
    soundService.playBubblePop();
    if (selectedActivities.includes(act.id)) {
      setSelectedActivities(prev => prev.filter(id => id !== act.id));
    } else {
      setSelectedActivities(prev => [...prev, act.id]);
      soundService.playChime();

      const userText = `${t('dailyRecall.userPrefix')} ${act.label} ${act.icon}`;
      const replyMsg = {
        id: `msg-${Date.now()}`,
        sender: 'user',
        text: userText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      const mitraText = t('dailyRecall.mitraReplyActivity', { act: act.label });
      const mitraMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: 'mitra',
        text: mitraText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setConversationHistory(prev => [...prev, replyMsg, mitraMsg]);
      speechService.speak(mitraText, lang);

      // Record dynamic recall activity
      logGameActivity({
        gameName: 'Daily Recall with Mitra',
        gameType: 'recall',
        score: 95,
        accuracy: 100,
        difficulty: 'Standard',
        attempts: 1,
        responseTime: '1.8s',
        status: 'Completed',
        cognitiveFocus: 'Long-term conversational recall',
        performance: 'Warm & Expressive',
        mood: '😊 Cheerful & Talkative',
        stars: 3,
        coins: 40,
        notes: `Recalled activity: ${act.label}`
      });

      try {
        confetti({ particleCount: 25, spread: 40 });
      } catch (e) {}
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    soundService.playBubblePop();
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const replyText = t('dailyRecall.mitraReplyCustom', { name: profile.honorific || profile.name });
    const mitraReply = {
      id: `msg-${Date.now() + 1}`,
      sender: 'mitra',
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversationHistory(prev => [...prev, userMsg, mitraReply]);

    // Record dynamic recall activity
    logGameActivity({
      gameName: 'Daily Recall with Mitra',
      gameType: 'recall',
      score: 95,
      accuracy: 100,
      difficulty: 'Standard',
      attempts: 1,
      responseTime: '2.0s',
      status: 'Completed',
      cognitiveFocus: 'Conversational Memory & Mood Expression',
      performance: 'Active Expression',
      mood: '💬 Thoughtful & Active',
      stars: 3,
      coins: 40,
      notes: `Discussed: ${inputText.slice(0, 45)}`
    });

    setInputText('');

    setTimeout(() => {
      soundService.playChime();
      speechService.speak(replyText, lang);
    }, 400);

    if (onRewardEarned) {
      setTimeout(() => {
        onRewardEarned({
          title: `🧠 ${t('dailyRecall.rewardTitle')}`,
          message: t('dailyRecall.rewardMsg'),
          stars: 3,
          coins: 40
        });
      }, 1500);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      return;
    }

    soundService.playBubblePop();
    setIsListening(true);

    const recognition = speechService.startListening(
      (transcript) => {
        setInputText(transcript);
      },
      () => {
        setIsListening(false);
      },
      () => {
        setIsListening(false);
        setInputText(t('dailyRecall.initialUser1'));
      },
      lang
    );

    if (!recognition) {
      setTimeout(() => {
        setInputText(t('dailyRecall.initialUser1'));
        setIsListening(false);
      }, 1800);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '16px' }}>
      {/* Header Banner */}
      <div 
        className="card-elderly"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, rgba(209, 250, 229, 0.95), var(--c-purple-50))',
          border: '3px solid var(--c-mint-400)',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              background: 'var(--c-mint-100)',
              color: 'var(--c-mint-700)',
              fontWeight: '800',
              padding: '4px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--fs-sm)'
            }}>
              📅 {t('dailyRecall.title')}
            </span>
          </div>

          <h1 style={{ fontSize: 'var(--fs-2xl)', color: 'var(--text-main)', marginBottom: '8px' }}>
            {t('dailyRecall.question')}
          </h1>

          <p style={{ fontSize: 'var(--fs-base)', color: 'var(--text-muted)' }}>
            {t('dailyRecall.prompt')}
          </p>
        </div>

        <button
          className="btn-tts"
          onClick={() => handleSpeakText(`${t('dailyRecall.question')} ${t('dailyRecall.prompt')}`)}
          title={t('app.tapToListen')}
        >
          <Volume2 size={24} />
        </button>
      </div>

      {/* Picture-Based Quick Activities (1-Tap Selection for Seniors) */}
      <div 
        className="card-elderly"
        style={{
          marginBottom: '24px',
          background: 'var(--bg-card)',
          border: '2px solid var(--border-color)'
        }}
      >
        <h2 style={{ fontSize: 'var(--fs-lg)', color: 'var(--text-main)', marginBottom: '6px' }}>
          🖼️ {t('dailyRecall.activitiesTitle')}
        </h2>
        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', marginBottom: '16px' }}>
          {t('dailyRecall.activitiesSub')}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px'
        }}>
          {activityList.map(act => {
            const isSelected = selectedActivities.includes(act.id);
            return (
              <button
                key={act.id}
                className="btn-elderly"
                onClick={() => handleToggleActivity(act)}
                style={{
                  minHeight: '62px',
                  padding: '10px 16px',
                  justifyContent: 'flex-start',
                  background: isSelected ? 'var(--c-mint-100)' : 'var(--bg-card)',
                  color: isSelected ? 'var(--c-mint-700)' : 'var(--text-main)',
                  border: `3px solid ${isSelected ? 'var(--c-mint-500)' : 'var(--border-color)'}`,
                  fontSize: 'var(--fs-base)'
                }}
              >
                <span style={{ fontSize: '1.8rem', marginRight: '8px' }}>{act.icon}</span>
                <span style={{ flex: 1, textAlign: 'left', fontWeight: '800' }}>{act.label}</span>
                {isSelected && <Check size={20} color="var(--c-mint-600)" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversational Memory Diary with AI Mitra */}
      <div 
        className="card-elderly"
        style={{
          border: '3px solid var(--c-purple-300)',
          background: 'var(--bg-card)',
          padding: '24px',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--c-yellow-100), var(--c-peach-100))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            border: '3px solid var(--c-purple-400)'
          }}>
            👵🏽
          </div>
          <div>
            <h3 style={{ fontSize: 'var(--fs-xl)', color: 'var(--c-purple-700)' }}>
              {t('dailyRecall.chatTitle')}
            </h3>
            <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-mint-600)', fontWeight: '700' }}>
              {t('dailyRecall.chatOnline')}
            </span>
          </div>
        </div>

        {/* Chat message bubbles */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxHeight: '420px',
          overflowY: 'auto',
          padding: '8px 4px',
          marginBottom: '20px'
        }}>
          {conversationHistory.map(msg => {
            const isMitra = msg.sender === 'mitra';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isMitra ? 'flex-start' : 'flex-end',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}
              >
                {isMitra && (
                  <span style={{ fontSize: '1.8rem', marginTop: '4px' }}>👵🏽</span>
                )}

                <div style={{
                  maxWidth: '78%',
                  background: isMitra 
                    ? 'linear-gradient(135deg, var(--c-purple-50), #FFFFFF)' 
                    : 'linear-gradient(135deg, var(--c-blue-500), var(--c-blue-600))',
                  color: isMitra ? 'var(--text-main)' : '#FFFFFF',
                  padding: '16px 20px',
                  borderRadius: isMitra ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                  border: isMitra ? '2px solid var(--c-purple-200)' : 'none',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <p style={{ fontSize: 'var(--fs-base)', lineHeight: 1.5, marginBottom: '6px' }}>
                    {msg.text}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    fontSize: '0.75rem',
                    opacity: 0.85
                  }}>
                    <span>{msg.time}</span>
                    {isMitra && (
                      <button
                        className="btn-tts"
                        style={{ width: '28px', height: '28px' }}
                        onClick={() => handleSpeakText(msg.text)}
                        title={t('app.tapToListen')}
                      >
                        <Volume2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {!isMitra && (
                  <span style={{ fontSize: '1.8rem', marginTop: '4px' }}>👴🏽</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Input Bar: Microphone + Text Input + Send Button */}
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Big Microphone button */}
          <button
            type="button"
            className={`btn-elderly ${isListening ? 'btn-primary-coral' : 'btn-primary-blue'}`}
            onClick={handleVoiceInput}
            style={{
              minWidth: '160px',
              minHeight: '56px',
              borderRadius: 'var(--radius-lg)',
              animation: isListening ? 'pulse-ring 1.5s infinite' : 'none'
            }}
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            <span>{isListening ? t('dailyRecall.micListening') : t('dailyRecall.micStart')}</span>
          </button>

          {/* Text Input */}
          <input
            type="text"
            placeholder={t('dailyRecall.inputPlaceholder')}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{
              flex: 1,
              minWidth: '220px',
              minHeight: '56px',
              padding: '12px 20px',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--border-color)',
              fontSize: 'var(--fs-base)',
              background: 'var(--bg-card)'
            }}
          />

          {/* Send Button */}
          <button
            type="submit"
            className="btn-elderly btn-primary-mint"
            style={{ minHeight: '56px', padding: '12px 24px', fontSize: 'var(--fs-base)' }}
          >
            <span>{t('dailyRecall.shareBtn')}</span>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
