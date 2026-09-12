const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

export type StudentProfile = {
  id: string;
  display_name: string;
  gender: 'boy' | 'girl';
  grade_level: 1 | 2 | 3;
  track_id: string;
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
};

export type LessonDetails = ApiLesson & {
  content_json: {
    summary?: string;
    detailed_explanation?: string;
    key_points?: string[];
    exam?: unknown[];
    homework?: unknown[];
    quiz?: unknown[];
  };
};

export function getAccessToken() {
  return localStorage.getItem('zakker_access_token');
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

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  const responseText = await response.text();
  let body: { error?: string } = {};
  try {
    body = responseText ? JSON.parse(responseText) : {};
  } catch {
    body = {};
  }
  if (!response.ok) throw new Error(body.error ?? (responseText.trim() || `حصل خطأ من السيرفر (${response.status})`));
  return body as T;
}

export async function signIn(email: string, password: string) {
  const result = await request<{ accessToken: string; profile: StudentProfile }>('/auth/signin', {
    method: 'POST', body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('zakker_access_token', result.accessToken);
  localStorage.setItem('zakker_profile', JSON.stringify(result.profile));
  return result.profile;
}

export async function signUp(payload: { email: string; password: string; displayName: string; gender: string; gradeLevel: number; trackId: string }) {
  const result = await request<{ accessToken: string; profile: StudentProfile }>('/auth/signup', {
    method: 'POST', body: JSON.stringify(payload),
  });
  localStorage.setItem('zakker_access_token', result.accessToken);
  localStorage.setItem('zakker_profile', JSON.stringify(result.profile));
  return result.profile;
}

export async function getSubjectsByTrack(trackId: string) {
  return request<Subject[]>(`/subjects?track_id=${encodeURIComponent(trackId)}`);
}

export async function getLessonsBySubject(subjectId: string, trackId?: string) {
  const query = new URLSearchParams({ subject_id: subjectId });
  if (trackId) query.set('track_id', trackId);
  return request<ApiLesson[]>(`/lessons?${query.toString()}`);
}

export async function getLessonById(lessonId: string) {
  return request<LessonDetails>(`/lessons/${encodeURIComponent(lessonId)}`);
}

export async function getTeam() { return request<{ team: any; invitations: any[] }>('/teams'); }
export async function getInvitations() { return request<{ invitations: any[] }>('/teams/invitations'); }
export async function getLeaderboard() { return request<{ teams: any[] }>('/teams/leaderboard'); }
export async function createTeam(name: string) { return request<{ team: any }>('/teams', { method: 'POST', body: JSON.stringify({ name }) }); }
export async function respondToInvitation(id: string, action: 'accepted' | 'declined') { return request(`/teams/invitations/${id}/respond`, { method: 'POST', body: JSON.stringify({ action }) }); }
export async function searchStudents(query: string) { return request<{ students: any[] }>(`/teams/students?q=${encodeURIComponent(query)}`); }
export async function inviteStudent(teamId: string, inviteeId: string) { return request(`/teams/${teamId}/invitations`, { method: 'POST', body: JSON.stringify({ inviteeId }) }); }
