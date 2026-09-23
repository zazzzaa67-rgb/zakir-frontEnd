const configuredApiUrl = import.meta.env.VITE_API_URL ?? 'https://zakir-backend.vercel.app/api';
const API_URL = configuredApiUrl.replace(/\/$/, '').endsWith('/api')
  ? configuredApiUrl.replace(/\/$/, '')
  : `${configuredApiUrl.replace(/\/$/, '')}/api`;

export type StudentProfile = {
  id: string;
  display_name: string;
  gender: 'boy' | 'girl';
  grade_level: 1 | 2 | 3;
  track_id: string;
  streak?: number;
  points: number;
  coins: number;
};

export type Subject = {
  id: string;
  title: string;
  grade?: string;
  grade_level?: number;
  is_required?: boolean;
  selection_group?: string | null;
  books?: Array<{ id: string; title: string; status: string; total_lessons_generated?: number }>;
};

export type ApiLesson = {
  id: string;
  subject_id: string;
  book_id: string;
  unit_title: string | null;
  chapter_name: string | null;
  lesson_title: string;
  difficulty: string;
  duration_minutes: number;
  points_reward: number;
  coins_cost: number;
  order_index: number;
  generation_status: string;
  is_unlocked?: boolean; // 👈 أضف هذا السطر
  status?: string;       // 👈 أضف هذا السطر
  books?: { id: string; title: string; source_url?: string | null; status: string };
};
export type LessonQuestion = {
  question?: string;
  options?: string[];
  correct_index?: number;
  explanation?: string;
};

export type LessonDetails = ApiLesson & {
  title?: string; 
  content_json: {
    pdf_summary_url?: string;
    summary?: string;
    detailed_explanation?: string;
    key_points?: string[];
    exam?: unknown[];
    homework?: unknown[];
    quiz?: LessonQuestion[];
  };
  books?: { id: string; title: string; source_url?: string | null; status: string };
};

export function getAccessToken() {
  return localStorage.getItem('zakker_access_token');
}

export function clearAuth() {
  localStorage.removeItem('zakker_access_token');
  localStorage.removeItem('zakker_refresh_token');
  localStorage.removeItem('zakker_profile');
}

export function getStoredProfile(): StudentProfile | null {
  const storedProfile = localStorage.getItem('zakker_profile');
  if (!storedProfile) return null;
  try {
    return JSON.parse(storedProfile) as StudentProfile;
  } catch {
    return null;
  }
}

function storeSession(result: { accessToken: string; refreshToken: string; profile: StudentProfile }) {
  localStorage.setItem('zakker_access_token', result.accessToken);
  localStorage.setItem('zakker_refresh_token', result.refreshToken);
  localStorage.setItem('zakker_profile', JSON.stringify(result.profile));
}

export async function restoreSession() {
  const refreshToken = localStorage.getItem('zakker_refresh_token');
  if (!refreshToken) return null;
  try {
    const result = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!result.ok) throw new Error('جلسة الدخول منتهية');
    const body = await result.json() as { accessToken: string; refreshToken: string; profile: StudentProfile };
    storeSession(body);
    return body.profile;
  } catch {
    clearAuth();
    return null;
  }
}

async function requestOnce<T>(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getAccessToken();
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
}
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response = await requestOnce(path, options);
  if (response.status === 401 && !path.startsWith('/auth/')) {
    const profile = await restoreSession();
    if (profile) response = await requestOnce(path, options);
  }
  const responseText = await response.text();
  let body: any = {};
  try {
    body = responseText ? JSON.parse(responseText) : {};
  } catch {
    body = {};
  }
  if (!response.ok) {
    throw new Error(body.error ?? (responseText.trim() || `حصل خطأ من السيرفر (${response.status})`));
  }
  return body as T;
}
export async function signIn(email: string, password: string) {
  const result = await request<{ accessToken: string; refreshToken: string; profile: StudentProfile }>('/auth/signin', {
    method: 'POST', body: JSON.stringify({ email, password }),
  });
  storeSession(result);
  return result.profile;
}

export async function signUp(payload: { email: string; password: string; displayName: string; gender: string; gradeLevel: number; trackId: string }) {
  const result = await request<{ accessToken: string; refreshToken: string; profile: StudentProfile }>('/auth/signup', {
    method: 'POST', body: JSON.stringify(payload),
  });
  storeSession(result);
  return result.profile;
}

