type QuizResult = {
  id: string;
  user_id: string;
  session_id: string;
  subtest_id: string;
  subtest_name: string;
  score: number;
  percentage: number;
  total_questions: number;
  correct_answers: number;
  total_time_seconds: number;
  average_time_per_question: number;
  completed_at: string;
  created_at: string;
};

type HistoryData = {
  results: QuizResult[];
  total_count: number;
  current_page: number;
  total_pages: number;
  limit: number;
};