import { Target, Clock, TrendingUp } from "lucide-react";

interface ResultStatsProps {
  score: number;
  totalTime: string;
  averageTimePerQuestion: number;
}

export function ResultStats({
  score,
  totalTime,
  averageTimePerQuestion,
}: ResultStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-[#E95B0F]/5 rounded-xl p-5 border border-[#E95B0F]/20">
        <div className="flex items-center gap-2 text-[#E95B0F] mb-2">
          <Target className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            Total Skor
          </span>
        </div>
        <p className="text-3xl font-bold text-[#012F61]">
          {score}
        </p>
      </div>

      <div className="bg-[#012F61]/5 rounded-xl p-5 border border-[#012F61]/20">
        <div className="flex items-center gap-2 text-[#012F61] mb-2">
          <Clock className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            Waktu Total
          </span>
        </div>
        <p className="text-3xl font-bold text-[#012F61]">
          {totalTime}
        </p>
      </div>

      <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
        <div className="flex items-center gap-2 text-emerald-600 mb-2">
          <TrendingUp className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            Rata-rata/Soal
          </span>
        </div>
        <p className="text-3xl font-bold text-[#012F61]">
          {averageTimePerQuestion}s
        </p>
      </div>
    </div>
  );
}