// دالة لجلب الكاش المحلي للمواد
export function getCachedSubjects(): Subject[] {
  try {
    const cached = localStorage.getItem('zakker_cached_subjects');
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
}

// دالة لحفظ المواد في الكاش المحلي
export function setCachedSubjects(subjects: Subject[]) {
  try {
    if (Array.isArray(subjects) && subjects.length > 0) {
      localStorage.setItem('zakker_cached_subjects', JSON.stringify(subjects));
    }
  } catch (e) {
    console.error('Failed to cache subjects', e);
  }
}

// دالة جلب المواد من السيرفر مع دمج الكاش لتفادي الـ 404
export async function getSubjectsByTrack(trackId: string): Promise<Subject[]> {
  if (!trackId || trackId === 'undefined' || trackId === 'null') {
    console.error('❌ track_id غير صحيح أو غير موجود:', trackId);
    return getCachedSubjects();
  }

  try {
    // إرسال الطلب إلى الخادم
    const result = await request<Subject[]>(`/subjects?track_id=${encodeURIComponent(trackId)}`);
    
    console.log('✅ المواد المستقبلة من السيرفر:', result);

    if (Array.isArray(result) && result.length > 0) {
      // 1. تحديث الكاش تلقائياً فور نجاح الجلب
      setCachedSubjects(result);
      return result;
    }

    // إذا كانت النتيجة فارغة من السيرفر، نعيد الكاش القديم
    const cached = getCachedSubjects();
    return cached.length > 0 ? cached : [];

  } catch (error) {
    console.error('❌ خطأ أثناء جلب المواد، يتم استخدام الكاش المحلي:', error);
    
    // 2. عند فشل الاتصال بالسيرفر (404 / Connection Reset)، إرجاع الكاش بدلاً من رمي خطأ يمسح الشاشة
    const cached = getCachedSubjects();
    if (cached.length > 0) {
      return cached;
    }

    throw error;
  }
}
// 1. دوال مساعدة لحفظ وقراءة الكاش المحلي للدروس (تظل صالحة لمدة يومين)
export function getCachedLessons(subjectId: string): ApiLesson[] {
  try {
    const cached = localStorage.getItem(`zakker_cached_lessons_${subjectId}`);
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
}

export function setCachedLessons(subjectId: string, lessons: ApiLesson[]) {
  try {
    if (Array.isArray(lessons)) {
      localStorage.setItem(`zakker_cached_lessons_${subjectId}`, JSON.stringify(lessons));
      localStorage.setItem(`zakker_lessons_time_${subjectId}`, Date.now().toString());
    }
  } catch (e) {
    console.error('Failed to cache lessons', e);
  }
}

// 2. الدالة المُحدثة لجلب الدروس (مع الكاش ذو صلاحية اليومين وتوفير السيرفر)
export async function getLessonsBySubject(subjectId: string, trackId?: string): Promise<ApiLesson[]> {
  if (!subjectId) {
    console.error('❌ subject_id غير موجود');
    return [];
  }

  const cacheKey = `zakker_cached_lessons_${subjectId}`;
  const cacheTimeKey = `zakker_lessons_time_${subjectId}`;
  const cachedData = localStorage.getItem(cacheKey);
  const cachedTime = localStorage.getItem(cacheTimeKey);

  const now = Date.now();
  const twoDaysInMillis = 2 * 24 * 60 * 60 * 1000; // يومين بالمللي ثانية (48 ساعة)

  // لو البيانات مخزنة ولم يمضِ عليها يومان، نرجعها فوراً بدون أي طلب للسيرفر
  if (cachedData && cachedTime && (now - Number(cachedTime) < twoDaysInMillis)) {
    console.log('⚡ تم جلب الدروس من الكاش المحلي للمادة (بدون ضغط على السيرفر):', subjectId);
    const parsed = JSON.parse(cachedData);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  }

  try {
    const query = new URLSearchParams({ subject_id: subjectId });
    if (trackId) query.set('track_id', trackId);

    console.log('🌐 جاري جلب الدروس من السيرفر...');
    const result = await request<ApiLesson[]>(`/lessons?${query.toString()}`);

    if (Array.isArray(result) && result.length > 0) {
      setCachedLessons(subjectId, result);
      return result;
    }

    // لو السيرفر رجع مصفوفة فارغة، نحاول إرجاع الكاش القديم إن وجد كبديل آمن
    const cached = getCachedLessons(subjectId);
    return cached.length > 0 ? cached : [];

  } catch (error) {
    console.error('❌ خطأ في جلب الدروس، يتم الاعتماد على الكاش المحلي:', error);
    const cached = getCachedLessons(subjectId);
    if (cached.length > 0) {
      return cached;
    }
    throw error;
  }
}

export async function getLessonById(lessonId: string): Promise<LessonDetails> {
  try {
    // 1. محاولة جلب البيانات الحقيقية الكاملة من السيرفر
    const serverLesson = await request<LessonDetails>(`/lessons/${encodeURIComponent(lessonId)}`);
    return serverLesson;
  } catch (error) {
    console.warn(`⚠️ تعذر جلب الدرس (${lessonId}) من السيرفر، جاري استخراج البيانات والأسئلة الحقيقية من الكاش...`, error);

    // 2. البحث عن الدرس في الكاش المحلي لاستخراج الأسئلة الحقيقية المخزنة معه
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('zakker_cached_lessons_')) {
        try {
          const cachedLessons = JSON.parse(localStorage.getItem(key) || '[]') as any[];
          const found = cachedLessons.find((l) => l.id === lessonId || l.lesson_title === lessonId);
          
          if (found) {
            // استخدام الأسئلة الحقيقية المخزنة داخل content_json أو quiz أو homework أو exam
            const content = found.content_json || {};
            const realQuiz = content.quiz || content.exam || content.homework || found.quiz || [];

            return {
              ...found,
              content_json: {
                ...content,
                quiz: realQuiz,
              }
            };
          }
        } catch (e) {
          console.error('خطأ أثناء قراءة أسئلة الكاش:', e);
        }
      }
    }

    // إذا لم تتوفر أسئلة في الكاش أيضاً، يتم رفع الخطأ الأصلي لمعالجة الـ 404 في السيرفر
    throw error;
  }
}
export async function askLessonAI(lessonId: string, message: string, history: Array<{ role: 'user' | 'model'; text: string }>) {
  return request<{ answer: string }>(`/lessons/${encodeURIComponent(lessonId)}/chat`, {
    method: 'POST',
    body: JSON.stringify({ message, history }),
  });
}
// جلب بيانات الطالب (البروفايل، النقاط، المستويات، والـ Streak)
export async function getStudentProfile(userId: string) {
  return request<StudentProfile & { level: number; points_progress: { current: number; target: number; percentage: number } }>(
    `/students/profile/${encodeURIComponent(userId)}`
  );
}

