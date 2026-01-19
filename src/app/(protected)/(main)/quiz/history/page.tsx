"use client";
import { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  Trophy,
  Calendar,
  TrendingUp,
  BarChart3,
  Eye,
  ClipboardX,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { formatDate } from "@/lib/helper/formatDate";
import { formatTime } from "@/lib/helper/formatTime";
import { ApiResponse } from "@/types/common/apiResponse";

import { useRouter } from "next/navigation";
import { HistoryData } from "@/types/quiz/quizHistory";
import LoadingData from "@/components/common/LoadingData";

export default function QuizHistoryPage() {
  const [historyData, setHistoryData] = useState<HistoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const offset = (page - 1) * limit;

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/quiz/history?limit=${limit}&offset=${offset}`,
      );
      const json: ApiResponse<HistoryData> = await res.json();
      setHistoryData(json.data);
      console.log(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, limit]);

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (percentage >= 60) return "text-[#012F61] bg-[#012F61]/10 border-[#012F61]/20";
    if (percentage >= 40) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-red-700 bg-red-50 border-red-200";
  };

  const getScoreBadgeColor = (percentage: number) => {
    if (percentage >= 80) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (percentage >= 60) return "bg-[#012F61]/10 text-[#012F61] border-[#012F61]/20";
    if (percentage >= 40) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  const router = useRouter();
  
  const handleViewDetail = (sessionId: string) => {
    router.push(`/quiz/detail/${sessionId}`);
  };

  if (isLoading) {
    return <LoadingData data="riwayat quiz" />;
  }

  const hasResults = historyData && historyData.results && historyData.results.length > 0;

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
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="py-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#E95B0F]/10 to-[#012F61]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardX className="w-10 h-10 text-[#E95B0F]" />
              </div>
              <h3 className="text-xl font-bold text-[#012F61] mb-2">
                Belum Ada Riwayat
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Kamu belum menyelesaikan quiz apapun. Mulai kerjakan quiz untuk melihat riwayatmu di sini!
              </p>
              <Button
                onClick={() => router.push("/dashboard")}
                className="bg-[#E95B0F] hover:bg-[#E95B0F]/90 text-white font-semibold"
              >
                Mulai Quiz
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {historyData.results.map((result) => (
              <Card
                key={result.id}
                className="border border-gray-200 hover:shadow-md transition-all duration-200"
              >
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
                            {result.correct_answers}/{result.total_questions}{" "}
                            benar
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
                          onClick={() => handleViewDetail(result.session_id)}
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
            ))}
          </div>
        )}

        {/* Pagination */}
        {hasResults && (
          <div className="mt-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">Tampilkan</span>
                <Select
                  value={limit.toString()}
                  onValueChange={(value) => {
                    setLimit(Number(value));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[75px] h-10 border border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600 font-medium">per halaman</span>
              </div>

              <div className="text-sm text-gray-600 font-medium">
                Halaman {historyData.current_page} dari{" "}
                {historyData.total_pages} • Total {historyData.total_count}{" "}
                hasil
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="h-10 px-4 border border-gray-300 hover:bg-[#E95B0F]/10 hover:text-[#E95B0F] hover:border-[#E95B0F] disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400 disabled:hover:border-gray-300 font-medium"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center justify-center px-4 h-10 bg-[#012F61]/5 border border-[#012F61]/20 rounded-md min-w-[100px]">
                <span className="text-sm font-semibold text-[#012F61]">
                  {historyData.current_page} / {historyData.total_pages}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === historyData.total_pages}
                className="h-10 px-4 border border-gray-300 hover:bg-[#E95B0F]/10 hover:text-[#E95B0F] hover:border-[#E95B0F] disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400 disabled:hover:border-gray-300 font-medium"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}