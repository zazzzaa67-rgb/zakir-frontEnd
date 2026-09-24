export interface StoredMistake {
  id: string;
  subject: string;
  lesson: string;
  question: string;
  yourAnswer: string;
  correct: string;
  date: string;
}

export interface StudyNote {
  id: string;
  subject: string;
  content: string;
  date: string;
}

function getUserStorageKey(kind: 'mistakes' | 'notes') {
  try {
    const profile = JSON.parse(localStorage.getItem('zakker_profile') || 'null');
    return `zakker_${kind}_${profile?.id || 'guest'}`;
  } catch {
    return `zakker_${kind}_guest`;
  }
}

function readList<T>(key: string): T[] {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function getStoredMistakes(): StoredMistake[] {
  return readList<StoredMistake>(getUserStorageKey('mistakes'));
}

export function recordMistake(mistake: Omit<StoredMistake, 'id' | 'date'>) {
  try {
    const key = getUserStorageKey('mistakes');
    const mistakes = readList<StoredMistake>(key);
    mistakes.unshift({ ...mistake, id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, date: new Date().toLocaleDateString() });
    localStorage.setItem(key, JSON.stringify(mistakes));
  } catch (error) {
    console.warn('Could not save mistake locally:', error);
  }
}

export function getStoredNotes(): StudyNote[] {
  return readList<StudyNote>(getUserStorageKey('notes'));
}

export function addStudyNote(subject: string, content: string) {
  try {
    const key = getUserStorageKey('notes');
    const notes = readList<StudyNote>(key);
    notes.unshift({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, subject, content, date: new Date().toLocaleDateString() });
    localStorage.setItem(key, JSON.stringify(notes));
  } catch (error) {
    console.warn('Could not save study note locally:', error);
  }
}

export function deleteStudyNote(id: string) {
  try {
    const key = getUserStorageKey('notes');
    localStorage.setItem(key, JSON.stringify(readList<StudyNote>(key).filter((note) => note.id !== id)));
  } catch (error) {
    console.warn('Could not delete study note locally:', error);
  }
}
