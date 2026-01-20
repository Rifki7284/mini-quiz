import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HistoryPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function HistoryPagination({
  currentPage,
  totalPages,
  totalCount,
  limit,
  onPageChange,
  onLimitChange,
}: HistoryPaginationProps) {
  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 font-medium">Tampilkan</span>
          <Select
            value={limit.toString()}
            onValueChange={(value) => {
              onLimitChange(Number(value));
              onPageChange(1);
            }}
          >
            <SelectTrigger className="w-[75px] h-10 border border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600 font-medium">per halaman</span>
        </div>

        <div className="text-sm text-gray-600 font-medium">
          Halaman {currentPage} dari {totalPages} • Total {totalCount} hasil
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-10 px-4 border border-gray-300 hover:bg-[#E95B0F]/10 hover:text-[#E95B0F] hover:border-[#E95B0F] disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400 disabled:hover:border-gray-300 font-medium"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <div className="flex items-center justify-center px-4 h-10 bg-[#012F61]/5 border border-[#012F61]/20 rounded-md min-w-[100px]">
          <span className="text-sm font-semibold text-[#012F61]">
            {currentPage} / {totalPages}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-10 px-4 border border-gray-300 hover:bg-[#E95B0F]/10 hover:text-[#E95B0F] hover:border-[#E95B0F] disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400 disabled:hover:border-gray-300 font-medium"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
