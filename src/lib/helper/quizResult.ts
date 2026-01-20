import { PerformanceLevel } from "@/types/quiz/quizHistory";

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
};

export const getPerformanceLevel = (percentage: number): PerformanceLevel => {
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
  if (percentage >= 70)
    return {
      text: "Baik",
      color: "text-[#E95B0F]",
      bg: "bg-[#E95B0F]/10",
      border: "border-[#E95B0F]/20",
    };
  if (percentage >= 60)
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