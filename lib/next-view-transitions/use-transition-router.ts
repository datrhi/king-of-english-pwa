import {
  backAnimation,
  flipClockwiseAnimation,
  pushAnimation,
} from "@/utils/router-transitions";
import {
  AppRouterInstance,
  NavigateOptions,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter as useNextRouter, usePathname } from "next/navigation";
import { startTransition, useCallback, useMemo } from "react";
import { useViewTransitions } from "./transition-context";

export type TransitionOptions = {
  onTransitionReady?: () => void;
};

type NavigateOptionsWithTransition = NavigateOptions & TransitionOptions;

export type TransitionRouter = AppRouterInstance & {
  push: (href: string, options?: NavigateOptionsWithTransition) => void;
  replace: (href: string, options?: NavigateOptionsWithTransition) => void;
  back: (options?: TransitionOptions) => void;
  reset: (path: string) => void;
  history: string[];
};

export function useTransitionRouter() {
  const router = useNextRouter();
  const {
    setFinishViewTransition: finishViewTransition,
    setHistory,
    history,
  } = useViewTransitions();
  const pathname = usePathname();

  const triggerTransition = useCallback(
    (cb: () => void, { onTransitionReady }: TransitionOptions = {}) => {
      if ("startViewTransition" in document) {
        // @ts-ignore
        const transition = document.startViewTransition(
          () =>
            new Promise<void>((resolve) => {
              startTransition(() => {
                cb();
                finishViewTransition(() => resolve);
              });
            })
        );

        if (onTransitionReady) {
          transition.ready.then(onTransitionReady);
        }
      } else {
        return cb();
      }
    },
    []
  );

  const push = useCallback(
    (
      href: string,
      { onTransitionReady, ...options }: NavigateOptionsWithTransition = {}
    ) => {
      triggerTransition(
        () => {
          router.push(href, options);
          setHistory((prev) => {
            return [...prev, pathname];
          });
        },
        {
          onTransitionReady: onTransitionReady || pushAnimation,
        }
      );
    },
    [triggerTransition, setHistory, router, pathname]
  );

  const replace = useCallback(
    (
      href: string,
      { onTransitionReady, ...options }: NavigateOptionsWithTransition = {}
    ) => {
      triggerTransition(
        () => {
          router.replace(href, options);
        },
        {
          onTransitionReady: onTransitionReady || flipClockwiseAnimation,
        }
      );
    },
    [triggerTransition, router]
  );

  const back = useCallback(
    ({ onTransitionReady }: TransitionOptions = {}) => {
      triggerTransition(
        () => {
          router.back();
        },
        {
          onTransitionReady: onTransitionReady || backAnimation,
        }
      );
    },
    [triggerTransition, router]
  );

  const reset = useCallback(
    (path: string) => {
      setHistory([]);
      window.location.replace(path);
    },
    [setHistory]
  );

  return useMemo<TransitionRouter>(
    () => ({
      ...router,
      push,
      replace,
      back,
      history,
      reset,
    }),
    [push, replace, back, router, history, reset]
  );
}
