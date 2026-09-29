const configuredApiUrl = import.meta.env.VITE_API_URL || 'https://zakir-backend.vercel.app/api';
const normalizedApiUrl = configuredApiUrl.replace(/\/$/, '').replace(/\/(?:api\/)+api$/i, '/api');
const API_URL = normalizedApiUrl.endsWith('/api')
  ? normalizedApiUrl
  : `${normalizedApiUrl}/api`;
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;
const SESSION_EXPIRES_AT_KEY = 'zakker_session_expires_at';

export type StudentProfile = {
  id: string;
  display_name: string;
  gender: 'boy' | 'girl';
  grade_level: 1 | 2 | 3;
  track_id: string;
  streak?: number;
  last_active_date?: string | null;
  points: number;
  coins: number;
  gems?: number;
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
  is_unlocked?: boolean;
  status?: string;
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

export type PublicSampleLesson = LessonDetails & {
  grade_level: 1 | 2 | 3;
  subject_title: string;
  book_title: string;
};

const PUBLIC_SAMPLE_CACHE_KEY = 'zakker_public_sample_lessons_v1';
const PUBLIC_SAMPLE_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
let publicSampleRequest: Promise<PublicSampleLesson[]> | null = null;

function readPublicSampleCache() {
  try {
    return JSON.parse(localStorage.getItem(PUBLIC_SAMPLE_CACHE_KEY) || 'null') as { savedAt: number; lessons: PublicSampleLesson[] } | null;
  } catch {
    return null;
  }
}

export function getCachedPublicSampleLessons() {
  return readPublicSampleCache()?.lessons ?? [];
}

export function getPublicSampleLessons(): Promise<PublicSampleLesson[]> {
  const cached = readPublicSampleCache();
  if (cached?.lessons.length && Date.now() - cached.savedAt < PUBLIC_SAMPLE_CACHE_TTL_MS) return Promise.resolve(cached.lessons);
  if (publicSampleRequest) return publicSampleRequest;
  publicSampleRequest = request<PublicSampleLesson[]>('/lessons/public-samples')
    .then((lessons) => {
      if (!Array.isArray(lessons)) throw new Error('Invalid public lessons response');
      if (lessons.length > 0) {
        try { localStorage.setItem(PUBLIC_SAMPLE_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), lessons })); } catch { /* Storage may be disabled or full. */ }
        return lessons;
      }
      return cached?.lessons.length ? cached.lessons : [];
    })
    .catch((error) => {
      if (cached?.lessons.length) return cached.lessons;
      throw error;
    })
    .finally(() => { publicSampleRequest = null; });
  return publicSampleRequest;
}

export function getAccessToken() {
  const expiresAt = Number(localStorage.getItem(SESSION_EXPIRES_AT_KEY));
  if (expiresAt && Date.now() >= expiresAt) {
    clearAuth();
    return null;
  }
  return localStorage.getItem('zakker_access_token');
}

export function clearAuth() {
  localStorage.removeItem('zakker_access_token');
  localStorage.removeItem('zakker_refresh_token');
  localStorage.removeItem('zakker_profile');
  localStorage.removeItem(SESSION_EXPIRES_AT_KEY);
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

function storeSession(result: { accessToken: string; refreshToken: string; profile: StudentProfile }, startNewSession = false) {
  if (startNewSession || !localStorage.getItem(SESSION_EXPIRES_AT_KEY)) {
    localStorage.setItem(SESSION_EXPIRES_AT_KEY, String(Date.now() + SESSION_DURATION_MS));
  }
  localStorage.setItem('zakker_access_token', result.accessToken);
  localStorage.setItem('zakker_refresh_token', result.refreshToken);
  localStorage.setItem('zakker_profile', JSON.stringify(result.profile));
}

export async function restoreSession() {
  const expiresAt = Number(localStorage.getItem(SESSION_EXPIRES_AT_KEY));
  if (expiresAt && Date.now() >= expiresAt) {
    clearAuth();
    return null;
  }
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
    const error = new Error(body.error ?? (responseText.trim() || `حصل خطأ من السيرفر (${response.status})`)) as Error & { status: number };
    error.status = response.status;
    throw error;
  }
  return body as T;
}

export async function signIn(email: string, password: string) {
  const result = await request<{ accessToken: string; refreshToken: string; profile: StudentProfile }>('/auth/signin', {
    method: 'POST', body: JSON.stringify({ email, password }),
  });
  storeSession(result, true);
  return result.profile;
}

export async function signUp(payload: { email: string; password: string; displayName: string; gender: string; gradeLevel: number; trackId: string }) {
  const result = await request<{ accessToken: string; refreshToken: string; profile: StudentProfile }>('/auth/signup', {
    method: 'POST', body: JSON.stringify(payload),
  });
  storeSession(result, true);
  return result.profile;
}

