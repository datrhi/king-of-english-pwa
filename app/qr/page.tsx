"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function QRRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/pwa/mobile?screen=QR");
  }, [router]);
  return null;
}
