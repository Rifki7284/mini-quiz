import { ApiResponse } from "@/types/common/apiResponse";
import { Subtest } from "@/types/quiz";
import { useEffect, useState } from "react";
export function useSubtest() {
  const [subtests, setSubtests] = useState<Subtest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const fetchSubtests = async () => {
    try {
      const res = await fetch("/api/quiz", { method: "GET" });
      const json: ApiResponse<Subtest[]> = await res.json();
      setSubtests(json.data ?? []);
    } catch (e) {
      console.error(e);
      setSubtests([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchSubtests();
  }, []);
  return {
    subtests,
    isLoading,
  };
}
