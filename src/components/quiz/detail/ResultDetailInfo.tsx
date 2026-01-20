import { FileText } from "lucide-react";

interface ResultDetailInfoProps {
  completedAt: string;
}

export function ResultDetailInfo({ completedAt }: ResultDetailInfoProps) {
  return (
    <div className="px-6 sm:px-8 py-6">
      <h2 className="text-lg font-bold text-[#012F61] mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-[#E95B0F]" />
        Detail Informasi
      </h2>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <span className="text-sm text-gray-600 font-medium">Waktu Selesai</span>
          <span className="text-sm text-[#012F61] font-semibold">
            {completedAt}
          </span>
        </div>
      </div>
    </div>
  );
}
