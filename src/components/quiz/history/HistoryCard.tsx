import {
  Clock,
  CheckCircle,
  Calendar,
  BarChart3,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizResult } from "@/types/quiz/quizHistory";
import { formatDate } from "@/lib/helper/formatDate";
import { formatTime } from "@/lib/helper/formatTime";
import { getScoreBadgeColor, getScoreColor } from "@/lib/helper/quizHistoryHelper";


interface HistoryCardProps {
  result: QuizResult;
  onViewDetail: (sessionId: string) => void;
}

export function HistoryCard({ result, onViewDetail }: HistoryCardProps) {
  return (
    <Card className="border border-gray-200 hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Section */}
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2.5 bg-[#E95B0F]/10 rounded-lg shrink-0">
                <BarChart3 className="w-5 h-5 text-[#E95B0F]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-[#012F61] mb-2">
                  {result.subtest_name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(result.completed_at)}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-gray-600 font-medium">
                  {result.correct_answers}/{result.total_questions} benar
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#012F61]" />
                <span className="text-gray-600 font-medium">
                  {formatTime(result.total_time_seconds)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center justify-center w-24 h-24 rounded-xl border-2 ${getScoreColor(result.percentage)}`}
            >
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {result.percentage}
                </div>
                <div className="text-xs font-medium mt-0.5">%</div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Badge
                className={`${getScoreBadgeColor(result.percentage)} hover:${getScoreBadgeColor(result.percentage)} px-3 py-1.5 text-sm font-semibold border`}
              >
                {result.score} poin
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetail(result.session_id)}
                className="h-9 text-sm hover:bg-[#E95B0F]/10 hover:text-[#E95B0F] hover:border-[#E95B0F] transition-colors font-medium"
              >
                <Eye className="w-4 h-4 mr-2" />
                Lihat Detail
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
