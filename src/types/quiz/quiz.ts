export type QuizQuestion = {
  question_number: number;
  question_text: string;
  options: string[];
};

export type ActiveQuiz = {
  session_id: string;
  subtest_name: string;
  questions: QuizQuestion[];
  expires_at: string;
};
