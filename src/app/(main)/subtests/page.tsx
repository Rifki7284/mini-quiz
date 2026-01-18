"use client";
import { useState, useEffect } from "react";
import { Search, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { ApiResponse } from "@/types/common/apiResponse";
import { Subtest } from "@/types/quiz/subtest";

export default function SubtestPage() {
  const [subtests, setSubtests] = useState<Subtest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadStart, setLoadStart] = useState(false);
  const [selectedSubtest, setSelectedSubtest] = useState<Subtest | null>(null);
  const router = useRouter();
  const fetchSubtests = async () => {
    try {
      const res = await fetch("/api/quiz", {
        method: "GET",
      });
      const json: ApiResponse<Subtest[]> = await res.json();
      setSubtests(json.data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };
  const startSubtest = async (id: string) => {
    try {
      setLoadStart(true);
      await fetch(`/api/quiz/start/${id}`);
      setLoadStart(false);
      router.push(`/quiz`);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchSubtests();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Memuat data subtes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1.5">
            Daftar Subtes
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Pilih subtes untuk melihat detail dan memulai latihan
          </p>
        </div>
        {subtests.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Tidak ada subtes tersedia
            </h3>
            <p className="text-sm text-gray-500">
              Belum ada subtes yang dapat ditampilkan saat ini
            </p>
          </div>
        ) : (
          <div className="grid gap-4 xs:gap-5 sm:gap-6 grid-cols-1 min-[500px]:grid-cols-2 xl:grid-cols-3">
            {subtests.map((subtest) => (
              <div
                key={subtest.id}
                className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer flex flex-col"
                onClick={() => setSelectedSubtest(subtest)}
              >
                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Header - Fixed Height */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex-1 leading-tight line-clamp-2 min-h-[3.5rem]">
                      {subtest.name}
                    </h3>
                    {subtest.is_active && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs font-medium shrink-0 h-6 px-2.5 rounded-full">
                        Aktif
                      </Badge>
                    )}
                  </div>

                  {/* Description - Fixed Height */}
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-auto line-clamp-3 min-h-[4.5rem]">
                    {subtest.description}
                  </p>

                  {/* Footer - Fixed at Bottom */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                    <code className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-md font-mono">
                      {subtest.slug}
                    </code>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                      <span>Detail</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Dialog
        open={!!selectedSubtest}
        onOpenChange={(open) => !open && setSelectedSubtest(null)}
      >
        <DialogContent className="max-w-[min(calc(100vw-2rem),28rem)] p-0 gap-0">
          <DialogHeader className="px-4 pt-4 pb-3 space-y-0.5">
            <DialogTitle className="text-lg font-bold text-gray-900 leading-tight pr-8">
              {selectedSubtest?.name}
            </DialogTitle>
            <DialogDescription>
              Detail informasi dan aksi untuk subtes ini
            </DialogDescription>
          </DialogHeader>

          <div className="px-4 pb-4 space-y-4">
            {/* Description */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">
                Deskripsi
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {selectedSubtest?.description}
              </p>
            </div>

            {/* Technical Info */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2.5">
                Informasi Teknis
              </h4>
              <div className="space-y-2.5">
                {/* Slug */}
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">
                    Slug Identifier
                  </label>
                  <code className="text-sm font-mono bg-gray-50 px-3 py-2 rounded border w-full block text-center">
                    {selectedSubtest?.slug}
                  </code>
                </div>

                {/* Status */}
                <div>
                  <label className="text-xs text-gray-500 block mb-1.5">
                    Status
                  </label>
                  <div
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded border ${
                      selectedSubtest?.is_active
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    {selectedSubtest?.is_active && (
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        selectedSubtest?.is_active
                          ? "text-green-700"
                          : "text-gray-700"
                      }`}
                    >
                      {selectedSubtest?.is_active ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Tutup</Button>
              </DialogClose>
              <Button
                disabled={loadStart}
                className="cursor-pointer"
                onClick={() => {
                  if (!selectedSubtest) return;

                  startSubtest(selectedSubtest.id);
                }}
              >
                {loadStart ? <Spinner /> : ""}
                Mulai Latihan
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
