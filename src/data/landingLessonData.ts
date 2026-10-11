import lessonDetails from './landingLessonDetails.json';

export interface LandingQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation?: string;
}

export interface LandingLessonDetail {
  id: string;
  lesson_title: string;
  unit_title: string;
  grade_level: number;
  subject_title: string;
  book_title: string;
  pdf_url: string | null;
  content_json: {
    detailed_explanation?: string;
    summary?: string;
    key_points?: string[];
    homework?: LandingQuestion[];
    exam?: LandingQuestion[];
    quiz?: LandingQuestion[];
    pdf_summary_url?: string;
  };
}

export const landingLessonDetails = lessonDetails as LandingLessonDetail[];
