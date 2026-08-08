import { r as createServerFn } from "./ssr.mjs";
import { dn as boolean, gn as object, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { c as positiveId, g as v, o as optionalText, r as isoDate, s as parseOrThrow, t as authMiddleware } from "./validation-CwL44con.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D75-wYbG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/share-fpDZHWUO.js
/** Delete all of a user's personal programs (cascade days/exercises). */
/** Drop future planned shells so new program can fill the calendar. */
/**
* Remap program day DOWs so `startSourceDayId` lands on `startDate`'s weekday,
* preserving relative gaps between sessions (rest days stay as empty DOWs).
*/
var listDiscoverPrograms = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("6d2b000444254eed06cba44d7955f6d54391af4ed14919699d492338be3cafcd"));
var getPublicProgramDetail = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(positiveId)).handler(createSsrRpc("8ed95332c23efdc012d2d678efa7cc61217d2f31e89f6d84896e63e5d24a8fb0"));
var publishProgram = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	id: positiveId,
	is_public: boolean(),
	description: optionalText(2e3),
	tags: optionalText(200)
}))).handler(createSsrRpc("4312477b45dbbfc69b6ed18219f898c149adb6df6eb1777809c50fcf94a806a5"));
var updateProgramMeta = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	id: positiveId,
	name: string().trim().min(1).max(80).optional(),
	description: optionalText(2e3),
	tags: optionalText(200)
}))).handler(createSsrRpc("51a99a75ec2b797b2a652d1abc3b9af80ebab339ca49be6d184880428fbecbe2"));
/**
* Clone a public/catalog program as the user's active program.
* Optional startDate + startSourceDayId remaps weekdays so the chosen
* session lands on the chosen start day (relative rest gaps preserved).
*/
var cloneProgram = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => parseOrThrow(object({
	programId: positiveId.optional(),
	shareCode: string().trim().min(4).max(8).optional(),
	setActive: boolean().optional(),
	name: string().trim().max(80).optional(),
	startDate: isoDate.optional(),
	startSourceDayId: positiveId.optional()
}), d)).handler(createSsrRpc("2fdb5dc60c83dfbec29c79203d6e5f4f6c450805d2b8dc566f1fabcdf49a93b0"));
/** Leave / abandon current program entirely (no auto-replacement). */
var abandonProgram = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("75941c3f22f18a3c6aef4550ffa7bc1475c743df3a517aaebe8057f21412cb03"));
//#endregion
export { publishProgram as a, listDiscoverPrograms as i, cloneProgram as n, updateProgramMeta as o, getPublicProgramDetail as r, abandonProgram as t };
