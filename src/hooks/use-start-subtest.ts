import { useState } from "react";
import { useRouter } from "next/navigation";

export function useStartSubtest() {
  const [isStarting, setIsStarting] = useState(false);
  const router = useRouter();

  const startSubtest = async (id: string) => {
    try {
      setIsStarting(true);
      await fetch(`/api/quiz/start/${id}`);
      router.push(`/quiz`);
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setIsStarting(false);
    }
  };

  return {
    startSubtest,
    isStarting,
  };
}
