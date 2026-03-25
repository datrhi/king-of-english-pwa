"use client";
import { NavigationContext } from "@/lib/navigation/NavigationContext";
import { canGoBackAtom } from "@/lib/navigation/navigation-store";
import { useAtomValue } from "jotai";
import { Navbar, NavbarBackLink } from "konsta/react";
import { Props as NavbarProps } from "konsta/react/types/Navbar";
import { useContext } from "react";

interface Props extends NavbarProps {}

export default function Header(props: Props) {
  const navCtx = useContext(NavigationContext);
  const canGoBack = useAtomValue(canGoBackAtom);

  return (
    <Navbar
      title="King Of English"
      left={
        navCtx && canGoBack ? (
          <NavbarBackLink onClick={() => navCtx.goBack()} />
        ) : null
      }
      {...props}
    />
  );
}
