import { ClipboardX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HistoryEmptyStateProps {
  onStartQuiz: () => void;
}

export function HistoryEmptyState({ onStartQuiz }: HistoryEmptyStateProps) {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="py-16 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-[#E95B0F]/10 to-[#012F61]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ClipboardX className="w-10 h-10 text-[#E95B0F]" />
        </div>
        <h3 className="text-xl font-bold text-[#012F61] mb-2">
          Belum Ada Riwayat
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Kamu belum menyelesaikan quiz apapun. Mulai kerjakan quiz untuk melihat riwayatmu di sini!
        </p>
        <Button
          onClick={onStartQuiz}
          className="bg-[#E95B0F] hover:bg-[#E95B0F]/90 text-white font-semibold"
        >
          Mulai Quiz
        </Button>
      </CardContent>
    </Card>
  );
}