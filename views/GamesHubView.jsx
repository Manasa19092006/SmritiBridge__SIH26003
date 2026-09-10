import React, { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, Sparkles, Star, RotateCcw, Volume2, 
  ArrowLeft, CheckCircle2, Camera, RefreshCw,
  Eye, Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { useActivity } from '../context/ActivityContext';
import { soundService } from '../services/soundService';
import { speechService } from '../services/speechService';
import { 
  memoryMatchingPairs, 
  sequenceBells, 
  patternQuestions 
} from '../data/demoData';

export function GamesHubView({ 
  profile, 
  initialGame = 'hub', 
  onBackToDashboard, 
  onRewardEarned 
}) {
  const { t, lang } = useLanguage();
  const { logGameActivity } = useActivity();
  const [activeGame, setActiveGame] = useState(initialGame); // 'hub' | 'matching' | 'sequence' | 'pattern' | 'picture' | 'faces' | 'objects'
  const [score, setScore] = useState(100);
  const [encouragementText, setEncouragementText] = useState('');

  // Performance & Activity Tracking
  const gameStartTimeRef = useRef(Date.now());
  const attemptsCountRef = useRef(0);
  const mistakesCountRef = useRef(0);

  // Reset tracking clock whenever game changes
  useEffect(() => {
    gameStartTimeRef.current = Date.now();
    attemptsCountRef.current = 0;
    mistakesCountRef.current = 0;
  }, [activeGame]);

  // ----------------------------------------------------
  // GAME 1: MEMORY MATCHING (3D FLIP CARDS)
  // ----------------------------------------------------
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [shakingIndices, setShakingIndices] = useState([]);

  const initMatchingGame = () => {
    soundService.playBubblePop();
    let pairSource = [...memoryMatchingPairs.slice(0, 8)];
    const shuffled = pairSource.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMatchedIds([]);
    setShakingIndices([]);
    setEncouragementText(t('games.matching.instruction'));
  };

  useEffect(() => {
    if (activeGame === 'matching') {
      initMatchingGame();
    }
  }, [activeGame, lang]);

  const handleCardClick = (index) => {
    if (flippedIndices.length >= 2 || flippedIndices.includes(index)) return;
    if (matchedIds.includes(cards[index].matchId)) return;

    soundService.playCardFlip();
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      attemptsCountRef.current += 1;
      const first = cards[newFlipped[0]];
      const second = cards[newFlipped[1]];

      if (first.matchId === second.matchId) {
        // MATCH!
        setTimeout(() => {
          soundService.playChime();
          setMatchedIds(prev => [...prev, first.matchId]);
          setFlippedIndices([]);
          setScore(s => s + 25);
          const matchMsg = t('games.matching.successMatch', { name: first.name });
          setEncouragementText(matchMsg);
          speechService.speak(matchMsg, lang);

          try {
            confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
          } catch (e) {}

          // Check if all matched
          if (matchedIds.length + 1 >= cards.length / 2) {
            setTimeout(() => {
              handleGameComplete(
                t('games.matching.victoryTitle'), 
                3, 
                60, 
                t('games.matching.victoryMsg'),
                {
                  gameName: 'Memory Matching (3D Cards)',
                  gameType: 'matching',
                  difficulty: 'Level 1 (8 Pairs)',
                  cognitiveFocus: 'Visual association & working memory',
                  score: 92,
                  mood: '🧘 Patient & Focused',
                  performance: 'Visual Precision'
                }
              );
            }, 600);
          }
        }, 500);
      } else {
        // MISMATCH - Gentle shake
        mistakesCountRef.current += 1;
        setTimeout(() => {
          soundService.playGentleNudge();
          setShakingIndices(newFlipped);
          setEncouragementText(t('games.matching.mismatchHint'));
          setTimeout(() => {
            setFlippedIndices([]);
            setShakingIndices([]);
          }, 800);
        }, 800);
      }
    }
  };

  // ----------------------------------------------------
  // GAME 2: SEQUENCE MEMORY (MUSICAL GLOWING BELLS)
  // ----------------------------------------------------
  const [sequence, setSequence] = useState([0, 2, 1]);
  const [userSequence, setUserSequence] = useState([]);
  const [activeLitBell, setActiveLitBell] = useState(null);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [sequenceLevel, setSequenceLevel] = useState(1);

  const playSequencePlayback = (seqToPlay) => {
    setIsShowingSequence(true);
    setUserSequence([]);
    setEncouragementText(t('games.sequence.listening'));

    seqToPlay.forEach((bellIdx, step) => {
      setTimeout(() => {
        setActiveLitBell(bellIdx);
        soundService.playSequenceNote(bellIdx);
        setTimeout(() => {
          setActiveLitBell(null);
        }, 450);
      }, (step + 1) * 750);
    });

    setTimeout(() => {
      setIsShowingSequence(false);
      setEncouragementText(t('games.sequence.yourTurn'));
    }, (seqToPlay.length + 1) * 750);
  };

  const startSequenceGame = () => {
    soundService.playBubblePop();
    const initial = [0, 2, 1];
    setSequence(initial);
    setSequenceLevel(1);
    playSequencePlayback(initial);
  };

  const handleBellTap = (bellId) => {
    if (isShowingSequence) return;
    attemptsCountRef.current += 1;

    soundService.playSequenceNote(bellId);
    setActiveLitBell(bellId);
    setTimeout(() => setActiveLitBell(null), 250);

    const nextUserSeq = [...userSequence, bellId];
    setUserSequence(nextUserSeq);

    const currentStep = nextUserSeq.length - 1;
    if (nextUserSeq[currentStep] !== sequence[currentStep]) {
      // Mistake
      mistakesCountRef.current += 1;
      soundService.playGentleNudge();
      setEncouragementText(t('games.sequence.tryAgain'));
      setTimeout(() => {
        playSequencePlayback(sequence);
      }, 1000);
      return;
    }

    // Finished current sequence correctly
    if (nextUserSeq.length === sequence.length) {
      soundService.playChime();
      setScore(s => s + 30);
      try {
        confetti({ particleCount: 35, spread: 45 });
      } catch (e) {}

      if (sequenceLevel >= 3) {
        handleGameComplete(
          t('games.sequence.victoryTitle'), 
          3, 
          50, 
          t('games.sequence.victoryMsg'),
          {
            gameName: 'Sequence Musical Bells',
            gameType: 'sequence',
            difficulty: `Level ${sequenceLevel} Melody`,
            cognitiveFocus: 'Auditory & sequential memory',
            score: 88,
            mood: '🎵 Joyful & Attentive',
            performance: 'Rhythmic Recall'
          }
        );
      } else {
        setEncouragementText(t('games.sequence.nextLevel'));
        const nextLevel = sequenceLevel + 1;
        setSequenceLevel(nextLevel);
        const nextSeq = [...sequence, Math.floor(Math.random() * 4)];
        setSequence(nextSeq);
        setTimeout(() => {
          playSequencePlayback(nextSeq);
        }, 1200);
      }
    }
  };

  // ----------------------------------------------------
  // GAME 3: PATTERN RECOGNITION (RANGOLI / SHAPES)
  // ----------------------------------------------------
  const [patternIndex, setPatternIndex] = useState(0);
  const [patternFeedback, setPatternFeedback] = useState(null);

  const handlePatternChoice = (selectedOption) => {
    attemptsCountRef.current += 1;
    const currentQ = patternQuestions[patternIndex];
    if (selectedOption === currentQ.correct) {
      soundService.playChime();
      setPatternFeedback({ success: true, text: t('games.pattern.success') });
      setScore(s => s + 20);
      try {
        confetti({ particleCount: 35, spread: 50 });
      } catch (e) {}

      setTimeout(() => {
        setPatternFeedback(null);
        if (patternIndex + 1 < patternQuestions.length) {
          setPatternIndex(patternIndex + 1);
        } else {
          handleGameComplete(
            t('games.pattern.victoryTitle'), 
            3, 
            40, 
            t('games.pattern.victoryMsg'),
            {
              gameName: 'Pattern Recognition',
              gameType: 'pattern',
              difficulty: 'Visual Symmetry',
              cognitiveFocus: 'Spatial reasoning & pattern completion',
              score: 90,
              mood: '🌸 Calm & Observant',
              performance: 'Pattern Insight'
            }
          );
        }
      }, 1500);
    } else {
      mistakesCountRef.current += 1;
      soundService.playGentleNudge();
      setPatternFeedback({ success: false, text: t('games.pattern.hint') });
    }
  };

  // ----------------------------------------------------
  // GAME 4: REMEMBER THE PICTURE (VISUAL RECALL)
  // ----------------------------------------------------
  const [pictureState, setPictureState] = useState('viewing'); // 'viewing' | 'questions' | 'done'
  const [currentPicQuestionIdx, setCurrentPicQuestionIdx] = useState(0);
  const [pictureFeedback, setPictureFeedback] = useState(null);

  // Dynamic localized picture questions
  const localizedPictureQuestions = [
    {
      id: 'q1',
      question: t('games.picture.q1'),
      options: [t('games.picture.q1_opt1'), t('games.picture.q1_opt2'), t('games.picture.q1_opt3')],
      correct: t('games.picture.q1_opt1')
    },
    {
      id: 'q2',
      question: t('games.picture.q2'),
      options: [t('games.picture.q2_opt1'), t('games.picture.q2_opt2'), t('games.picture.q2_opt3')],
      correct: t('games.picture.q2_opt1')
    },
    {
      id: 'q3',
      question: t('games.picture.q3'),
      options: [t('games.picture.q3_opt1'), t('games.picture.q3_opt2'), t('games.picture.q3_opt3')],
      correct: t('games.picture.q3_opt1')
    }
  ];

  const handlePictureAnswer = (choice) => {
    attemptsCountRef.current += 1;
    const currentQ = localizedPictureQuestions[currentPicQuestionIdx];
    if (choice === currentQ.correct) {
      soundService.playChime();
      setPictureFeedback({ success: true, text: t('games.picture.success') });
      setScore(s => s + 25);

      setTimeout(() => {
        setPictureFeedback(null);
        if (currentPicQuestionIdx + 1 < localizedPictureQuestions.length) {
          setCurrentPicQuestionIdx(currentPicQuestionIdx + 1);
        } else {
          handleGameComplete(
            t('games.picture.victoryTitle'), 
            3, 
            50, 
            t('games.picture.victoryMsg'),
            {
              gameName: 'Remember the Picture',
              gameType: 'picture',
              difficulty: 'Visual Details',
              cognitiveFocus: 'Short-term visual scene retention',
              score: 92,
              mood: '🏡 Reminiscent & Alert',
              performance: 'Visual Precision'
            }
          );
        }
      }, 1400);
    } else {
      mistakesCountRef.current += 1;
      soundService.playGentleNudge();
      setPictureFeedback({ success: false, text: t('games.picture.tryAgain') });
    }
  };

  // ----------------------------------------------------
  // GAME 5: FACE RECOGNITION (WHO IS THIS?)
  // ----------------------------------------------------
  const [currentFaceIdx, setCurrentFaceIdx] = useState(0);
  const [faceFeedback, setFaceFeedback] = useState(null);

  const currentFace = profile.familiarPeople[currentFaceIdx % profile.familiarPeople.length];
  const faceOptions = [
    currentFace.name,
    ...profile.familiarPeople
      .filter(p => p.id !== currentFace.id)
      .map(p => p.name)
      .slice(0, 2)
  ].sort(() => Math.random() - 0.5);

  const handleFaceChoice = (name) => {
    attemptsCountRef.current += 1;
    if (name === currentFace.name) {
      soundService.playChime();
      const praiseMsg = t('games.faces.success', { relation: currentFace.relation, name: currentFace.name });
      setFaceFeedback({
        success: true,
        text: praiseMsg
      });
      speechService.speak(praiseMsg, lang);
      setScore(s => s + 30);
      try {
        confetti({ particleCount: 45, spread: 55 });
      } catch (e) {}

      setTimeout(() => {
        setFaceFeedback(null);
        if (currentFaceIdx + 1 < profile.familiarPeople.length) {
          setCurrentFaceIdx(currentFaceIdx + 1);
        } else {
          handleGameComplete(
            t('games.faces.victoryTitle'), 
            3, 
            60, 
            t('games.faces.victoryMsg'),
            {
              gameName: 'Family Face Recognition',
              gameType: 'faces',
              difficulty: 'Loved Ones',
              cognitiveFocus: 'Facial recognition & emotional recall',
              score: 100,
              mood: '❤️ Loving & Happy',
              performance: 'Instant Recognition'
            }
          );
        }
      }, 2000);
    } else {
      mistakesCountRef.current += 1;
      soundService.playGentleNudge();
      setFaceFeedback({
        success: false,
        text: t('games.faces.hint', { note: currentFace.note })
      });
    }
  };

  // ----------------------------------------------------
  // GAME 6: OBJECT RECOGNITION & CAMERA SCANNER
  // ----------------------------------------------------
  const [currentObjIdx, setCurrentObjIdx] = useState(0);
  const [objFeedback, setObjFeedback] = useState(null);
  const [cameraScannerActive, setCameraScannerActive] = useState(false);
  const [scannerSimulating, setScannerSimulating] = useState(false);
  const videoRef = useRef(null);

  const currentObj = profile.familiarObjects[currentObjIdx % profile.familiarObjects.length];
  const objOptions = [
    currentObj.name,
    ...profile.familiarObjects
      .filter(o => o.id !== currentObj.id)
      .map(o => o.name)
      .slice(0, 2)
  ].sort(() => Math.random() - 0.5);

  const handleObjChoice = (name) => {
    attemptsCountRef.current += 1;
    if (name === currentObj.name) {
      soundService.playChime();
      const praiseMsg = t('games.objects.success', { name: currentObj.name, hint: currentObj.hint });
      setObjFeedback({
        success: true,
        text: praiseMsg
      });
      speechService.speak(praiseMsg, lang);
      setScore(s => s + 25);
      try {
        confetti({ particleCount: 40, spread: 50 });
      } catch (e) {}

      setTimeout(() => {
        setObjFeedback(null);
        if (currentObjIdx + 1 < profile.familiarObjects.length) {
          setCurrentObjIdx(currentObjIdx + 1);
        } else {
          handleGameComplete(
            t('games.objects.victoryTitle'), 
            3, 
            50, 
            t('games.objects.victoryMsg'),
            {
              gameName: 'Household Object Recognition',
              gameType: 'objects',
              difficulty: 'Sentimental Items',
              cognitiveFocus: 'Semantic object recall & association',
              score: 94,
              mood: '🧸 Familiar & Confident',
              performance: 'Sharp Recall'
            }
          );
        }
      }, 2000);
    } else {
      mistakesCountRef.current += 1;
      soundService.playGentleNudge();
      setObjFeedback({
        success: false,
        text: t('games.objects.hint', { hint: currentObj.hint })
      });
    }
  };

  const startCameraScanner = async () => {
    soundService.playBubblePop();
    setCameraScannerActive(true);
    setScannerSimulating(true);
    attemptsCountRef.current += 1;

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    } catch (e) {
      console.warn('Webcam permission not granted; running simulation.');
    }

    // AI Scanner Simulation
    setTimeout(() => {
      setScannerSimulating(false);
      soundService.playChime();
      setObjFeedback({
        success: true,
        text: t('games.objects.aiDetected', { name: currentObj.name })
      });
      handleGameComplete(
        t('games.objects.victoryTitle'), 
        3, 
        50, 
        t('games.objects.aiDetected', { name: currentObj.name }),
        {
          gameName: 'Household Object Recognition (AI Scanner)',
          gameType: 'objects',
          difficulty: 'Camera Assisted',
          cognitiveFocus: 'Real-world visual object scanning & recognition',
          score: 96,
          mood: '🌟 Curious & Engaged',
          performance: 'Object Identified'
        }
      );
    }, 2500);
  };

  const stopCameraScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setCameraScannerActive(false);
  };

  // Helper for rewards and dynamic activity tracking
  const handleGameComplete = (gameTitle, starsCount, coinsCount, msg, activityMeta = {}) => {
    soundService.playFanfare();

    const elapsedSeconds = Math.max(1.4, ((Date.now() - gameStartTimeRef.current) / 1000)).toFixed(1);
    const totalAttempts = Math.max(1, attemptsCountRef.current);
    const mistakes = mistakesCountRef.current;
    const computedAccuracy = activityMeta.accuracy !== undefined
      ? activityMeta.accuracy
      : Math.max(68, Math.min(100, Math.round(((totalAttempts - mistakes) / totalAttempts) * 100)));

    const activityRecord = {
      gameName: activityMeta.gameName || gameTitle,
      gameType: activityMeta.gameType || activeGame,
      score: activityMeta.score || 90,
      accuracy: computedAccuracy,
      difficulty: activityMeta.difficulty || 'Standard',
      attempts: totalAttempts,
      responseTime: `${elapsedSeconds}s`,
      status: 'Completed',
      cognitiveFocus: activityMeta.cognitiveFocus || 'Visual and memory engagement',
      performance: activityMeta.performance || 'Outstanding Recall',
      mood: activityMeta.mood || '😊 Cheerful & Focused',
      stars: starsCount,
      coins: coinsCount,
      notes: msg || 'Completed cognitive exercise with high enthusiasm.'
    };

    // Automatically record activity across the entire app
    logGameActivity(activityRecord);

    if (onRewardEarned) {
      onRewardEarned({
        title: `🏆 ${gameTitle}!`,
        message: msg,
        stars: starsCount,
        coins: coinsCount
      });
    }
  };

  const handleSpeakText = (text) => {
    soundService.playBubblePop();
    speechService.speak(text, lang);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px' }}>
      {/* Top Header & Navigation Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {activeGame !== 'hub' && (
            <button
              className="btn-elderly btn-secondary"
              onClick={() => {
                soundService.playBubblePop();
                stopCameraScanner();
                setActiveGame('hub');
              }}
              style={{ minHeight: '48px', padding: '10px 16px', fontSize: 'var(--fs-base)' }}
              title={t('games.allGames')}
            >
              <ArrowLeft size={22} />
              <span>{t('games.allGames')}</span>
            </button>
          )}

          <div>
            <h1 style={{ fontSize: 'var(--fs-2xl)', color: 'var(--text-main)', lineHeight: 1.1 }}>
              {activeGame === 'hub' && ('🎮 ' + t('games.hubTitle'))}
              {activeGame === 'matching' && ('🃏 ' + t('games.game1Title'))}
              {activeGame === 'sequence' && ('🎵 ' + t('games.game2Title'))}
              {activeGame === 'pattern' && ('🌸 ' + t('games.game3Title'))}
              {activeGame === 'picture' && ('🏡 ' + t('games.game4Title'))}
              {activeGame === 'faces' && ('👤 ' + t('games.game5Title'))}
              {activeGame === 'objects' && ('🧸 ' + t('games.game6Title'))}
            </h1>
            <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
              {activeGame === 'hub' ? t('games.hubSubtitle') : t('games.gentlePace')}
            </span>
          </div>
        </div>

        {/* Score & TTS */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--c-yellow-100)',
            border: '2px solid var(--c-yellow-400)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            fontWeight: '900',
            fontSize: 'var(--fs-base)',
            color: '#78350F'
          }}>
            <Star size={20} fill="#EAB308" color="#EAB308" />
            <span>{t('app.score')}: {score}</span>
          </div>

          <button
            className="btn-tts"
            onClick={() => handleSpeakText(encouragementText || t('games.hubSubtitle'))}
            title={t('app.tapToListen')}
          >
            <Volume2 size={22} />
          </button>
        </div>
      </div>

      {/* Encouragement banner */}
      {encouragementText && activeGame !== 'hub' && (
        <div style={{
          background: 'linear-gradient(135deg, var(--c-blue-50), var(--c-purple-50))',
          border: '2px dashed var(--c-purple-300)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <p style={{ fontSize: 'var(--fs-lg)', fontWeight: '800', color: 'var(--c-purple-700)' }}>
            💬 {encouragementText}
          </p>
          <button 
            className="btn-tts" 
            style={{ width: '38px', height: '38px' }}
            onClick={() => handleSpeakText(encouragementText)}
            title={t('app.tapToListen')}
          >
            <Volume2 size={18} />
          </button>
        </div>
      )}

      {/* =========================================================
          VIEW: MAIN GAMES HUB (6 GAMES TILES)
          ========================================================= */}
      {activeGame === 'hub' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginTop: '10px'
        }}>
          {[
            {
              id: 'matching',
              title: t('games.game1Title'),
              desc: t('games.game1Desc'),
              icon: '🃏',
              badge: t('games.game1Badge'),
              gradient: 'linear-gradient(135deg, #EFF6FF, #EDE9FE)',
              borderColor: 'var(--c-blue-400)'
            },
            {
              id: 'sequence',
              title: t('games.game2Title'),
              desc: t('games.game2Desc'),
              icon: '🔔',
              badge: t('games.game2Badge'),
              gradient: 'linear-gradient(135deg, #FEF3C7, #FFEDD5)',
              borderColor: 'var(--c-yellow-500)'
            },
            {
              id: 'pattern',
              title: t('games.game3Title'),
              desc: t('games.game3Desc'),
              icon: '🌸',
              badge: t('games.game3Badge'),
              gradient: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
              borderColor: 'var(--c-mint-500)'
            },
            {
              id: 'picture',
              title: t('games.game4Title'),
              desc: t('games.game4Desc'),
              icon: '🏡',
              badge: t('games.game4Badge'),
              gradient: 'linear-gradient(135deg, #FFF1F2, #FFE4E6)',
              borderColor: 'var(--c-coral-400)'
            },
            {
              id: 'faces',
              title: t('games.game5Title'),
              desc: t('games.game5Desc'),
              icon: '👤',
              badge: t('games.game5Badge'),
              gradient: 'linear-gradient(135deg, #EDE9FE, #DBEAFE)',
              borderColor: 'var(--c-purple-400)'
            },
            {
              id: 'objects',
              title: t('games.game6Title'),
              desc: t('games.game6Desc'),
              icon: '🧸',
              badge: t('games.game6Badge'),
              gradient: 'linear-gradient(135deg, #FEFCE8, #ECFDF5)',
              borderColor: 'var(--c-mint-400)'
            }
          ].map(game => (
            <div
              key={game.id}
              className="card-elderly card-interactive"
              onClick={() => {
                soundService.playBubblePop();
                setActiveGame(game.id);
                if (game.id === 'sequence') startSequenceGame();
              }}
              style={{
                background: game.gradient,
                border: `3px solid ${game.borderColor}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '26px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '3rem' }}>{game.icon}</span>
                  <span style={{
                    background: '#FFFFFF',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--fs-xs)',
                    fontWeight: '800',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    {game.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: 'var(--fs-xl)', color: 'var(--text-main)', marginBottom: '8px' }}>
                  {game.title}
                </h3>

                <p style={{ fontSize: 'var(--fs-base)', color: 'var(--text-muted)' }}>
                  {game.desc}
                </p>
              </div>

              <button
                className="btn-elderly btn-primary-purple"
                style={{ marginTop: '20px', width: '100%', minHeight: '50px', fontSize: 'var(--fs-base)' }}
              >
                <span>{t('games.playThisGame')}</span>
                <Sparkles size={20} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================
          GAME 1: 3D MEMORY MATCHING
          ========================================================= */}
      {activeGame === 'matching' && (
        <div className="card-elderly" style={{ border: '3px solid var(--c-blue-400)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: 'var(--fs-xl)', color: 'var(--c-blue-700)' }}>
                {t('games.matching.title')}
              </h2>
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                {t('games.matching.matchedCount', { count: matchedIds.length, total: cards.length / 2 })}
              </span>
            </div>

            <button
              className="btn-elderly btn-secondary"
              onClick={initMatchingGame}
              style={{ minHeight: '46px', fontSize: 'var(--fs-sm)' }}
            >
              <RotateCcw size={18} />
              <span>{t('games.matching.shuffleBtn')}</span>
            </button>
          </div>

          <div className="game-grid-container">
            {cards.map((card, idx) => {
              const isFlipped = flippedIndices.includes(idx);
              const isMatched = matchedIds.includes(card.matchId);
              const isShaking = shakingIndices.includes(idx);

              return (
                <div
                  key={idx}
                  className={`memory-card-outer ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''} ${isShaking ? 'shake' : ''}`}
                  onClick={() => handleCardClick(idx)}
                  role="button"
                  tabIndex={0}
                  aria-label={isFlipped || isMatched ? card.name : `Hidden card ${idx + 1}`}
                >
                  <div className="card-face card-back">
                    <span style={{ fontSize: '2.4rem' }}>🌸</span>
                    <span style={{ fontWeight: '800', fontSize: 'var(--fs-sm)', marginTop: '6px' }}>{t('games.matching.cardTapMe')}</span>
                  </div>

                  <div className="card-face card-front" style={{ backgroundColor: card.color }}>
                    <div className="card-front-icon">{card.icon}</div>
                    <div className="card-front-title">{card.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
          GAME 2: SEQUENCE MEMORY (MUSICAL BELLS)
          ========================================================= */}
      {activeGame === 'sequence' && (
        <div className="card-elderly" style={{ border: '3px solid var(--c-yellow-400)', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'var(--fs-2xl)', color: 'var(--c-yellow-700)', marginBottom: '8px' }}>
            {t('games.sequence.levelTitle', { level: sequenceLevel })}
          </h2>
          <p style={{ fontSize: 'var(--fs-base)', color: 'var(--text-muted)', marginBottom: '24px' }}>
            {t('games.sequence.instruction')}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            maxWidth: '440px',
            margin: '0 auto 28px'
          }}>
            {sequenceBells.map(bell => {
              const isLit = activeLitBell === bell.id;
              const bellName = bell.id === 0 ? t('games.sequence.bells.sun') :
                               bell.id === 1 ? t('games.sequence.bells.sky') :
                               bell.id === 2 ? t('games.sequence.bells.garden') :
                               t('games.sequence.bells.lotus');
              return (
                <button
                  key={bell.id}
                  onClick={() => handleBellTap(bell.id)}
                  disabled={isShowingSequence}
                  style={{
                    aspectRatio: '1 / 1',
                    borderRadius: 'var(--radius-xl)',
                    background: isLit ? bell.color : bell.bg,
                    border: `4px solid ${bell.color}`,
                    boxShadow: isLit ? `0 0 35px ${bell.color}` : 'var(--shadow-md)',
                    transform: isLit ? 'scale(1.08)' : 'scale(1)',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isShowingSequence ? 'not-allowed' : 'pointer'
                  }}
                >
                  <span style={{ fontSize: '3.6rem', marginBottom: '8px' }}>{bell.icon}</span>
                  <span style={{
                    fontSize: 'var(--fs-lg)',
                    fontWeight: '900',
                    color: isLit ? '#FFFFFF' : bell.color
                  }}>
                    {bellName}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            className="btn-elderly btn-secondary"
            onClick={() => playSequencePlayback(sequence)}
            disabled={isShowingSequence}
            style={{ minHeight: '48px', fontSize: 'var(--fs-base)' }}
          >
            <Volume2 size={20} />
            <span>{t('games.sequence.replayBtn')}</span>
          </button>
        </div>
      )}

      {/* =========================================================
          GAME 3: PATTERN RECOGNITION (RANGOLI & SHAPES)
          ========================================================= */}
      {activeGame === 'pattern' && (
        <div className="card-elderly" style={{ border: '3px solid var(--c-mint-400)', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'var(--fs-2xl)', color: 'var(--c-mint-700)', marginBottom: '8px' }}>
            {t('games.pattern.title')}
          </h2>
          <p style={{ fontSize: 'var(--fs-base)', color: 'var(--text-muted)', marginBottom: '24px' }}>
            {t('games.pattern.instruction')}
          </p>

          {/* Sequence Display */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '32px',
            flexWrap: 'wrap'
          }}>
            {patternQuestions[patternIndex].sequence.map((item, idx) => (
              <div
                key={idx}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--radius-lg)',
                  background: item === '❓' ? 'var(--c-peach-100)' : 'var(--bg-card)',
                  border: `3px solid ${item === '❓' ? 'var(--c-peach-500)' : 'var(--c-mint-400)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.8rem',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                {item}
              </div>
            ))}
          </div>

          {/* Feedback banner */}
          {patternFeedback && (
            <div style={{
              padding: '12px 20px',
              borderRadius: 'var(--radius-md)',
              background: patternFeedback.success ? 'var(--c-mint-100)' : 'var(--c-peach-100)',
              color: patternFeedback.success ? 'var(--c-mint-700)' : 'var(--c-peach-700)',
              fontWeight: '800',
              fontSize: 'var(--fs-lg)',
              marginBottom: '20px'
            }}>
              {patternFeedback.text}
            </div>
          )}

          {/* Options */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {patternQuestions[patternIndex].options.map((opt, idx) => (
              <button
                key={idx}
                className="btn-elderly btn-secondary"
                onClick={() => handlePatternChoice(opt)}
                style={{
                  width: '90px',
                  height: '90px',
                  fontSize: '3rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '3px solid var(--c-purple-300)'
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          GAME 4: REMEMBER THE PICTURE
          ========================================================= */}
      {activeGame === 'picture' && (
        <div className="card-elderly" style={{ border: '3px solid var(--c-coral-400)' }}>
          {pictureState === 'viewing' ? (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: 'var(--fs-2xl)', color: 'var(--c-coral-700)', marginBottom: '8px' }}>
                {t('games.picture.sceneTitle')}
              </h2>
              <p style={{ fontSize: 'var(--fs-base)', color: 'var(--text-muted)', marginBottom: '20px' }}>
                {t('games.picture.viewInstruction')}
              </p>

              <div style={{
                background: 'linear-gradient(135deg, #FFF7ED, #FEF3C7)',
                border: '3px solid var(--c-peach-400)',
                borderRadius: 'var(--radius-xl)',
                padding: '36px 20px',
                marginBottom: '24px',
                fontSize: '4rem',
                letterSpacing: '14px',
                boxShadow: 'var(--shadow-md)'
              }}>
                🏡 🌳 👵🏽 ☕ 🦜 🐈
              </div>

              <p style={{
                fontSize: 'var(--fs-lg)',
                color: 'var(--text-main)',
                maxWidth: '650px',
                margin: '0 auto 24px',
                lineHeight: 1.5,
                background: 'var(--bg-card)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}>
                "{t('games.picture.sceneDesc')}"
              </p>

              <button
                className="btn-elderly btn-primary-mint"
                onClick={() => {
                  soundService.playBubblePop();
                  setPictureState('questions');
                }}
                style={{ minWidth: '280px', minHeight: '56px', fontSize: 'var(--fs-lg)' }}
              >
                <span>{t('games.picture.readyBtn')}</span>
                <CheckCircle2 size={24} />
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: 'var(--fs-xl)', color: 'var(--c-coral-700)' }}>
                  {t('games.picture.questionProgress', { current: currentPicQuestionIdx + 1, total: localizedPictureQuestions.length })}
                </h3>
                <button
                  className="btn-elderly btn-secondary"
                  onClick={() => setPictureState('viewing')}
                  style={{ minHeight: '44px', fontSize: 'var(--fs-sm)' }}
                >
                  <Eye size={18} />
                  <span>{t('games.picture.peekAgain')}</span>
                </button>
              </div>

              <div style={{
                fontSize: 'var(--fs-2xl)',
                fontWeight: '800',
                color: 'var(--text-main)',
                marginBottom: '24px',
                lineHeight: 1.3
              }}>
                {localizedPictureQuestions[currentPicQuestionIdx].question}
              </div>

              {pictureFeedback && (
                <div style={{
                  padding: '14px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: pictureFeedback.success ? 'var(--c-mint-100)' : 'var(--c-peach-100)',
                  color: pictureFeedback.success ? 'var(--c-mint-700)' : 'var(--c-peach-700)',
                  fontWeight: '800',
                  fontSize: 'var(--fs-lg)',
                  marginBottom: '20px'
                }}>
                  {pictureFeedback.text}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {localizedPictureQuestions[currentPicQuestionIdx].options.map((option, idx) => (
                  <button
                    key={idx}
                    className="btn-elderly btn-secondary"
                    onClick={() => handlePictureAnswer(option)}
                    style={{
                      justifyContent: 'flex-start',
                      padding: '18px 24px',
                      fontSize: 'var(--fs-lg)',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'var(--c-purple-100)',
                      color: 'var(--c-purple-700)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '900',
                      marginRight: '12px'
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          GAME 5: FACE RECOGNITION ("WHO IS THIS?")
          ========================================================= */}
      {activeGame === 'faces' && (
        <div className="card-elderly" style={{ border: '3px solid var(--c-purple-400)', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: 'var(--fs-base)', fontWeight: '800', color: 'var(--c-purple-600)' }}>
              {t('games.faces.progress', { current: currentFaceIdx + 1, total: profile.familiarPeople.length })}
            </span>
            <button
              className="btn-tts"
              onClick={() => handleSpeakText(`${t('games.faces.question')} ${faceOptions.join(', ')}`)}
              title={t('app.tapToListen')}
            >
              <Volume2 size={22} />
            </button>
          </div>

          <h2 style={{ fontSize: 'var(--fs-2xl)', color: 'var(--c-purple-700)', marginBottom: '18px' }}>
            {t('games.faces.question')}
          </h2>

          <div style={{
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--c-peach-100), var(--c-purple-100))',
            border: '5px solid #FFFFFF',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '5.5rem',
            margin: '0 auto 20px'
          }}>
            {currentFace.emoji}
          </div>

          {faceFeedback && (
            <div style={{
              padding: '14px 20px',
              borderRadius: 'var(--radius-md)',
              background: faceFeedback.success ? 'var(--c-mint-100)' : 'var(--c-peach-100)',
              color: faceFeedback.success ? 'var(--c-mint-700)' : 'var(--c-peach-700)',
              fontWeight: '800',
              fontSize: 'var(--fs-lg)',
              marginBottom: '20px'
            }}>
              {faceFeedback.text}
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            maxWidth: '700px',
            margin: '0 auto 20px'
          }}>
            {faceOptions.map((name, idx) => (
              <button
                key={idx}
                className="btn-elderly btn-secondary"
                onClick={() => handleFaceChoice(name)}
                style={{
                  minHeight: '60px',
                  fontSize: 'var(--fs-xl)',
                  fontWeight: '800',
                  border: '3px solid var(--c-purple-300)'
                }}
              >
                <span>{name}</span>
              </button>
            ))}
          </div>

          <button
            className="btn-elderly btn-secondary"
            onClick={() => handleSpeakText(currentFace.note)}
            style={{ minHeight: '44px', fontSize: 'var(--fs-sm)', marginTop: '8px' }}
          >
            <Heart size={18} color="var(--c-coral-500)" />
            <span>{t('games.faces.clueBtn')}</span>
          </button>
        </div>
      )}

      {/* =========================================================
          GAME 6: OBJECT RECOGNITION & CAMERA SCANNER
          ========================================================= */}
      {activeGame === 'objects' && (
        <div className="card-elderly" style={{ border: '3px solid var(--c-mint-400)', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: 'var(--fs-base)', fontWeight: '800', color: 'var(--c-mint-700)' }}>
              {t('games.objects.progress', { current: currentObjIdx + 1, total: profile.familiarObjects.length })}
            </span>
            <button
              className="btn-tts"
              onClick={() => handleSpeakText(`${t('games.objects.question')} ${currentObj.hint}`)}
              title={t('app.tapToListen')}
            >
              <Volume2 size={22} />
            </button>
          </div>

          <h2 style={{ fontSize: 'var(--fs-2xl)', color: 'var(--c-mint-700)', marginBottom: '18px' }}>
            {t('games.objects.question')}
          </h2>

          <div style={{
            width: '130px',
            height: '130px',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, var(--c-yellow-100), var(--c-mint-100))',
            border: '5px solid #FFFFFF',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '5.5rem',
            margin: '0 auto 20px'
          }}>
            {currentObj.emoji}
          </div>

          {objFeedback && (
            <div style={{
              padding: '14px 20px',
              borderRadius: 'var(--radius-md)',
              background: objFeedback.success ? 'var(--c-mint-100)' : 'var(--c-peach-100)',
              color: objFeedback.success ? 'var(--c-mint-700)' : 'var(--c-peach-700)',
              fontWeight: '800',
              fontSize: 'var(--fs-lg)',
              marginBottom: '20px'
            }}>
              {objFeedback.text}
            </div>
          )}

          {/* Options */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            maxWidth: '720px',
            margin: '0 auto 24px'
          }}>
            {objOptions.map((name, idx) => (
              <button
                key={idx}
                className="btn-elderly btn-secondary"
                onClick={() => handleObjChoice(name)}
                style={{
                  minHeight: '60px',
                  fontSize: 'var(--fs-lg)',
                  fontWeight: '800',
                  border: '3px solid var(--c-mint-400)'
                }}
              >
                <span>{name}</span>
              </button>
            ))}
          </div>

          {/* Camera Scanner Simulation */}
          <div style={{
            background: 'var(--bg-card-subtle)',
            padding: '20px',
            borderRadius: 'var(--radius-lg)',
            border: '2px dashed var(--c-mint-400)',
            maxWidth: '560px',
            margin: '0 auto'
          }}>
            <h3 style={{ fontSize: 'var(--fs-lg)', color: 'var(--c-mint-700)', marginBottom: '6px' }}>
              📷 {t('games.objects.cameraTitle')}
            </h3>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', marginBottom: '14px' }}>
              {t('games.objects.cameraDesc')}
            </p>

            {!cameraScannerActive ? (
              <button
                className="btn-elderly btn-primary-mint"
                onClick={startCameraScanner}
                style={{ minHeight: '48px', fontSize: 'var(--fs-base)' }}
              >
                <Camera size={20} />
                <span>{t('games.objects.startCamera')}</span>
              </button>
            ) : (
              <div>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '360px',
                  height: '240px',
                  margin: '0 auto 14px',
                  background: '#000000',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {scannerSimulating && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0, 0, 0, 0.65)',
                      color: '#FFFFFF'
                    }}>
                      <RefreshCw size={36} className="spin-slow" color="#34D399" />
                      <span style={{ marginTop: '10px', fontWeight: '800' }}>
                        {t('games.objects.scanning')}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  className="btn-elderly btn-secondary"
                  onClick={stopCameraScanner}
                  style={{ minHeight: '44px', fontSize: 'var(--fs-sm)' }}
                >
                  {t('games.objects.closeCamera')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
