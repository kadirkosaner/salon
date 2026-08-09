import { useQuery } from "@tanstack/react-query";
import { getSettings } from "@/lib/server/settings";
import { qk } from "@/lib/query-keys";
import type { UnitSystem } from "@/lib/units";

/** Loads the signed-in user's unit system (defaults metric). */
export function useUnitSystem(enabled = true): UnitSystem {
  const q = useQuery({
    queryKey: [...qk.settings, "units"] as const,
    queryFn: () => getSettings(),
    enabled,
    staleTime: 60_000,
    select: (s) =>
      (s.unitSystem === "imperial" ? "imperial" : "metric") as UnitSystem,
  });
  return q.data ?? "metric";
}
