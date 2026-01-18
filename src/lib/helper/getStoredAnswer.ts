export const getStoredAnswers = (sessionId: string): Record<number, string> => {
  const raw = localStorage.getItem(`quiz_answers_${sessionId}`);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    const normalized: Record<number, string> = {};

    Object.entries(parsed).forEach(([key, value]) => {
      if (typeof value === "string") {
        normalized[Number(key)] = value;
      }
    });

    return normalized;
  } catch {
    return {};
  }
};
