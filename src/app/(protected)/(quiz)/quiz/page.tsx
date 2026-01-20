"use client";
import { useEffect, useState } from "react";
import {
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  List,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ActiveQuiz } from "@/types/quiz/quiz";
import { buildFinalAnswers } from "@/lib/helper/buildFinalAnswers";
import { ApiResponse } from "@/types/common/apiResponse";
import { useRouter } from "next/navigation";
import QuizNotFound from "@/components/quiz/QuizNotFound";
import LoadingData from "@/components/common/LoadingData";
import { getTimerStyle } from "@/lib/helper/timerStyle";

const Quiz = () => {
  const [now, setNow] = useState(Date.now());

  const [dataQuiz, setDataQuiz] = useState<ActiveQuiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showNavigation, setShowNavigation] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const router = useRouter();
  const getStorageKey = (sessionId: string) => `quiz_answers_${sessionId}`;

  const getQuiz = async () => {
    try {
      const res = await fetch("/api/quiz/active");
      const json: ApiResponse<ActiveQuiz> = await res.json();
      const quizData = json.data;
      setDataQuiz(quizData);
      const storageKey = getStorageKey(quizData.session_id);
      const savedAnswers = localStorage.getItem(storageKey);
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
      const expiresAt = new Date(quizData.expires_at).getTime();
      const now = new Date().getTime();
      const remaining = Math.floor((expiresAt - now) / 1000);
      setTimeRemaining(remaining > 0 ? remaining : 0);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getQuiz();
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  

  const handleAnswerSelect = (questionNumber: number, option: string) => {
    setAnswers((prev) => {
      const updated = { ...prev, [questionNumber]: option };
      if (dataQuiz) {
        const storageKey = getStorageKey(dataQuiz.session_id);
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const getUnansweredCount = () => {
    if (!dataQuiz) return 0;
    return dataQuiz.questions.length - getAnsweredCount();
  };

  const handleSubmitClick = () => {
    setShowSubmitDialog(true);
  };

  const handleSubmit = async () => {
    if (!dataQuiz) return;
    setIsSubmitting(true);
    setShowSubmitDialog(false);

    try {
      const finalAnswers = buildFinalAnswers(dataQuiz, answers);
      await fetch("/api/quiz/submit", {
        method: "POST",
        body: JSON.stringify({ answers: finalAnswers }),
      });
      const storageKey = getStorageKey(dataQuiz.session_id);
      localStorage.removeItem(storageKey);
      router.push("/quiz/history");
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowNavigation(false);
  };

  const handleNext = () => {
    if (dataQuiz && currentQuestionIndex < dataQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (loading) {
    return <LoadingData data="Quiz" />;
  }

  if (!dataQuiz) {
    return <QuizNotFound />;
  }

  const currentQuestion = dataQuiz.questions[currentQuestionIndex];
  const answeredProgress =
    (getAnsweredCount() / dataQuiz.questions.length) * 100;
  const timerStyle = getTimerStyle(timeRemaining);
  const unansweredCount = getUnansweredCount();
  const isAllAnswered = unansweredCount === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-[#012F61] truncate">
                {dataQuiz.subtest_name}
              </h1>
              <p className="text-sm text-gray-600 mt-0.5 font-medium">
                {getAnsweredCount()} / {dataQuiz.questions.length} terjawab
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Sheet open={showNavigation} onOpenChange={setShowNavigation}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 h-9 border-[#012F61]/20 hover:border-[#E95B0F] hover:bg-[#E95B0F]/5 hover:text-[#E95B0F] font-semibold"
                  >
                    <List className="h-4 w-4" />
                    <span className="hidden sm:inline">Daftar Soal</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="text-[#012F61]">
                      Navigasi Soal
                    </SheetTitle>
                    <SheetDescription>
                      Pilih nomor untuk melompat ke soal tertentu
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid grid-cols-5 gap-2 mt-6">
                    {dataQuiz.questions.map((q, idx) => (
                      <Button
                        key={q.question_number}
                        variant={
                          idx === currentQuestionIndex ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => goToQuestion(idx)}
                        className={`relative h-10 font-semibold ${
                          idx === currentQuestionIndex
                            ? "bg-[#E95B0F] hover:bg-[#E95B0F]/90"
                            : answers[q.question_number]
                              ? "border-emerald-500 bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                              : "hover:border-[#E95B0F] hover:text-[#E95B0F]"
                        }`}
                      >
                        {q.question_number}
                        {answers[q.question_number] &&
                          idx !== currentQuestionIndex && (
                            <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white" />
                          )}
                      </Button>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-2">
                    <p className="text-sm font-semibold text-[#012F61] mb-3">
                      Keterangan:
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-6 w-6 bg-[#E95B0F] rounded flex items-center justify-center text-white text-xs font-bold">
                        1
                      </div>
                      <span className="text-gray-700">Soal saat ini</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-6 w-6 bg-emerald-50 border border-emerald-500 rounded flex items-center justify-center text-emerald-700 text-xs font-bold relative">
                        1
                        <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-emerald-500 rounded-full border border-white" />
                      </div>
                      <span className="text-gray-700">Sudah dijawab</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-6 w-6 bg-white border border-gray-300 rounded flex items-center justify-center text-gray-700 text-xs font-bold">
                        1
                      </div>
                      <span className="text-gray-700">Belum dijawab</span>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Timer */}
              <div
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border-2 ${timerStyle.bg} ${timerStyle.text} ${timerStyle.border} ${timerStyle.pulse} shadow-sm`}
              >
                <Clock className="h-4 w-4" />
                <span className="font-mono text-sm font-bold">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2 font-medium">
              <span>
                Soal {currentQuestionIndex + 1} dari {dataQuiz.questions.length}
              </span>
              <span>{Math.round(answeredProgress)}% selesai</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E95B0F] transition-all duration-300"
                style={{ width: `${answeredProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-32">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Question Header */}
          <div className="bg-[#012F61] px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-[#E95B0F] flex items-center justify-center font-bold text-white text-lg">
                {currentQuestion.question_number}
              </div>
              <p className="flex-1 text-base sm:text-lg text-white leading-relaxed font-medium">
                {currentQuestion.question_text}
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="p-4 sm:p-6 md:p-8 bg-gray-50">
            <div className="space-y-3">
              {currentQuestion.options.map((option, optionIndex) => {
                const optionLabel = String.fromCharCode(65 + optionIndex);
                const isSelected =
                  answers[currentQuestion.question_number] === option;

                return (
                  <button
                    key={optionIndex}
                    onClick={() =>
                      handleAnswerSelect(
                        currentQuestion.question_number,
                        option,
                      )
                    }
                    className={`w-full flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-[#E95B0F] bg-[#E95B0F]/5 shadow-md"
                        : "border-gray-200 bg-white hover:border-[#E95B0F]/50 hover:shadow-sm"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all ${
                        isSelected
                          ? "border-[#E95B0F] bg-[#E95B0F] text-white"
                          : "border-gray-300 bg-white text-gray-600"
                      }`}
                    >
                      {isSelected ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        optionLabel
                      )}
                    </div>
                    <span
                      className={`flex-1 text-left text-sm sm:text-base leading-relaxed ${
                        isSelected
                          ? "text-[#012F61] font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="gap-2 h-10 sm:h-11 border-gray-300 hover:border-[#012F61] hover:bg-[#012F61]/5 hover:text-[#012F61] font-semibold disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </Button>

            <div className="text-sm font-bold text-[#012F61]">
              {currentQuestionIndex + 1} / {dataQuiz.questions.length}
            </div>

            {currentQuestionIndex === dataQuiz.questions.length - 1 ? (
              <Button
                onClick={handleSubmitClick}
                disabled={isSubmitting}
                className="gap-2 h-10 sm:h-11 bg-[#E95B0F] hover:bg-[#E95B0F]/90 text-white font-semibold shadow-sm"
              >
                {isSubmitting ? "Mengirim..." : "Kirim Jawaban"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="gap-2 h-10 sm:h-11 bg-[#012F61] hover:bg-[#012F61]/90 text-white font-semibold"
              >
                <span className="hidden sm:inline">Selanjutnya</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-[#012F61]">
              {isAllAnswered ? (
                <>
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Konfirmasi Pengiriman
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Peringatan
                </>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base leading-relaxed">
              {isAllAnswered ? (
                <span className="block space-y-3">
                  <span className="block text-gray-700">
                    Anda telah menjawab{" "}
                    <span className="font-semibold text-emerald-600">
                      semua soal
                    </span>
                    . Apakah Anda yakin ingin mengirim jawaban sekarang?
                  </span>
                  <span className="block bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <span className="text-sm text-emerald-800 font-medium block">
                      ✓ {dataQuiz.questions.length} dari{" "}
                      {dataQuiz.questions.length} soal terjawab
                    </span>
                  </span>
                </span>
              ) : (
                <span className="block space-y-3">
                  <span className="block text-gray-700">
                    Anda masih memiliki{" "}
                    <span className="font-semibold text-amber-600">
                      {unansweredCount} soal
                    </span>{" "}
                    yang belum terjawab. Soal yang tidak dijawab akan dianggap
                    kosong.
                  </span>
                  <span className="block bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <span className="text-sm text-amber-800 font-medium block">
                      ⚠ {getAnsweredCount()} dari {dataQuiz.questions.length}{" "}
                      soal terjawab
                    </span>
                    <span className="text-sm text-amber-700 mt-1 block">
                      {unansweredCount} soal masih kosong
                    </span>
                  </span>
                  <span className="block text-gray-600 text-sm">
                    Apakah Anda yakin ingin mengirim jawaban sekarang?
                  </span>
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="font-semibold">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              className={`font-semibold ml-2 ${
                isAllAnswered
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-[#E95B0F] hover:bg-[#E95B0F]/90"
              }`}
            >
              Ya, Kirim Sekarang
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Quiz;
