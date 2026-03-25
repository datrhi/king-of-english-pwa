"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LobbyRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("screen", "Lobby");
    router.replace(`/pwa/mobile?${params.toString()}`);
  }, [router, searchParams]);

  return null;
}

export default function LobbyRedirect() {
  return (
    <Suspense>
      <LobbyRedirectContent />
    </Suspense>
  );
}
