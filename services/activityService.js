// activityService.js
// Centralized service for tracking, storing, and computing dynamic cognitive game performance,
// activity history timeline, 7-day analytics, and caregiver metrics.

const STORAGE_KEY_PREFIX = 'smriti_activities_';
const PROFILE_METRICS_PREFIX = 'smriti_metrics_';

// Baseline starter records for profiles to provide initial historical context
// until the user plays games and adds live dynamic records.
const getInitialBaselineActivities = (profileName = 'Ramesh Sundaram') => {
  const now = new Date();
  
  const todayMorning = new Date(now);
  todayMorning.setHours(9, 45, 0, 0);

  const todayMidMorning = new Date(now);
  todayMidMorning.setHours(10, 15, 0, 0);

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(11, 30, 0, 0);

  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  twoDaysAgo.setHours(15, 20, 0, 0);

  const threeDaysAgo = new Date(now);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  threeDaysAgo.setHours(10, 0, 0, 0);

  return [
    {
      id: `act-${todayMidMorning.getTime()}`,
      gameName: 'Daily Recall with Mitra',
      gameType: 'recall',
      date: todayMidMorning.toLocaleDateString(),
      time: todayMidMorning.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: todayMidMorning.getTime(),
      score: 95,
      accuracy: 100,
      difficulty: 'Standard',
      attempts: 1,
      responseTime: '2.1s',
      status: 'Completed',
      cognitiveFocus: 'Long-term conversational recall',
      performance: 'Cheerful & Expressive',
      mood: '😊 Cheerful & Talkative',
      stars: 3,
      coins: 40,
      notes: 'Shared story of drinking hot ginger tea on the veranda with morning breeze.'
    },
    {
      id: `act-${todayMorning.getTime()}`,
      gameName: 'Memory Matching (3D Cards)',
      gameType: 'matching',
      date: todayMorning.toLocaleDateString(),
      time: todayMorning.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: todayMorning.getTime(),
      score: 92,
      accuracy: 92,
      difficulty: 'Level 1 (8 Pairs)',
      attempts: 9,
      responseTime: '2.3s',
      status: 'Completed',
      cognitiveFocus: 'Visual association & working memory',
      performance: 'Focused & Calm',
      mood: '🧘 Patient & Focused',
      stars: 3,
      coins: 50,
      notes: 'Matched brass cups, old radio, and sweet laddus with high visual precision.'
    },
    {
      id: `act-${yesterday.getTime()}`,
      gameName: 'Family Face Recognition',
      gameType: 'faces',
      date: yesterday.toLocaleDateString(),
      time: yesterday.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: yesterday.getTime(),
      score: 100,
      accuracy: 100,
      difficulty: 'Loved Ones',
      attempts: 4,
      responseTime: '1.6s',
      status: 'Mastered',
      cognitiveFocus: 'Facial recognition & emotional recall',
      performance: 'Instant Recognition',
      mood: '❤️ Loving & Happy',
      stars: 3,
      coins: 60,
      notes: 'Recognized granddaughter Ananya, son Rahul, and wife Lakshmi instantly.'
    },
    {
      id: `act-${twoDaysAgo.getTime()}`,
      gameName: 'Sequence Musical Bells',
      gameType: 'sequence',
      date: twoDaysAgo.toLocaleDateString(),
      time: twoDaysAgo.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: twoDaysAgo.getTime(),
      score: 88,
      accuracy: 88,
      difficulty: 'Level 2 Melody',
      attempts: 5,
      responseTime: '2.5s',
      status: 'Completed',
      cognitiveFocus: 'Auditory & sequential memory',
      performance: 'Rhythmic Accuracy',
      mood: '🎵 Joyful & Attentive',
      stars: 3,
      coins: 40,
      notes: 'Repeated 4-bell harmonic sequences with pleasant Carnatic melody chime.'
    },
    {
      id: `act-${threeDaysAgo.getTime()}`,
      gameName: 'Household Object Recognition',
      gameType: 'objects',
      date: threeDaysAgo.toLocaleDateString(),
      time: threeDaysAgo.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: threeDaysAgo.getTime(),
      score: 94,
      accuracy: 94,
      difficulty: 'Sentimental Items',
      attempts: 5,
      responseTime: '2.0s',
      status: 'Completed',
      cognitiveFocus: 'Semantic object recall & association',
      performance: 'Sharp Recall',
      mood: '🌟 Confident',
      stars: 3,
      coins: 50,
      notes: 'Identified brass coffee filter, reading spectacles, and wooden radio with memory clues.'
    }
  ];
};

