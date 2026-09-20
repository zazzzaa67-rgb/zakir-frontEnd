import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import ProfileSetupScreen from './screens/ProfileSetupScreen';
import HomeScreen from './screens/HomeScreen';
import SubjectsScreen from './screens/SubjectsScreen';
import LessonListScreen from './screens/LessonListScreen';
import AILessonScreen from './screens/AILessonScreen';
import VideoPlayerScreen from './screens/VideoPlayerScreen';
import LessonSummaryScreen from './screens/LessonSummaryScreen';
import QuizScreen from './screens/QuizScreen';
import HomeworkScreen from './screens/HomeworkScreen';
import MistakesScreen from './screens/MistakesScreen';
import GamificationScreen from './screens/GamificationScreen';
import CoinsScreen from './screens/CoinsScreen';
import StudyPlannerScreen from './screens/StudyPlannerScreen';
import ProScreen from './screens/ProScreen';
import ProDashboardScreen from './screens/ProDashboardScreen';
import ProfileScreen from './screens/ProfileScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import AuthScreen from './screens/AuthScreen';
import TeamScreen from './screens/TeamScreen';
import { restoreSession } from './lib/api';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    restoreSession().then((profile) => {
      if (profile) setIsAuthenticated(true);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">جاري التحميل...</div>;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 flex items-center justify-center">
        <div
          dir="rtl"
          className="relative bg-[#F0F4FF] overflow-hidden w-full h-[100dvh] md:w-[390px] md:h-[844px] md:rounded-[40px]"
          style={{ boxShadow: '0 0 0 8px #0f172a, 0 40px 80px rgba(0,0,0,0.6)' }}
        >
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/onboarding" element={<OnboardingScreen />} />
            <Route path="/auth" element={<AuthScreen />} />
            <Route path="/setup" element={<ProfileSetupScreen />} />
            <Route path="/teams" element={<TeamScreen />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/subjects" element={<SubjectsScreen />} />
            <Route path="/lesson-list/:subjectId" element={<LessonListScreen />} />
            {/* المسارات التي تتطلب parameters تصبح جزءاً من الـ URL بشكل دائم */}
            <Route path="/subjects/:subjectId/lessons" element={<LessonListScreen />} />
            <Route path="/ai-lesson/:lessonId" element={<AILessonScreen />} />
            <Route path="/video/:lessonId" element={<VideoPlayerScreen />} />
            <Route path="/summary/:lessonId" element={<LessonSummaryScreen />} />
            <Route path="/quiz/:lessonId" element={<QuizScreen />} />
            <Route path="/homework/:lessonId" element={<HomeworkScreen />} />
            
            <Route path="/mistakes" element={<MistakesScreen />} />
            <Route path="/gamification" element={<GamificationScreen />} />
            <Route path="/coins" element={<CoinsScreen />} />
            <Route path="/planner" element={<StudyPlannerScreen />} />
            <Route path="/pro" element={<ProScreen />} />
            <Route path="/pro-dashboard" element={<ProDashboardScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/notifications" element={<NotificationsScreen />} />
            
            {/* توجيه أي مسار غير معروف إلى الصفحة الرئيسية */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/"} replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}