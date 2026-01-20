import { useState, useEffect } from "react";
import { ApiResponse } from "@/types/common/apiResponse";
import { HistoryData } from "@/types/quiz/quizHistory";

interface UseQuizHistoryProps {
  limit: number;
  page: number;
}

export function useQuizHistory({ limit, page }: UseQuizHistoryProps) {
  const [historyData, setHistoryData] = useState<HistoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const offset = (page - 1) * limit;

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/quiz/history?limit=${limit}&offset=${offset}`,
      );
      const json: ApiResponse<HistoryData> = await res.json();
      setHistoryData(json.data);
    } catch (e) {
      console.error(e);
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, limit]);

  return {
    historyData,
    isLoading,
    error,
    refetch: fetchHistory,
  };
}
