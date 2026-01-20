import { CheckCircle, AlertCircle, FileText, Target, PlayCircle } from "lucide-react";
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
import { Spinner } from "@/components/ui/spinner";
import { Subtest } from "@/types/quiz/subtest";

interface SubtestDetailDialogProps {
  subtest: Subtest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStart: (id: string) => void;
  isStarting: boolean;
  hasActiveQuiz?: boolean;
}

export function SubtestDetailDialog({
  subtest,
  open,
  onOpenChange,
  onStart,
  isStarting,
  hasActiveQuiz = false,
}: SubtestDetailDialogProps) {
  if (!subtest) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[min(calc(100vw-2rem),34rem)] p-0 gap-0">
        <DialogHeader className="px-4 md:px-6 pt-4 md:pt-6 pb-3 md:pb-4 space-y-1.5 md:space-y-2 border-b border-gray-100">
          <DialogTitle className="text-lg md:text-xl font-bold text-[#012F61] leading-tight pr-6 md:pr-8">
            {subtest.name}
          </DialogTitle>
          <DialogDescription className="text-xs md:text-sm text-gray-600">
            Informasi lengkap dan aksi untuk memulai subtes ini
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
          {subtest.is_active ? (
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
                {subtest.description}
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
              <div>
                <label className="text-[10px] md:text-xs text-gray-500 font-medium block mb-1.5 md:mb-2">
                  Status Ketersediaan
                </label>
                <div
                  className={`flex items-center justify-center gap-2 px-3 md:px-4 py-2 md:py-3 rounded-xl border ${
                    subtest.is_active
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  {subtest.is_active ? (
                    <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 shrink-0" />
                  )}
                  <span
                    className={`text-xs md:text-sm font-semibold ${
                      subtest.is_active
                        ? "text-emerald-700"
                        : "text-gray-600"
                    }`}
                  >
                    {subtest.is_active
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
              !subtest.is_active || isStarting || hasActiveQuiz
            }
            className={`font-semibold w-full sm:w-auto h-10 md:h-11 text-sm md:text-base ${
              subtest.is_active
                ? "bg-[#E95B0F] hover:bg-[#E95B0F]/90"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            onClick={() => {
              if (!subtest || !subtest.is_active) return;
              onStart(subtest.id);
            }}
          >
            {isStarting ? (
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
  );
}
