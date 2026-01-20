export const getScoreColor = (percentage: number): string => {
  if (percentage >= 80)
    return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (percentage >= 60)
    return "text-[#012F61] bg-[#012F61]/10 border-[#012F61]/20";
  if (percentage >= 40) return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-red-700 bg-red-50 border-red-200";
};

export const getScoreBadgeColor = (percentage: number): string => {
  if (percentage >= 80)
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (percentage >= 60)
    return "bg-[#012F61]/10 text-[#012F61] border-[#012F61]/20";
  if (percentage >= 40) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-red-50 text-red-700 border-red-200";
};
