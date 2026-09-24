import { StudentProfile } from './api';

const PROFILE_KEY = 'zakker_profile';

export const getCachedProfile = (): StudentProfile | null => {
  const data = localStorage.getItem(PROFILE_KEY);
  if (!data) return null;
  
  try {
    const raw = JSON.parse(data);
    
    // معالجة واحتساب النقاط سواء كانت باسم points أو xp أو total_points
    const points = Number(raw.points ?? raw.xp ?? raw.total_points ?? raw.totalPoints ?? 0);
    const coins = Number(raw.coins ?? raw.total_coins ?? raw.totalCoins ?? 0);

    return {
      ...raw,
      points,
      coins,
    };
  } catch (e) {
    return null;
  }
};

export const setCachedProfile = (profile: StudentProfile) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  // إطلاق Event لتحديث React State فوراً
  window.dispatchEvent(new Event('profileUpdated'));
};

export const updateLocalPointsAndCoins = (addPoints: number, addCoins: number = 0) => {
  const current = getCachedProfile();
  if (!current) return;

  const updatedProfile: StudentProfile = {
    ...current,
    points: (Number(current.points) || 0) + addPoints,
    coins: (Number(current.coins) || 0) + addCoins,
  };

  setCachedProfile(updatedProfile);
};