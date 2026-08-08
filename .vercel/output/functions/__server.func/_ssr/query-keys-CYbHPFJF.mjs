//#region node_modules/.nitro/vite/services/ssr/assets/query-keys-CYbHPFJF.js
/** Central query keys for TanStack Query. */
var qk = {
	dashboard: ["dashboard"],
	feed: ["feed"],
	suggested: ["suggested"],
	activeProgram: ["program", "active"],
	program: (id) => ["program", id],
	workout: (date) => ["workout", date],
	workoutsRange: (from, to) => [
		"workouts",
		"range",
		from,
		to
	],
	measurements: ["measurements"],
	discover: ["discover"],
	discoverHome: ["discover", "home"],
	profile: (userId) => ["profile", userId],
	me: ["me"],
	exercises: ["exercises"],
	settings: ["settings"]
};
//#endregion
export { qk as t };
