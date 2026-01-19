import { ClipboardX, Home } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const QuizNotFound = () => {
  return (
    <div className="w-[100dvw] h-[100dvh] flex item-center justify-center">
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <Card className="max-w-md w-full border-gray-200 shadow-sm">
          <CardContent className="pt-12 pb-8 px-6">
            <div className="text-center space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E95B0F]/10 to-[#012F61]/10 flex items-center justify-center">
                  <ClipboardX className="w-10 h-10 text-[#E95B0F]" />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-[#012F61]">
                  Tidak Ada Quiz Aktif
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Saat ini tidak ada quiz yang tersedia untuk dikerjakan.
                  Silakan kembali ke dashboard untuk melihat quiz yang akan
                  datang.
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Button
                  onClick={() => (window.location.href = "/dashboard")}
                  className="w-full bg-[#E95B0F] hover:bg-[#E95B0F]/90 text-white font-semibold py-6 rounded-lg transition-all duration-200 hover:shadow-lg"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Kembali ke Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default QuizNotFound;
