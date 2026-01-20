import { QuizResult } from "@/types/quiz/quizHistory";
import { HistoryCard } from "./HistoryCard";


interface HistoryListProps {
  results: QuizResult[];
  onViewDetail: (sessionId: string) => void;
}

export function HistoryList({ results, onViewDetail }: HistoryListProps) {
  return (
    <div className="space-y-4">
      {results.map((result) => (
        <HistoryCard
          key={result.id}
          result={result}
          onViewDetail={onViewDetail}
        />
      ))}
    </div>
  );
}
