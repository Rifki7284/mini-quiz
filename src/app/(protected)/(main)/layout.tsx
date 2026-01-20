"use client";

import React, { useEffect, useState } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
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
import { getStoredAnswers } from "@/lib/helper/getStoredAnswer";
import { buildFinalAnswers } from "@/lib/helper/buildFinalAnswers";
import { ActiveQuizProvider, useActiveQuiz } from "@/context/QuizContext";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const segments = pathname.split("/").filter(Boolean);
  const { activeQuiz } = useActiveQuiz();

  const [toastShown, setToastShown] = useState(false);
  const [autoSubmitted, setAutoSubmitted] = useState(false);

  const isBlockedToastPage =
    pathname === "/quiz" || pathname.startsWith("/quiz/session");
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const isExpired = (expiresAt: string) =>
    now !== null && new Date(expiresAt).getTime() <= now;

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
                router.push("/quiz/history");
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

        <main className="flex flex-1 flex-col gap-4 p-10">{children}</main>

        <ToastContainer />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ActiveQuizProvider>
      <LayoutContent>{children}</LayoutContent>
    </ActiveQuizProvider>
  );
}
