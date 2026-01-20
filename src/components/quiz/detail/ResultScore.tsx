import { CheckCircle } from "lucide-react";
import { PerformanceLevel } from "@/types/quiz/quizHistory";

interface ResultScoreProps {
  percentage: number;
  correctAnswers: number;
  totalQuestions: number;
  performance: PerformanceLevel;
}

export function ResultScore({
  percentage,
  correctAnswers,
  totalQuestions,
  performance,
}: ResultScoreProps) {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
        <CheckCircle className="w-11 h-11 text-emerald-600" />
      </div>
      <div className="mb-3">
        <span className="text-6xl font-bold text-[#012F61]">
          {percentage}
        </span>
        <span className="text-3xl text-gray-500">%</span>
      </div>
      <div
        className={`inline-block px-5 py-2 rounded-full ${performance.bg} border ${performance.border} mb-4`}
      >
        <span className={`text-sm font-semibold ${performance.color}`}>
          {performance.text}
        </span>
      </div>
      <p className="text-gray-600">
        {correctAnswers} dari {totalQuestions} soal dijawab benar
      </p>
    </div>
  );
}