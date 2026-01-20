"use client";
import {
  Award,
} from "lucide-react";
import { formatDate } from "@/lib/helper/formatDate";
import { useParams, useRouter } from "next/navigation";
import LoadingData from "@/components/common/LoadingData";
import { getPerformanceLevel } from "@/lib/helper/quizResult";
import { useQuizResult } from "@/hooks/use-quiz-result";
import { ResultScore } from "@/components/quiz/detail/ResultScore";
import { ResultStats } from "@/components/quiz/detail/ResultStats";
import { ResultDetailInfo } from "@/components/quiz/detail/ResultDetailInfo";
import { ResultActions } from "@/components/quiz/detail/ResultAction";
import { formatTime } from "@/lib/helper/formatTime";

const QuizResultDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { result, isLoading } = useQuizResult(slug);

  const handleDashboardClick = () => router.push("/dashboard");
  const handleHistoryClick = () => router.push("/quiz/history");

  if (isLoading) {
    return <LoadingData data="Hasil Quiz" />;
  }

  if (!result) {
    return null;
  }

  const performance = getPerformanceLevel(result.percentage);

  return (
    <div className="min-h-screen">
      <div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-[#012F61] px-6 sm:px-8 py-8 sm:py-10 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-blue-200 text-sm mb-2 font-medium">
                  Hasil Quiz
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  {result.subtest_name}
                </h1>
                <p className="text-blue-200 text-sm">
                  {formatDate(result.completed_at)}
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3">
                <Award className="w-8 h-8" />
              </div>
            </div>
          </div>
          <div className="px-6 sm:px-8 py-8 border-b border-gray-100">
            <ResultScore
              percentage={result.percentage}
              correctAnswers={result.correct_answers}
              totalQuestions={result.total_questions}
              performance={performance}
            />

            <ResultStats
              score={result.score}
              totalTime={formatTime(result.total_time_seconds)}
              averageTimePerQuestion={result.average_time_per_question}
            />
          </div>

          <ResultDetailInfo completedAt={formatDate(result.completed_at)} />

          <ResultActions
            onDashboardClick={handleDashboardClick}
            onHistoryClick={handleHistoryClick}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizResultDetail;
