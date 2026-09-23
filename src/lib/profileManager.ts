import { StudentProfile, getStudentProfile } from './api';
const PROFILE_KEY = 'zakker_profile';
// 1. جلب البيانات من LocalStorage فوراً (سريع جداً)
export const getCachedProfile = (): StudentProfile | null => {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
};

// 2. تحديث LocalStorage
export const setCachedProfile = (profile: StudentProfile) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  // إطلاق الحدث لتحديث كل الشاشات المفتوحة في نفس الوقت
    window.dispatchEvent(new Event('profileUpdated'));
};

// 3. تحديث نقاط الطالب محلياً وفورياً عند كسب نقاط أو coins
export const updateLocalPointsAndCoins = (addPoints: number, addCoins: number = 0) => {
    const current = getCachedProfile();
    if (!current) return;

    const updatedProfile: StudentProfile = {
    ...current,
    points: (current.points || 0) + addPoints,
    coins: (current.coins || 0) + addCoins,
    };
  // حفظ التعديل محلياً فوراً لتحديث الشاشة
  setCachedProfile(updatedProfile);
};