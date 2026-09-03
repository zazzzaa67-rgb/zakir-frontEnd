import { useState } from 'react';
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
import MistakesScreen from './screens/MistakesScreen';
import GamificationScreen from './screens/GamificationScreen';
import CoinsScreen from './screens/CoinsScreen';
import StudyPlannerScreen from './screens/StudyPlannerScreen';
import ProScreen from './screens/ProScreen';
import ProDashboardScreen from './screens/ProDashboardScreen';
import ProfileScreen from './screens/ProfileScreen';
import NotificationsScreen from './screens/NotificationsScreen';

export type AppScreen =
  | 'splash' | 'onboarding' | 'setup'
  | 'home' | 'subjects' | 'lesson_list'
  | 'ai_lesson' | 'video' | 'summary' | 'quiz'
  | 'mistakes' | 'gamification' | 'coins'
  | 'planner' | 'pro' | 'pro_dashboard'
  | 'profile' | 'notifications';

export interface NavProps {
  navigate: (screen: AppScreen, params?: Record<string, unknown>) => void;
  params?: Record<string, unknown>;
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('splash');
  const [params, setParams] = useState<Record<string, unknown>>({});

  const navigate = (s: AppScreen, p?: Record<string, unknown>) => {
    setScreen(s);
    setParams(p ?? {});
  };

  const props: NavProps = { navigate, params };

  const renderScreen = () => {
    switch (screen) {
      case 'splash': return <SplashScreen {...props} />;
      case 'onboarding': return <OnboardingScreen {...props} />;
      case 'setup': return <ProfileSetupScreen {...props} />;
      case 'home': return <HomeScreen {...props} />;
      case 'subjects': return <SubjectsScreen {...props} />;
      case 'lesson_list': return <LessonListScreen {...props} />;
      case 'ai_lesson': return <AILessonScreen {...props} />;
      case 'video': return <VideoPlayerScreen {...props} />;
      case 'summary': return <LessonSummaryScreen {...props} />;
      case 'quiz': return <QuizScreen {...props} />;
      case 'mistakes': return <MistakesScreen {...props} />;
      case 'gamification': return <GamificationScreen {...props} />;
      case 'coins': return <CoinsScreen {...props} />;
      case 'planner': return <StudyPlannerScreen {...props} />;
      case 'pro': return <ProScreen {...props} />;
      case 'pro_dashboard': return <ProDashboardScreen {...props} />;
      case 'profile': return <ProfileScreen {...props} />;
      case 'notifications': return <NotificationsScreen {...props} />;
      default: return <HomeScreen {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 flex items-center justify-center">
      <div
        dir="rtl"
        className="relative bg-[#F0F4FF] overflow-hidden w-full h-[100dvh] md:w-[390px] md:h-[844px] md:rounded-[40px]"
        style={{ boxShadow: '0 0 0 8px #0f172a, 0 40px 80px rgba(0,0,0,0.6)' }}
      >
        {renderScreen()}
      </div>
    </div>
  );
}
