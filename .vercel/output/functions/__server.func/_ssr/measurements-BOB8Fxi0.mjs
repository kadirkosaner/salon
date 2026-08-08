import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DDxD9vPu.mjs";
import { r as getSql } from "./db-CFyZej8J.mjs";
import { a as ensureUserSeeded, n as createServerRpc } from "./seed-Dy9IlGmL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/measurements-BOB8Fxi0.js
var listMeasurements_createServerFn_handler = createServerRpc({
	id: "12dd2d90164a34fb13b4cfbbb7e0f7ffaf45f65b4e0fad6c86c102bbd0897ab3",
	name: "listMeasurements",
	filename: "src/lib/server/measurements.ts"
}, (opts) => listMeasurements.__executeServer(opts));
var listMeasurements = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMeasurements_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	return sql`
      select id, date::text as date,
             body_weight::text as body_weight,
             waist::text as waist,
             chest::text as chest,
             arm::text as arm,
             thigh::text as thigh
      from body_measurements
      where user_id = ${context.userId}
      order by date desc
    `;
});
var saveMeasurement_createServerFn_handler = createServerRpc({
	id: "e70b887802d47d726afcf47a06dddba5f338a5cd98547832400a2c3259439f88",
	name: "saveMeasurement",
	filename: "src/lib/server/measurements.ts"
}, (opts) => saveMeasurement.__executeServer(opts));
var saveMeasurement = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveMeasurement_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	await sql`
      insert into body_measurements (
        user_id, date, body_weight, waist, chest, arm, thigh
      ) values (
        ${context.userId}, ${data.date}::date,
        ${data.body_weight ?? null}, ${data.waist ?? null},
        ${data.chest ?? null}, ${data.arm ?? null}, ${data.thigh ?? null}
      )
      on conflict (user_id, date) do update set
        body_weight = excluded.body_weight,
        waist = excluded.waist,
        chest = excluded.chest,
        arm = excluded.arm,
        thigh = excluded.thigh
    `;
	return { ok: true };
});
var deleteMeasurement_createServerFn_handler = createServerRpc({
	id: "3c5511a3cd708b6e095746b8ac3a22c9e37285c642d9a134c0993487ec8c9a05",
	name: "deleteMeasurement",
	filename: "src/lib/server/measurements.ts"
}, (opts) => deleteMeasurement.__executeServer(opts));
var deleteMeasurement = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(deleteMeasurement_createServerFn_handler, async ({ context, data: id }) => {
	await (await getSql())`
      delete from body_measurements
      where id = ${id} and user_id = ${context.userId}
    `;
	return { ok: true };
});
//#endregion
export { deleteMeasurement_createServerFn_handler, listMeasurements_createServerFn_handler, saveMeasurement_createServerFn_handler };
