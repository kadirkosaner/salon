import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "@/components/icons";

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-canvas px-6 text-center text-text">
      <span className="text-danger" aria-hidden="true">
        <TriangleAlert className="size-10" />
      </span>
      <h1 className="font-display text-2xl tracking-wide">Bir şeyler ters gitti</h1>
      <p className="max-w-md text-sm break-words text-text-2">
        {error.message || "Beklenmeyen bir hata oluştu. Sayfayı yenilemeyi dene."}
      </p>
    </main>
  );
}