// دالة لجلب الكاش المحلي للمواد
const CURRICULUM_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function readCurriculumCache<T>(key: string): { data: T[]; savedAt: number } {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null');
    if (Array.isArray(value)) return { data: value as T[], savedAt: 0 };
    if (value && Array.isArray(value.data) && typeof value.savedAt === 'number') return value;
  } catch {
    // Ignore invalid or unavailable local storage data.
  }
  return { data: [], savedAt: 0 };
}

function writeCurriculumCache<T>(key: string, data: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, savedAt: Date.now() }));
  } catch (e) {
    console.error('Failed to cache curriculum data', e);
  }
}

function curriculumCacheIsFresh(savedAt: number) {
  return savedAt > 0 && Date.now() - savedAt < CURRICULUM_CACHE_TTL_MS;
}

export function getCachedSubjects(trackId?: string): Subject[] {
  if (!trackId) return [];
  return readCurriculumCache<Subject>(`zakker_cached_subjects_${encodeURIComponent(trackId)}`).data;
}

export function setCachedSubjects(trackId: string, subjects: Subject[]) {
  if (Array.isArray(subjects)) writeCurriculumCache(`zakker_cached_subjects_${encodeURIComponent(trackId)}`, subjects);
}

export async function getSubjectsByTrack(trackId: string, forceRefresh = false): Promise<Subject[]> {
  if (!trackId || trackId === 'undefined' || trackId === 'null') {
    console.error('❌ track_id غير صحيح أو غير موجود:', trackId);
    return [];
  }

  const cacheKey = `zakker_cached_subjects_${encodeURIComponent(trackId)}`;
  const cached = readCurriculumCache<Subject>(cacheKey);
  if (!forceRefresh && cached.data.length > 0 && curriculumCacheIsFresh(cached.savedAt)) return cached.data;

  try {
    const result = await request<Subject[]>(`/subjects?track_id=${encodeURIComponent(trackId)}`);
    if (Array.isArray(result)) {
      setCachedSubjects(trackId, result);
      return result;
    }
    return [];
  } catch (error) {
    console.error('❌ خطأ أثناء جلب المواد، يتم استخدام الكاش المحلي:', error);
    if (cached.data.length > 0) return cached.data;
    throw error;
  }
}

function lessonsCacheKey(subjectId: string, trackId?: string) {
  const studentId = getStoredProfile()?.id || 'anonymous';
  return `zakker_cached_lessons_${encodeURIComponent(studentId)}_${encodeURIComponent(trackId || 'shared')}_${encodeURIComponent(subjectId)}`;
}

export function getCachedLessons(subjectId: string, trackId?: string): ApiLesson[] {
  return readCurriculumCache<ApiLesson>(lessonsCacheKey(subjectId, trackId)).data;
}

export function setCachedLessons(subjectId: string, lessons: ApiLesson[], trackId?: string) {
  if (Array.isArray(lessons)) writeCurriculumCache(lessonsCacheKey(subjectId, trackId), lessons);
}

export async function getLessonsBySubject(subjectId: string, trackId?: string, forceRefresh = false): Promise<ApiLesson[]> {
  if (!subjectId) {
    console.error('❌ subject_id غير موجود');
    return [];
  }

  const cacheKey = lessonsCacheKey(subjectId, trackId);
  const cached = readCurriculumCache<ApiLesson>(cacheKey);
  if (!forceRefresh && cached.data.length > 0 && curriculumCacheIsFresh(cached.savedAt)) return cached.data;

  try {
    const query = new URLSearchParams({ subject_id: subjectId });
    if (trackId) query.set('track_id', trackId);

    const result = await request<ApiLesson[]>(`/lessons?${query.toString()}`);

    if (Array.isArray(result)) {
      setCachedLessons(subjectId, result, trackId);
      return result;
    }
    return [];
  } catch (error) {
    console.error('❌ خطأ في جلب الدروس، يتم الاعتماد على الكاش المحلي:', error);
    if (cached.data.length > 0) return cached.data;
    throw error;
  }
}

