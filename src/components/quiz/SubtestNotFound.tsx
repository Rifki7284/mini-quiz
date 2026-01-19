import { Search } from "lucide-react";

const SubtestNotFound = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 md:p-12 lg:p-16 text-center">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-[#E95B0F]/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
        <Search className="w-8 h-8 md:w-10 md:h-10 text-[#E95B0F]" />
      </div>
      <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#012F61] mb-2 md:mb-3">
        Tidak Ada Subtes Tersedia
      </h3>
      <p className="text-sm md:text-base text-gray-600 max-w-md mx-auto">
        Belum ada subtes yang dapat ditampilkan saat ini. Silakan hubungi admin
        untuk informasi lebih lanjut.
      </p>
    </div>
  );
};
export default SubtestNotFound