// تحديث نتيجة الامتحان (النقاط، الـ Coins، والـ Streak)
export async function submitExamResult(userId: string, isPerfectScore: boolean) {
  return request<{ message: string; earned: { points: number; coins: number }; profile: StudentProfile }>(
    '/students/exam-result',
    {
      method: 'POST',
      body: JSON.stringify({ userId, isPerfectScore }),
    }
  );
}

// جلب الأخطاء الخاصة بالطالب (قسم الأخطاء)
export async function getStudentErrors(userId: string) {
  return request<Array<{ id: string; question_text?: string; user_answer?: string; correct_answer?: string; created_at?: string }>>(
    `/students/errors/${encodeURIComponent(userId)}`
  );
}

export async function getTeam() { return request<{ team: any; invitations: any[] }>('/teams'); }
export async function getInvitations() { return request<{ invitations: any[] }>('/teams/invitations'); }
export async function getLeaderboard() { return request<{ teams: any[] }>('/teams/leaderboard'); }
export async function createTeam(name: string) { return request<{ team: any }>('/teams', { method: 'POST', body: JSON.stringify({ name }) }); }
export async function respondToInvitation(id: string, action: 'accepted' | 'declined') { return request(`/teams/invitations/${id}/respond`, { method: 'POST', body: JSON.stringify({ action }) }); }
export async function searchStudents(query: string) { return request<{ students: any[] }>(`/teams/students?q=${encodeURIComponent(query)}`); }
export async function inviteStudent(teamId: string, inviteeId: string) { return request(`/teams/${teamId}/invitations`, { method: 'POST', body: JSON.stringify({ inviteeId }) }); }
