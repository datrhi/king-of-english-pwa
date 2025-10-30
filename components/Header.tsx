"use client";
import { useTransitionRouter } from "@/lib/next-view-transitions";
import { Navbar, NavbarBackLink } from "konsta/react";
import { Props as NavbarProps } from "konsta/react/types/Navbar";
// import { CircleUser } from "lucide-react";
// import { usePathname } from "next/navigation";

interface Props extends NavbarProps { }

export default function Header(props: Props) {
  const router = useTransitionRouter();
  // const pathname = usePathname();
  const isCanBack = router.history.length > 0;
  // const isSignedIn = false; // Placeholder for future authentication logic
  // const isAuthenticationRoute =
  //   pathname === "/signin" || pathname === "/signup";
  return (
    <Navbar
      title="King Of English"
      left={isCanBack ? <NavbarBackLink onClick={() => router.back()} /> : null}
      // right={
      //   isSignedIn ? (
      //     <Link iconOnly>
      //       <CircleUser size={20} />
      //     </Link>
      //   ) : isAuthenticationRoute ? null : (
      //     <Link onClick={() => router.push("/signin")}>Sign in</Link>
      //   )
      // }
      {...props}
    />
  );
}
