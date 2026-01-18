import { ActiveQuiz } from "../../types/quiz/quiz";

export const buildFinalAnswers = (
  quiz: ActiveQuiz,
  answers: Record<number, string>
): Record<number, string> => {
  const finalAnswers: Record<number, string> = {};

  quiz.questions.forEach((q) => {
    finalAnswers[q.question_number] =
      answers[q.question_number] ?? "";
  });

  return finalAnswers;
};