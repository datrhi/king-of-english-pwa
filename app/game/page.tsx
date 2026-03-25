"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function GameRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("screen", "Game");
    router.replace(`/pwa/mobile?${params.toString()}`);
  }, [router, searchParams]);

  return null;
}

export default function GameRedirect() {
  return (
    <Suspense>
      <GameRedirectContent />
    </Suspense>
  );
}
