"use client";

// more info at https://github.com/aidenybai/react-scan/blob/main/docs/installation/next-js-app-router.md
// react-scan must be imported before react
import { scan } from "react-scan";
import { useEffect } from "react";

const ReactScan = () => {
  // export function ReactScan() {
  useEffect(() => {
    scan({
      enabled: true,
    });
  }, []);

  return <></>;
};

export default ReactScan;
