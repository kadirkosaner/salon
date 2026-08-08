import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DDxD9vPu.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/social-gX42t5sk.js
/** Own profile hub (stats, measures, activity). */
var getMyProfileHub = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("dcffd40a8afe60207067f5b87cecae9756d9504ba2c8232485aae25fbe0e1074"));
var searchUsers = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((q) => q).handler(createSsrRpc("d05e65867b4933b54ef5627cd1ae652e99f56d8ef8b17e77de48c8b6202812c1"));
var listFollowing = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("77aefd561628bc160bf92f337ebc8febab564be724c1bb0d561ff8b10d5edd2a"));
var listFollowers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("807140b5c76a90c2fad6097751739cd559fc4f2f5bd23001e96fc44ee9a9ad30"));
var getUserProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((userId) => userId).handler(createSsrRpc("19d1cb38e56874c5c5f6510e87194380872bf11f93bf1cce71905e981218f32a"));
var followUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((userId) => userId).handler(createSsrRpc("c7a400c7f9b0406c032c6adbaba9a904b310de1d4d2546b4498d581195683f76"));
var unfollowUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((userId) => userId).handler(createSsrRpc("5068934b9dde26ae93ddd83a0a2b8194a6c3c5e7f20ec10f7f2deed2d93e3017"));
//#endregion
export { listFollowing as a, listFollowers as i, getMyProfileHub as n, searchUsers as o, getUserProfile as r, unfollowUser as s, followUser as t };
