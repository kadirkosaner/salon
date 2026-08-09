import { r as createServerFn } from "./ssr.mjs";
import { gn as object, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { _ as v, a as noInput, l as positiveId, t as authMiddleware } from "./validation-BVPcnxwj.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D75-wYbG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/posts-w_r8eL4Q.js
var postBody = string().trim().min(1).max(500);
function extractMentions(body) {
	const hits = body.match(/@([a-zA-Z0-9_]{3,20})/g) ?? [];
	return [...new Set(hits.map((h) => h.slice(1).toLowerCase()))];
}
var createPost = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	body: postBody,
	attachedWorkoutId: positiveId.optional().nullable(),
	attachedProgramId: positiveId.optional().nullable()
}))).handler(createSsrRpc("9a441e5ecf31d0e6db8f41b458bd431e94be334995ce09f28fde78c493ae50b7"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	id: positiveId,
	body: postBody
}))).handler(createSsrRpc("8bbcdf3ab074c88a163788bcf79a696ab81d4768cbf63ee63c532564f7c53463"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(positiveId)).handler(createSsrRpc("db2bb5661c551c81866504ac9d5724cb106fca369d7130d1f99763e692ed75a9"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	id: positiveId,
	reason: string().trim().max(200).optional()
}))).handler(createSsrRpc("b6cbcd750f78dad39869f5ba2141dbf3165667d81bd2d703a729a45e689cd07e"));
var listMyRecentWorkouts = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(noInput).handler(createSsrRpc("e79740d2468a191b43278a2a4896d553f9f01c623b41dfac83ec1cb19135fc03"));
//#endregion
export { createPost, extractMentions, listMyRecentWorkouts };
