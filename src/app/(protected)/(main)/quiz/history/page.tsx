"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingData from "@/components/common/LoadingData";
import { useQuizHistory } from "@/hooks/use-quiz-history";
import { HistoryList } from "@/components/quiz/history/HistoryList";
import { HistoryPagination } from "@/components/quiz/history/HistoryPagination";
import { HistoryEmptyState } from "@/components/quiz/history/HistoryEmpty";

export default function QuizHistoryPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const router = useRouter();

  const { historyData, isLoading } = useQuizHistory({ limit, page });

  const handleViewDetail = (sessionId: string) => {
    router.push(`/quiz/detail/${sessionId}`);
  };

  const handleStartQuiz = () => {
    router.push("/dashboard");
  };

  if (isLoading) {
    return <LoadingData data="riwayat quiz" />;
  }

  const hasResults =
    historyData && historyData.results && historyData.results.length > 0;

  return (
    <div className="min-h-screen">
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#012F61] mb-2">
            Riwayat Quiz
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Lihat semua hasil quiz yang telah kamu kerjakan
          </p>
        </div>

        {/* Empty State */}
        {!hasResults ? (
          <HistoryEmptyState onStartQuiz={handleStartQuiz} />
        ) : (
          <>
            <HistoryList
              results={historyData.results}
              onViewDetail={handleViewDetail}
            />

            <HistoryPagination
              currentPage={historyData.current_page}
              totalPages={historyData.total_pages}
              totalCount={historyData.total_count}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          </>
        )}
      </div>
    </div>
  );
}
