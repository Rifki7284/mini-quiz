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
import LoadingHistoryQuiz from "@/components/quiz/LoadingHistoryQuiz";

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
        { method: "GET" },
      );

      const json: ApiResponse<HistoryData> = await res.json();
      setHistoryData(json.data);
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
    if (percentage >= 80) return "text-green-600 bg-green-50";
    if (percentage >= 60) return "text-blue-600 bg-blue-50";
    if (percentage >= 40) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getScoreBadgeColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-50 text-green-700";
    if (percentage >= 60) return "bg-blue-50 text-blue-700";
    if (percentage >= 40) return "bg-yellow-50 text-yellow-700";
    return "bg-red-50 text-red-700";
  };

  const handleViewDetail = (sessionId: string) => {
    window.location.href = `/quiz/result/${sessionId}`;
  };

  if (isLoading) {
    return <LoadingHistoryQuiz />;
  }

  return (
    <div className="min-h-screen">
      <div>
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Riwayat Quiz
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Lihat semua hasil quiz yang telah kamu kerjakan
          </p>
        </div>
        {historyData && historyData.results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <Card className="border">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Quiz</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {historyData.total_count}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Rata-rata Skor</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(
                        historyData.results.reduce(
                          (sum, r) => sum + r.percentage,
                          0,
                        ) / historyData.results.length,
                      )}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Trophy className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Skor Tertinggi</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.max(
                        ...historyData.results.map((r) => r.percentage),
                      )}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {!historyData || historyData.results.length === 0 ? (
          <Card className="border">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Belum Ada Riwayat
              </h3>
              <p className="text-sm text-gray-500">
                Kamu belum menyelesaikan quiz apapun
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {historyData.results.map((result) => (
              <Card
                key={result.id}
                className="border hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-2.5 bg-blue-50 rounded-lg shrink-0">
                          <BarChart3 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
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
                          <CheckCircle className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {result.correct_answers}/{result.total_questions}{" "}
                            benar
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {formatTime(result.total_time_seconds)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex items-center justify-center w-24 h-24 rounded-xl ${getScoreColor(result.percentage)}`}
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
                          className={`${getScoreBadgeColor(result.percentage)} hover:${getScoreBadgeColor(result.percentage)} px-3 py-1.5 text-sm font-medium`}
                        >
                          {result.score} poin
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetail(result.session_id)}
                          className="h-9 text-sm hover:bg-gray-50"
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
        {historyData && (
          <div className="mt-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Tampilkan</span>
                <Select
                  value={limit.toString()}
                  onValueChange={(value) => {
                    setLimit(Number(value));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[75px] h-10 border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">per halaman</span>
              </div>

              <div className="text-sm text-gray-600">
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
                className="h-10 px-4 border"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center justify-center px-4 h-10 bg-gray-50 border rounded-md min-w-[100px]">
                <span className="text-sm font-medium text-gray-700">
                  {historyData.current_page} / {historyData.total_pages}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === historyData.total_pages}
                className="h-10 px-4 border"
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