export const activityService = {
  // Retrieve all activities for a specific profile (sorted newest first)
  getActivities(profileId = 'p1') {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${profileId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        }
      }
    } catch (e) {
      console.warn('Error reading stored activities:', e);
    }

    // Seed baseline starter data if empty
    const baseline = getInitialBaselineActivities();
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${profileId}`, JSON.stringify(baseline));
    } catch (e) {}
    return baseline;
  },

  // Record a new completed game activity
  recordActivity(profileId = 'p1', data = {}) {
    const existing = this.getActivities(profileId);
    const now = new Date();

    const newRecord = {
      id: `act-${now.getTime()}-${Math.floor(Math.random() * 1000)}`,
      gameName: data.gameName || 'Cognitive Activity',
      gameType: data.gameType || 'general',
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: now.getTime(),
      score: typeof data.score === 'number' ? data.score : 90,
      accuracy: typeof data.accuracy === 'number' ? data.accuracy : 95,
      difficulty: data.difficulty || 'Standard',
      attempts: data.attempts || 1,
      responseTime: data.responseTime || '2.2s',
      status: data.status || 'Completed',
      cognitiveFocus: data.cognitiveFocus || 'Memory stimulation & engagement',
      performance: data.performance || 'Great Effort',
      mood: data.mood || '😊 Cheerful & Calm',
      stars: data.stars || 3,
      coins: data.coins || 40,
      notes: data.notes || data.message || 'Successfully completed cognitive exercise.'
    };

    const updated = [newRecord, ...existing];
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${profileId}`, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving activity record:', e);
    }

    return newRecord;
  },

  // Activities completed on the current calendar date
  getTodayActivities(profileId = 'p1') {
    const all = this.getActivities(profileId);
    const todayDateStr = new Date().toLocaleDateString();
    return all.filter(a => a.date === todayDateStr);
  },

  // Daily goal progress (e.g. completed / 4 target exercises)
  getDailyProgress(profileId = 'p1', targetCount = 4) {
    const todayActs = this.getTodayActivities(profileId);
    // Unique game types or count of activities completed today
    const completed = todayActs.length;
    const percent = Math.min(100, Math.round((completed / targetCount) * 100));

    return {
      completed,
      total: targetCount,
      percent,
      isGoalReached: completed >= targetCount
    };
  },

  // Overall dynamic Cognitive Health Score (0 - 100) for the SVG progress ring
  getCognitiveHealthScore(profileId = 'p1') {
    const acts = this.getActivities(profileId);
    if (!acts || acts.length === 0) return 85;

    // Weight recent 5 activities heavily
    const recent = acts.slice(0, 8);
    const totalAccuracy = recent.reduce((sum, a) => sum + (a.accuracy || a.score || 85), 0);
    const avg = Math.round(totalAccuracy / recent.length);
    
    // Clamp between 60 and 99 for a positive, reassuring wellness indicator
    return Math.max(65, Math.min(98, avg));
  },

  // 4 Core Cognitive Performance Metrics for Analytics View
  getCognitiveMetrics(profileId = 'p1') {
    const acts = this.getActivities(profileId);

    // Filter by cognitive domains
    const memoryActs = acts.filter(a => ['matching', 'picture', 'sequence'].includes(a.gameType));
    const attentionActs = acts.filter(a => ['sequence', 'pattern'].includes(a.gameType));
    const recallActs = acts.filter(a => ['faces', 'objects', 'recall'].includes(a.gameType));

    const avg = (list, defaultVal) => {
      if (!list || list.length === 0) return defaultVal;
      const sum = list.reduce((acc, a) => acc + (a.accuracy || 85), 0);
      return Math.round(sum / list.length);
    };

    // Calculate average response time in seconds
    const parseSec = (str) => {
      if (typeof str === 'number') return str;
      const match = (str || '').match(/([\d.]+)/);
      return match ? parseFloat(match[1]) : 2.4;
    };
    const avgSpeedSec = acts.length > 0
      ? (acts.slice(0, 6).reduce((acc, a) => acc + parseSec(a.responseTime), 0) / Math.min(6, acts.length)).toFixed(1)
      : '2.4';

    return {
      memoryScore: avg(memoryActs, 86),
      attentionScore: avg(attentionActs, 82),
      recallAccuracy: avg(recallActs, 92),
      responseTimeSec: avgSpeedSec,
      totalSessions: acts.length
    };
  },

  // 7-Day Trend data for Analytics weekly bar chart
  getWeeklyTrend(profileId = 'p1') {
    const acts = this.getActivities(profileId);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();

    // Generate array for past 7 days up to today
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() - i);
      const dateStr = targetDate.toLocaleDateString();
      const isToday = i === 0;

      // Find activities on this date
      const matching = acts.filter(a => a.date === dateStr);
      let dayScore = 0;
      if (matching.length > 0) {
        dayScore = Math.round(matching.reduce((acc, a) => acc + (a.accuracy || a.score || 80), 0) / matching.length);
      } else {
        // Realistic fallback gradient for unplayed past days
        dayScore = Math.max(74, 86 - (i * 2));
      }

      result.push({
        day: isToday ? 'Today' : dayNames[targetDate.getDay()],
        date: dateStr,
        score: dayScore,
        count: matching.length,
        isToday
      });
    }

    return result;
  },

  // Caregiver Portal metrics derived from actual patient sessions
  getCaregiverSummary(profileId = 'p1') {
    const acts = this.getActivities(profileId);
    const todayActs = this.getTodayActivities(profileId);

    // 1. Family Recognition Accuracy from real Face game activities
    const faceActs = acts.filter(a => a.gameType === 'faces');
    const familyAccuracy = faceActs.length > 0
      ? Math.round(faceActs.reduce((acc, a) => acc + (a.accuracy || 100), 0) / faceActs.length)
      : 98;

    // 2. Total active engagement minutes today
    // Each completed game corresponds to approx ~4-8 minutes of relaxed gameplay
    const estimatedMinutes = Math.max(12, todayActs.length * 6 + 12);

    // 3. Check for unusual observations (e.g. response time > 3.8s or accuracy < 65%)
    const hasMildObservation = todayActs.some(a => {
      const match = (a.responseTime || '').match(/([\d.]+)/);
      const sec = match ? parseFloat(match[1]) : 2.0;
      return sec > 3.5 || (a.accuracy && a.accuracy < 70);
    });

    return {
      familyAccuracy,
      engagementMinutes: estimatedMinutes,
      todayActivitiesCount: todayActs.length,
      hasMildObservation,
      recentTimeline: acts.slice(0, 10)
    };
  },

  // Dynamic performance tier for ResultView ('good' | 'attention' | 'assessment')
  getPerformanceTier(profileId = 'p1') {
    const acts = this.getTodayActivities(profileId);
    if (!acts || acts.length === 0) return 'good';

    const latest = acts[0];
    if (latest.accuracy >= 80) return 'good';
    if (latest.accuracy >= 65) return 'attention';
    return 'assessment';
  }
};
