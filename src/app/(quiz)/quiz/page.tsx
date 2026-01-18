"use client";
import { useEffect, useState } from "react";
import {
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ActiveQuiz } from "@/types/quiz/quiz";
import { buildFinalAnswers } from "@/lib/helper/buildFinalAnswers";
import { ApiResponse } from "@/types/common/apiResponse";
import { useRouter } from "next/navigation";
import LoadingQuiz from "@/components/quiz/LoadingQuiz";
import QuizNotFound from "@/components/quiz/QuizNotFound";

const Quiz = () => {
  const [dataQuiz, setDataQuiz] = useState<ActiveQuiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showNavigation, setShowNavigation] = useState(false);
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
        if (prev <= 1) {
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

  const handleSubmit = async () => {
    if (!dataQuiz) return;
    setIsSubmitting(true);

    try {
      const finalAnswers = buildFinalAnswers(dataQuiz, answers);
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        body: JSON.stringify({ answers: finalAnswers }),
      });
      if (!res.ok) throw new Error("Failed to submit quiz");
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
    return <LoadingQuiz />;
  }

  if (!dataQuiz) {
    return <QuizNotFound />;
  }

  const currentQuestion = dataQuiz.questions[currentQuestionIndex];
  const answeredProgress =
    (getAnsweredCount() / dataQuiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                {dataQuiz.subtest_name}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {getAnsweredCount()} / {dataQuiz.questions.length}
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Navigation Sheet */}
              <Sheet open={showNavigation} onOpenChange={setShowNavigation}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 h-9">
                    <List className="h-4 w-4" />
                    <span className="hidden sm:inline">Soal</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Navigasi Soal</SheetTitle>
                    <SheetDescription>
                      Pilih nomor untuk melompat ke soal
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
                        className={`relative h-10 ${
                          answers[q.question_number] &&
                          idx !== currentQuestionIndex
                            ? "border-green-500 bg-green-50 hover:bg-green-100 text-green-700"
                            : ""
                        }`}
                      >
                        {q.question_number}
                        {answers[q.question_number] && (
                          <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </Button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Timer */}
              <div
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg ${
                  timeRemaining < 300
                    ? "bg-red-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                <Clock className="h-4 w-4" />
                <span className="font-mono text-sm font-semibold">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>
                Soal {currentQuestionIndex + 1} dari {dataQuiz.questions.length}
              </span>
              <span>{Math.round(answeredProgress)}% terjawab</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-400 transition-all duration-300"
                style={{ width: `${answeredProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-32">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Question Header */}
          <div className="bg-blue-600 px-4 sm:px-6 py-5 sm:py-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-md bg-white/90 flex items-center justify-center font-semibold text-blue-600">
                {currentQuestion.question_number}
              </div>
              <p className="flex-1 text-base sm:text-lg text-white leading-relaxed">
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
                    className={`w-full flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg border transition-all ${
                      isSelected
                        ? "border-blue-600 bg-white shadow-sm"
                        : "border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full border flex items-center justify-center font-medium text-sm transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-400 bg-white text-gray-600"
                      }`}
                    >
                      {optionLabel}
                    </div>
                    <span
                      className={`flex-1 text-left text-sm sm:text-base leading-relaxed ${
                        isSelected
                          ? "text-gray-900 font-medium"
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

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="gap-2 h-10 sm:h-11"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            <div className="text-sm font-medium text-gray-700">
              {currentQuestionIndex + 1} / {dataQuiz.questions.length}
            </div>

            {currentQuestionIndex === dataQuiz.questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="gap-2 h-10 sm:h-11 bg-black hover:bg-gray-800 text-white"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="gap-2 h-10 sm:h-11 bg-black hover:bg-gray-800 text-white"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
