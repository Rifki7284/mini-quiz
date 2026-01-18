"use client";

import React, { useEffect, useState } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ActiveQuiz } from "@/types/quiz/quiz";
import { getStoredAnswers } from "@/lib/helper/getStoredAnswer";
import { buildFinalAnswers } from "@/lib/helper/buildFinalAnswers";
import { ApiResponse } from "@/types/common/apiResponse";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const segments = pathname.split("/").filter(Boolean);

  const [activeQuiz, setActiveQuiz] = useState<ActiveQuiz | null>(null);
  const [toastShown, setToastShown] = useState(false);
  const [autoSubmitted, setAutoSubmitted] = useState(false);

  const isBlockedToastPage =
    pathname === "/quiz" || pathname.startsWith("/quiz/session");

  const isExpired = (expiresAt: string) =>
    new Date(expiresAt).getTime() <= Date.now();

  const format = (text: string) =>
    text.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const handleSubmit = async (answers: Record<number, string>) => {
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) throw new Error("Submit gagal");

      if (activeQuiz) {
        localStorage.removeItem(`quiz_answers_${activeQuiz.session_id}`);
      }
    } catch (err) {
      console.error("Auto submit error:", err);
    }
  };
  useEffect(() => {
    async function fetchActiveQuiz() {
      try {
        const res = await fetch("/api/quiz/active");
        const json: ApiResponse<ActiveQuiz> = await res.json();

        if (json.success) {
          setActiveQuiz(json.data);
        }
      } catch (err) {
        console.error("Gagal fetch quiz aktif", err);
      }
    }

    fetchActiveQuiz();
  }, []);
  useEffect(() => {
    if (!activeQuiz || toastShown) return;

    if (isExpired(activeQuiz.expires_at)) {
      if (autoSubmitted) return;

      const storedAnswers = getStoredAnswers(activeQuiz.session_id);
      const finalAnswers = buildFinalAnswers(activeQuiz, storedAnswers);

      handleSubmit(finalAnswers);

      setAutoSubmitted(true);
      setToastShown(true);

      toast.error(
        ({ closeToast }) => (
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Waktu Quiz Habis</p>
            <p className="text-sm text-gray-600">
              Quiz <b>{activeQuiz.subtest_name}</b> telah berakhir.
            </p>

            <button
              onClick={() => {
                closeToast?.();
                router.push("/quiz");
              }}
              className="mt-2 rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
            >
              Lihat Riwayat
            </button>
          </div>
        ),
        {
          position: "top-right",
          autoClose: false,
          closeOnClick: false,
          draggable: false,
        },
      );

      return;
    }

    if (isBlockedToastPage) return;

    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-2">
          <p className="font-semibold">Quiz masih aktif</p>
          <p className="text-sm text-gray-600">{activeQuiz.subtest_name}</p>

          <button
            onClick={() => {
              closeToast?.();
              router.push("/quiz");
            }}
            className="mt-2 rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            Lanjutkan Sesi
          </button>
        </div>
      ),
      {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      },
    );

    setToastShown(true);
  }, [activeQuiz, toastShown, autoSubmitted, isBlockedToastPage, router]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {segments.map((segment, index) => {
                const href = "/" + segments.slice(0, index + 1).join("/");
                const isLast = index === segments.length - 1;

                return (
                  <div key={href} className="flex items-center gap-2">
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{format(segment)}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={href}>
                          {format(segment)}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </div>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-10">
          {React.Children.map(children, (child) =>
            React.isValidElement(child)
              ? React.cloneElement(child as React.ReactElement<any>, {
                  activeQuiz,
                })
              : child,
          )}
        </main>

        <ToastContainer />
      </SidebarInset>
    </SidebarProvider>
  );
}
