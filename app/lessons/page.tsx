"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LessonsRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("screen", "Lessons");
    router.replace(`/pwa/mobile?${params.toString()}`);
  }, [router, searchParams]);

  return null;
}

export default function LessonsRedirect() {
  return (
    <Suspense>
      <LessonsRedirectContent />
    </Suspense>
  );
}
