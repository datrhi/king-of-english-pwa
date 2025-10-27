"use client";

import { App } from "konsta/react";
import { ReactNode } from "react";

const KonstaWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <App safeAreas theme="ios">
      {children}
    </App>
  );
};

export default KonstaWrapper;
