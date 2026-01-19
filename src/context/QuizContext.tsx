// contexts/ActiveQuizContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ActiveQuiz } from "@/types/quiz/quiz";
import { ApiResponse } from "@/types/common/apiResponse";

interface ActiveQuizContextType {
  activeQuiz: ActiveQuiz | null;
  refetch: () => Promise<void>;
}

const ActiveQuizContext = createContext<ActiveQuizContextType | undefined>(
  undefined,
);

export function ActiveQuizProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeQuiz, setActiveQuiz] = useState<ActiveQuiz | null>(null);

  const fetchActiveQuiz = async () => {
    try {
      const res = await fetch("/api/quiz/active");
      const json: ApiResponse<ActiveQuiz> = await res.json();

      if (json.success) {
        setActiveQuiz(json.data);
      } else {
        setActiveQuiz(null);
      }
    } catch (err) {
      console.error("Gagal fetch quiz aktif", err);
      setActiveQuiz(null);
    } finally {
    }
  };

  useEffect(() => {
    fetchActiveQuiz();
  }, []);

  return (
    <ActiveQuizContext.Provider
      value={{ activeQuiz, refetch: fetchActiveQuiz }}
    >
      {children}
    </ActiveQuizContext.Provider>
  );
}

export function useActiveQuiz() {
  const context = useContext(ActiveQuizContext);
  if (context === undefined) {
    throw new Error("useActiveQuiz must be used within ActiveQuizProvider");
  }
  return context;
}