export async function getLessonById(lessonId: string): Promise<LessonDetails> {
  const publicSample = getCachedPublicSampleLessons().find((lesson) => lesson.id === lessonId);
  if (publicSample) return publicSample;
  const detailCacheKey = `zakker_cached_lesson_detail_${encodeURIComponent(lessonId)}`;
  const cachedDetail = readCurriculumCache<LessonDetails>(detailCacheKey);
  if (cachedDetail.data[0] && curriculumCacheIsFresh(cachedDetail.savedAt)) return cachedDetail.data[0];
  try {
    const serverLesson = await request<LessonDetails>(`/lessons/${encodeURIComponent(lessonId)}`);
    writeCurriculumCache(detailCacheKey, [serverLesson]);
    return serverLesson;
  } catch (error) {
    if (cachedDetail.data[0]) return cachedDetail.data[0];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('zakker_cached_lessons_')) {
        try {
          const cachedLessons = readCurriculumCache<any>(key).data;
          const found = cachedLessons.find((l) => l.id === lessonId || l.lesson_title === lessonId);
          
          if (found) {
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
    throw error;
  }
}

export async function askLessonAI(lessonId: string, message: string, history: Array<{ role: 'user' | 'model'; text: string }>) {
  return request<{ answer: string }>(`/lessons/${encodeURIComponent(lessonId)}/chat`, {
    method: 'POST',
    body: JSON.stringify({ message, history }),
  });
}

// ==========================================
// التعديلات الخاصة بالربط مع studentController
// ==========================================

// 1. جلب بيانات الطالب (تطابق مع الـ Backend route: /student/profile)
export async function getStudentProfile(userId?: string) {
  const path = userId ? `/student/profile/${encodeURIComponent(userId)}` : '/student/profile';
  return request<StudentProfile & { level: number; points_progress: { current: number; target: number; percentage: number } }>(
    path
  );
}

// 2. تحديث نتيجة الامتحان (تطابق مع الـ Backend route: /student/exam-result)
export async function submitExamResult(score: number, totalQuestions: number) {
  return request<{
    message: string;
    examResult: { score: number; totalQuestions: number; percentage: number };
    earned: { points: number; coins: number };
    profile: StudentProfile;
  }>(
    '/student/exam-result',
    {
      method: 'POST',
      body: JSON.stringify({ score, totalQuestions }),
    }
  );
}

export async function buyGem() {
  return request<{ coins: number; gems: number }>('/student/buy-gem', { method: 'POST' });
}

// 3. جلب الأخطاء الخاصة بالطالب (تطابق مع الـ Backend route: /student/errors)
export async function getStudentErrors(userId?: string) {
  const path = userId ? `/student/errors/${encodeURIComponent(userId)}` : '/student/errors';
  return request<Array<{ id: string; question_text?: string; user_answer?: string; correct_answer?: string; created_at?: string }>>(
    path
  );
}

// 4. جلب المتصدرين للطلاب (تطابق مع الـ Backend route: /student/leaderboard)
export async function getStudentLeaderboard() {
  return request<Array<{ rank: number; id: string; name: string; points: number; isMe: boolean }>>(
    '/student/leaderboard'
  );
}

export function updateStoredProfile(updatedFields: Partial<StudentProfile>): StudentProfile | null {
  const current = getStoredProfile();
  if (!current) return null;
  const newProfile = { ...current, ...updatedFields };
  localStorage.setItem('zakker_profile', JSON.stringify(newProfile));
  return newProfile;
}

export async function fetchAndUpdateProfile(): Promise<StudentProfile | null> {
  const current = getStoredProfile();
  if (!current?.id) return current;
  try {
    const updatedProfile = await getStudentProfile(current.id);
    if (updatedProfile) {
      localStorage.setItem('zakker_profile', JSON.stringify(updatedProfile));
      return updatedProfile;
    }
  } catch (error) {
    console.warn('⚠️ تعذر تحديث البروفايل من السيرفر، يتم الاعتماد على الكاش المحلي:', error);
  }
  return current;
}

export function checkAndIncrementAiLimit(): { allowed: boolean; remaining: number } {
  const MAX_DAILY = 5;
  const today = new Date().toISOString().split('T')[0];
  const storedData = localStorage.getItem('zakker_ai_usage');
  let usage = storedData ? JSON.parse(storedData) : { date: today, count: 0 };
  if (usage.date !== today) {
    usage = { date: today, count: 0 };
  }
  if (usage.count >= MAX_DAILY) {
    return { allowed: false, remaining: 0 };
  }
  usage.count += 1;
  localStorage.setItem('zakker_ai_usage', JSON.stringify(usage)); 
  return { allowed: true, remaining: MAX_DAILY - usage.count };
}

export async function getTeam() { return request<{ team: any; invitations: any[] }>('/teams'); }
export async function getInvitations() { return request<{ invitations: any[] }>('/teams/invitations'); }
export async function getLeaderboard() { return request<{ teams: any[] }>('/teams/leaderboard'); }
export async function createTeam(name: string) { return request<{ team: any }>('/teams', { method: 'POST', body: JSON.stringify({ name }) }); }
export async function respondToInvitation(id: string, action: 'accepted' | 'declined') { return request(`/teams/invitations/${id}/respond`, { method: 'POST', body: JSON.stringify({ action }) }); }
export async function searchStudents(query: string) { return request<{ students: any[] }>(`/teams/students?q=${encodeURIComponent(query)}`); }
export async function inviteStudent(teamId: string, inviteeId: string) { return request(`/teams/${teamId}/invitations`, { method: 'POST', body: JSON.stringify({ inviteeId }) }); }
