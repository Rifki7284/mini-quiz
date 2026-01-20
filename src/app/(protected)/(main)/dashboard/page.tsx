"use client";
import { useState } from "react";
import { BookOpen, Target } from "lucide-react";
import { Subtest } from "@/types/quiz/subtest";
import LoadingData from "@/components/common/LoadingData";
import SubtestNotFound from "@/components/quiz/SubtestNotFound";
import SubtestCard from "@/components/quiz/SubtestCard";
import { useActiveQuiz } from "@/context/QuizContext";
import { SubtestDetailDialog } from "@/components/quiz/SubtestDetailDialog";
import { useStartSubtest } from "@/hooks/use-start-subtest";
import { useSubtest } from "@/hooks/use-subtest";

export default function SubtestPage() {
  const [selectedSubtest, setSelectedSubtest] = useState<Subtest | null>(null);
  const { isLoading, subtests } = useSubtest();

  const { startSubtest, isStarting } = useStartSubtest();
  const handleDialogClose = (open: boolean) => {
    if (!open) setSelectedSubtest(null);
  };
  const activeSubtests = subtests.filter((s) => s.is_active);
  const { activeQuiz } = useActiveQuiz();
  const hasActiveQuiz = !!activeQuiz;

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6 lg:mb-8">
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
          </div>
        )}
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
      <SubtestDetailDialog
        subtest={selectedSubtest}
        open={!!selectedSubtest}
        onOpenChange={handleDialogClose}
        onStart={startSubtest}
        isStarting={isStarting}
        hasActiveQuiz={hasActiveQuiz}
      />
    </div>
  );
}
