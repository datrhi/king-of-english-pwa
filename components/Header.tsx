"use client";
import { useTransitionRouter } from "@/lib/next-view-transitions";
import { Navbar, NavbarBackLink } from "konsta/react";
import { Props as NavbarProps } from "konsta/react/types/Navbar";

interface Props extends NavbarProps {}

export default function Header(props: Props) {
  const router = useTransitionRouter();
  const isCanBack = router.history.length > 0;
  return (
    <Navbar
      title="King Of English"
      left={isCanBack ? <NavbarBackLink onClick={() => router.back()} /> : null}
      {...props}
    />
  );
}
