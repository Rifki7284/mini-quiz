import { Home } from "lucide-react";

interface ResultActionsProps {
  onDashboardClick: () => void;
  onHistoryClick: () => void;
}

export function ResultActions({
  onDashboardClick,
  onHistoryClick,
}: ResultActionsProps) {
  return (
    <div className="px-6 sm:px-8 py-6 bg-gray-50 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row gap-3">
        <button 
          onClick={onDashboardClick}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-[#E95B0F] hover:text-[#E95B0F] transition-all"
        >
          <Home className="w-4 h-4" />
          Kembali ke Dashboard
        </button>
        <button 
          onClick={onHistoryClick}
          className="flex-1 px-5 py-3 bg-[#E95B0F] text-white font-semibold rounded-lg hover:bg-[#E95B0F]/90 transition-colors"
        >
          Lihat Riwayat Quiz
        </button>
      </div>
    </div>
  );
}
