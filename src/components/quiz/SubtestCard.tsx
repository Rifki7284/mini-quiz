import { ArrowRight, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Subtest } from "@/types/quiz/subtest";

type Props = {
  subtest: Subtest;
  onSelect: (subtest: Subtest) => void;
};

const SubtestCard = ({ subtest, onSelect }: Props) => {
  return (
    <div
      className={`bg-white rounded-xl border-2 transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col ${
        subtest.is_active
          ? "border-gray-200 hover:border-[#E95B0F] hover:shadow-lg"
          : "border-gray-200 opacity-70 hover:opacity-100"
      }`}
      onClick={() => onSelect(subtest)}
    >
      {/* Active Indicator */}
      {subtest.is_active && <div className="h-1.5 bg-[#E95B0F]" />}

      <div className="p-4 md:p-5 lg:p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 md:gap-3 mb-3 md:mb-4">
          <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
            <div
              className={`p-2 md:p-2.5 rounded-xl shrink-0 ${
                subtest.is_active ? "bg-[#E95B0F]/10" : "bg-gray-100"
              }`}
            >
              <FileText
                className={`w-4 h-4 md:w-5 md:h-5 ${
                  subtest.is_active ? "text-[#E95B0F]" : "text-gray-400"
                }`}
              />
            </div>
            <h3 className="text-base md:text-lg font-bold text-[#012F61] leading-tight line-clamp-2">
              {subtest.name}
            </h3>
          </div>

          {subtest.is_active ? (
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold h-6 px-2.5 rounded-full">
              Aktif
            </Badge>
          ) : (
            <Badge className="bg-gray-100 text-gray-600 border border-gray-300 text-xs font-semibold h-6 px-2.5 rounded-full">
              Nonaktif
            </Badge>
          )}
        </div>

        <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-auto line-clamp-3 min-h-[3.5rem] md:min-h-[4.5rem]">
          {subtest.description}
        </p>

        <div className="flex items-center justify-between pt-4 md:pt-5 mt-4 md:mt-5 border-t border-gray-100">
          <code className="text-xs text-gray-500 bg-gray-50 px-2.5 md:px-3 py-1.5 rounded-lg font-mono border border-gray-200 truncate max-w-[55%]">
            {subtest.slug}
          </code>
          <div
            className={`flex items-center gap-1.5 text-sm font-semibold ${
              subtest.is_active ? "text-[#E95B0F]" : "text-gray-400"
            }`}
          >
            <span>Detail</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubtestCard;
