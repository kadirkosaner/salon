import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-text">
      <span className="text-red" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="font-display text-2xl tracking-wide">Bir şeyler ters gitti</h1>
      <p className="max-w-md text-sm break-words text-muted">
        {error.message || "Beklenmeyen bir hata oluştu. Sayfayı yenilemeyi dene."}
      </p>
    </main>
  );
}
