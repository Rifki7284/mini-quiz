const WARNING_TIME = 5 * 60; 
const DANGER_TIME = 2 * 60; 

export const getTimerStyle = (seconds: number) => {
  if (seconds <= DANGER_TIME) {
    return {
      bg: "bg-red-500",
      text: "text-white",
      border: "border-red-600",
      pulse: "animate-pulse",
    };
  }

  if (seconds <= WARNING_TIME) {
    return {
      bg: "bg-amber-500",
      text: "text-white",
      border: "border-amber-600",
      pulse: "",
    };
  }

  return {
    bg: "bg-emerald-500",
    text: "text-white",
    border: "border-emerald-600",
    pulse: "",
  };
};
