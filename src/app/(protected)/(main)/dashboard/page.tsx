"use client";
import { useState, useEffect } from "react";
import {
  Search,
  ArrowRight,
  CheckCircle,
  PlayCircle,
  Clock,
  FileText,
  AlertCircle,
  BookOpen,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { ApiResponse } from "@/types/common/apiResponse";
import { Subtest } from "@/types/quiz/subtest";
import LoadingData from "@/components/common/LoadingData";
import { ActiveQuiz } from "@/types/quiz/quiz";
import SubtestNotFound from "@/components/quiz/SubtestNotFound";
import SubtestCard from "@/components/quiz/SubtestCard";
import { useActiveQuiz } from "@/context/QuizContext";

export default function SubtestPage() {
  const [subtests, setSubtests] = useState<Subtest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadStart, setLoadStart] = useState(false);
  const [selectedSubtest, setSelectedSubtest] = useState<Subtest | null>(null);
  const router = useRouter();

  const fetchSubtests = async () => {
    try {
      const res = await fetch("/api/quiz", { method: "GET" });
      const json: ApiResponse<Subtest[]> = await res.json();
      setSubtests(json.data ?? []);
    } catch (e) {
      console.error(e);
      setSubtests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const startSubtest = async (id: string) => {
    try {
      setLoadStart(true);
      await fetch(`/api/quiz/start/${id}`);
      setLoadStart(false);
      router.push(`/quiz`);
    } catch (e) {
      console.log(e);
      setLoadStart(false);
    }
  };
  const activeSubtests = subtests.filter((s) => s.is_active);
  const { activeQuiz, refetch } = useActiveQuiz();

  // Use activeQuiz directly
  const hasActiveQuiz = !!activeQuiz;
  useEffect(() => {
    fetchSubtests();
  }, []);

  if (isLoading) {
    return <LoadingData data="Data Subtes" />;
  }



  return (
    <div className="min-h-screen w-full">
      <div className="w-full">
        {/* Header */}
        <div className="mb-4 md:mb-6 lg:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#012F61] mb-1 md:mb-2">
            Dashboard Quiz
          </h1>
          <p className="text-xs md:text-sm lg:text-base text-gray-600">
            Pilih subtes untuk memulai latihan dan tingkatkan kemampuanmu
          </p>
        </div>

        {/* Stats Summary */}
        {subtests.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6 lg:mb-8">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2.5 md:p-3 bg-[#E95B0F]/10 rounded-xl shrink-0">
                  <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-[#E95B0F]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 font-medium mb-0.5 md:mb-1">
                    Total Subtes
                  </p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#012F61]">
                    {subtests.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2.5 md:p-3 bg-emerald-50 rounded-xl shrink-0">
                  <Target className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 font-medium mb-0.5 md:mb-1">
                    Subtes Aktif
                  </p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#012F61]">
                    {activeSubtests.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2.5 md:p-3 bg-[#012F61]/10 rounded-xl shrink-0">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-[#012F61]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 font-medium mb-0.5 md:mb-1">
                    Siap Dikerjakan
                  </p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#012F61]">
                    {activeSubtests.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {subtests.length === 0 ? (
          <SubtestNotFound />
        ) : (
          <div className="grid gap-3 md:gap-4 lg:gap-5 grid-cols-1 min-[500px]:grid-cols-2 xl:grid-cols-3">
            {subtests.map((subtest) => (
              <SubtestCard
                key={subtest.id}
                subtest={subtest}
                onSelect={setSelectedSubtest}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedSubtest}
        onOpenChange={(open) => !open && setSelectedSubtest(null)}
      >
        <DialogContent className="max-w-[min(calc(100vw-2rem),34rem)] p-0 gap-0">
          <DialogHeader className="px-4 md:px-6 pt-4 md:pt-6 pb-3 md:pb-4 space-y-1.5 md:space-y-2 border-b border-gray-100">
            <DialogTitle className="text-lg md:text-xl font-bold text-[#012F61] leading-tight pr-6 md:pr-8">
              {selectedSubtest?.name}
            </DialogTitle>
            <DialogDescription className="text-xs md:text-sm text-gray-600">
              Informasi lengkap dan aksi untuk memulai subtes ini
            </DialogDescription>
          </DialogHeader>

          <div className="px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
            {selectedSubtest?.is_active ? (
              <div className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="p-1 md:p-1.5 bg-emerald-100 rounded-lg shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-semibold text-emerald-900 mb-0.5 md:mb-1">
                    Subtes Tersedia
                  </p>
                  <p className="text-xs md:text-sm text-emerald-700 leading-relaxed">
                    Subtes ini aktif dan siap untuk dikerjakan. Klik tombol
                    "Mulai Latihan" untuk memulai quiz.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="p-1 md:p-1.5 bg-amber-100 rounded-lg shrink-0">
                  <AlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-semibold text-amber-900 mb-0.5 md:mb-1">
                    Subtes Tidak Tersedia
                  </p>
                  <p className="text-xs md:text-sm text-amber-700 leading-relaxed">
                    Subtes ini sedang tidak aktif. Silakan pilih subtes lain
                    atau hubungi admin untuk informasi lebih lanjut.
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h4 className="text-xs md:text-sm font-semibold text-[#012F61] mb-2 md:mb-3 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#E95B0F]" />
                Deskripsi
              </h4>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 md:p-4">
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  {selectedSubtest?.description}
                </p>
              </div>
            </div>

            {/* Technical Info */}
            <div>
              <h4 className="text-xs md:text-sm font-semibold text-[#012F61] mb-2 md:mb-3 flex items-center gap-2">
                <Target className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#E95B0F]" />
                Informasi Teknis
              </h4>
              <div className="space-y-2 md:space-y-3">
                {/* Slug */}
                {/* <div>
                  <label className="text-[10px] md:text-xs text-gray-500 font-medium block mb-1.5 md:mb-2">
                    Slug Identifier
                  </label>
                  <code className="text-xs md:text-sm font-mono bg-gray-50 px-3 md:px-4 py-2 md:py-3 rounded-xl border border-gray-200 w-full block text-center text-[#012F61] font-semibold break-all">
                    {selectedSubtest?.slug}
                  </code>
                </div> */}

                {/* Status */}
                <div>
                  <label className="text-[10px] md:text-xs text-gray-500 font-medium block mb-1.5 md:mb-2">
                    Status Ketersediaan
                  </label>
                  <div
                    className={`flex items-center justify-center gap-2 px-3 md:px-4 py-2 md:py-3 rounded-xl border ${
                      selectedSubtest?.is_active
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    {selectedSubtest?.is_active ? (
                      <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 shrink-0" />
                    )}
                    <span
                      className={`text-xs md:text-sm font-semibold ${
                        selectedSubtest?.is_active
                          ? "text-emerald-700"
                          : "text-gray-600"
                      }`}
                    >
                      {selectedSubtest?.is_active
                        ? "Aktif & Siap Dikerjakan"
                        : "Tidak Tersedia Saat Ini"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="px-4 md:px-6 py-4 md:py-5 bg-gray-50 border-t border-gray-100 gap-2 md:gap-3 flex-col-reverse sm:flex-row">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="font-semibold hover:bg-gray-100 border-gray-300 w-full sm:w-auto h-10 md:h-11 text-sm md:text-base"
              >
                Tutup
              </Button>
            </DialogClose>
            <Button
              disabled={
                !selectedSubtest?.is_active || loadStart || hasActiveQuiz
              }
              className={`font-semibold w-full sm:w-auto h-10 md:h-11 text-sm md:text-base ${
                selectedSubtest?.is_active
                  ? "bg-[#E95B0F] hover:bg-[#E95B0F]/90"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              onClick={() => {
                if (!selectedSubtest || !selectedSubtest.is_active) return;
                startSubtest(selectedSubtest.id);
              }}
            >
              {loadStart ? (
                <span className="flex items-center gap-2">
                  <Spinner className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  Memulai Quiz...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <PlayCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  Mulai Latihan
                </span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
