import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { activityService } from '../services/activityService';

const ActivityContext = createContext(null);

export const ActivityProvider = ({ children, initialProfileId = 'p1' }) => {
  const [profileId, setProfileIdState] = useState(initialProfileId);
  const [activities, setActivities] = useState([]);
  const [todayActivities, setTodayActivities] = useState([]);
  const [dailyProgress, setDailyProgress] = useState({ completed: 0, total: 4, percent: 0, isGoalReached: false });
  const [cognitiveScore, setCognitiveScore] = useState(88);
  const [metrics, setMetrics] = useState({ memoryScore: 86, attentionScore: 82, recallAccuracy: 92, responseTimeSec: '2.4', totalSessions: 5 });
  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const [caregiverSummary, setCaregiverSummary] = useState({
    familyAccuracy: 98,
    engagementMinutes: 24,
    todayActivitiesCount: 2,
    hasMildObservation: false,
    recentTimeline: []
  });
  const [performanceTier, setPerformanceTier] = useState('good');

  // Load and synchronize all reactive state derived from activityService
  const refreshActivities = useCallback((targetProfileId = profileId) => {
    const all = activityService.getActivities(targetProfileId);
    const today = activityService.getTodayActivities(targetProfileId);
    const progress = activityService.getDailyProgress(targetProfileId);
    const score = activityService.getCognitiveHealthScore(targetProfileId);
    const m = activityService.getCognitiveMetrics(targetProfileId);
    const trend = activityService.getWeeklyTrend(targetProfileId);
    const cgSummary = activityService.getCaregiverSummary(targetProfileId);
    const tier = activityService.getPerformanceTier(targetProfileId);

    setActivities(all);
    setTodayActivities(today);
    setDailyProgress(progress);
    setCognitiveScore(score);
    setMetrics(m);
    setWeeklyTrend(trend);
    setCaregiverSummary(cgSummary);
    setPerformanceTier(tier);
  }, [profileId]);

  // Initial load
  useEffect(() => {
    refreshActivities(profileId);
  }, [profileId, refreshActivities]);

  // Record a new activity and automatically trigger reactive state updates everywhere
  const logGameActivity = useCallback((activityData) => {
    const record = activityService.recordActivity(profileId, activityData);
    refreshActivities(profileId);
    return record;
  }, [profileId, refreshActivities]);

  // Switch patient profile
  const setProfileId = useCallback((newId) => {
    setProfileIdState(newId);
    refreshActivities(newId);
  }, [refreshActivities]);

  return (
    <ActivityContext.Provider
      value={{
        profileId,
        setProfileId,
        activities,
        todayActivities,
        dailyProgress,
        cognitiveScore,
        metrics,
        weeklyTrend,
        caregiverSummary,
        performanceTier,
        logGameActivity,
        refreshActivities
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};
