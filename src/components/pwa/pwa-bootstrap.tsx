import { useEffect } from "react";
import { initPwa } from "@/lib/pwa";

/** Registers SW + captures install prompt (client-only). */
export function PwaBootstrap() {
  useEffect(() => {
    initPwa();
  }, []);
  return null;
}
