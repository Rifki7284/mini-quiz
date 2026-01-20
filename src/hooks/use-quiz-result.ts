import { useState, useEffect } from "react";
import { ApiResponse } from "@/types/common/apiResponse";
import { QuizResult } from "@/types/quiz/quizHistory";
import { QuizResultDetailResponse } from "@/types/quiz/quizDetail";

export function useQuizResult(slug: string | undefined) {
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) return;

    const getResult = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`/api/quiz/result/${slug}`);
        const json: ApiResponse<QuizResultDetailResponse> = await res.json();
        setResult(json.data.result);
      } catch (err) {
        console.error(err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    getResult();
  }, [slug]);

  return { result, isLoading, error };
}
