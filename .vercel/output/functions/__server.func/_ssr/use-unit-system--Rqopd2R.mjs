import { r as getSettings } from "./settings-CQ5QIRDw.mjs";
import { t as qk } from "./query-keys-CCDoTTR_.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-unit-system--Rqopd2R.js
/** Loads the signed-in user's unit system (defaults metric). */
function useUnitSystem(enabled = true) {
	return useQuery({
		queryKey: [...qk.settings, "units"],
		queryFn: () => getSettings(),
		enabled,
		staleTime: 6e4,
		select: (s) => s.unitSystem === "imperial" ? "imperial" : "metric"
	}).data ?? "metric";
}
//#endregion
export { useUnitSystem as t };
