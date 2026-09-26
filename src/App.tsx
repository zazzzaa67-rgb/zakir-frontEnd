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
import ArticlesScreen from './screens/ArticlesScreen';
import PrivacyPolicy from './screens/PrivacyPolicy';
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
      <div className="app-viewport min-h-dvh bg-[#F0F4FF]">
        <div dir="rtl" className="relative h-[100dvh] w-full overflow-hidden bg-[#F0F4FF]">
          <div className="app-route-content h-full w-full lg:pl-24">
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <SplashScreen />} />
            <Route path="/onboarding" element={<OnboardingScreen />} />
            <Route path="/auth" element={<AuthScreen />} />
            <Route path="/setup" element={<ProfileSetupScreen />} />
            <Route path="/teams" element={<TeamScreen />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/articles" element={<ArticlesScreen />} />
            <Route path="/articles/:articleId" element={<ArticlesScreen />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/subjects" element={<SubjectsScreen />} />
            <Route path="/lesson-list/:subjectId" element={<LessonListScreen />} />
            {/* المسارات التي تتطلب parameters تصبح جزءاً من الـ URL بشكل دائم */}
            <Route path="/subjects/:subjectId/lessons" element={<LessonListScreen />} />
            <Route path="/ai-lesson/:lessonId" element={<AILessonScreen />} />
            <Route path="/video/:lessonId" element={<VideoPlayerScreen />} />
            <Route path="/summary/:lessonId" element={<LessonSummaryScreen />} />
            {/* مسارات الواجب والامتحان بدعم الـ URL ومسارات بدون URL (عبر الـ state) */}
            <Route path="/quiz" element={<QuizScreen />} />
            <Route path="/quiz/:lessonId" element={<QuizScreen />} />

            <Route path="/homework" element={<HomeworkScreen />} />
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
      </div>
    </BrowserRouter>
  );
}
