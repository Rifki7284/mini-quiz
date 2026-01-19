"use client";
import { useEffect, useState } from "react";
import { CheckCircle, Clock, Target, TrendingUp, Award, Home, FileText } from "lucide-react";
import { PerformanceLevel, QuizResult } from "@/types/quiz/quizHistory";
import { formatDate } from "@/lib/helper/formatDate";
import { useParams, useRouter } from "next/navigation";
import { ApiResponse } from "@/types/common/apiResponse";
import { QuizResultDetailResponse } from "@/types/quiz/quizDetail";
import LoadingData from "@/components/common/LoadingData";

const QuizResultDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    if (!slug) return;

    const getResult = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/quiz/result/${slug}`);
        const json: ApiResponse<QuizResultDetailResponse> = await res.json();
        setResult(json.data.result);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    getResult();
  }, [slug]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getPerformanceLevel = (percentage: number): PerformanceLevel => {
    if (percentage === 100)
      return {
        text: "Sempurna",
        color: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
      };
    if (percentage >= 80)
      return {
        text: "Sangat Baik",
        color: "text-[#012F61]",
        bg: "bg-[#012F61]/10",
        border: "border-[#012F61]/20",
      };
    if (percentage >= 60)
      return {
        text: "Baik",
        color: "text-[#E95B0F]",
        bg: "bg-[#E95B0F]/10",
        border: "border-[#E95B0F]/20",
      };
    if (percentage >= 40)
      return {
        text: "Cukup",
        color: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
      };
    return {
      text: "Perlu Ditingkatkan",
      color: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
    };
  };

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
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <span 
            className="hover:text-[#E95B0F] cursor-pointer transition-colors"
            onClick={() => router.push('/quiz/history')}
          >
            Riwayat Quiz
          </span>
          <span>›</span>
          <span className="text-[#012F61] font-medium">Detail Hasil</span>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-[#012F61] px-6 sm:px-8 py-8 sm:py-10 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-blue-200 text-sm mb-2 font-medium">Hasil Quiz</p>
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

          {/* Score Section */}
          <div className="px-6 sm:px-8 py-8 border-b border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
                <CheckCircle className="w-11 h-11 text-emerald-600" />
              </div>
              <div className="mb-3">
                <span className="text-6xl font-bold text-[#012F61]">
                  {result.percentage}
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
                {result.correct_answers} dari {result.total_questions} soal
                dijawab benar
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#E95B0F]/5 rounded-xl p-5 border border-[#E95B0F]/20">
                <div className="flex items-center gap-2 text-[#E95B0F] mb-2">
                  <Target className="w-5 h-5" />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Total Skor
                  </span>
                </div>
                <p className="text-3xl font-bold text-[#012F61]">
                  {result.score}
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
                  {formatTime(result.total_time_seconds)}
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
                  {result.average_time_per_question}s
                </p>
              </div>
            </div>
          </div>

          {/* Detail Information */}
          <div className="px-6 sm:px-8 py-6">
            <h2 className="text-lg font-bold text-[#012F61] mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#E95B0F]" />
              Detail Informasi
            </h2>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">Waktu Selesai</span>
                <span className="text-sm text-[#012F61] font-semibold">
                  {formatDate(result.completed_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 sm:px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => router.push('/dashboard')}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-[#E95B0F] hover:text-[#E95B0F] transition-all"
              >
                <Home className="w-4 h-4" />
                Kembali ke Dashboard
              </button>
              <button 
                onClick={() => router.push('/quiz/history')}
                className="flex-1 px-5 py-3 bg-[#E95B0F] text-white font-semibold rounded-lg hover:bg-[#E95B0F]/90 transition-colors"
              >
                Lihat Riwayat Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResultDetail;