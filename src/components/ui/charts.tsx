import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const GRID = "rgba(42,49,56,0.65)";
const TICK = "#6B7580";
const ACCENT = "#F2C230";
const SURFACE = "#171B1F";

/** Compact premium tooltip */
function ChartTip({
  active,
  payload,
  label,
  labelFmt,
  valueFmt,
}: {
  active?: boolean;
  payload?: { value?: number; name?: string; color?: string }[];
  label?: string;
  labelFmt?: (l: string) => string;
  valueFmt?: (v: number, name?: string) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-rule/80 bg-sunken/95 px-3 py-2 shadow-2xl shadow-black/50 backdrop-blur-md">
      <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-text-3">
        {labelFmt ? labelFmt(String(label ?? "")) : String(label ?? "")}
      </p>
      <div className="space-y-1">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="size-1.5 rounded-full"
              style={{ background: p.color ?? ACCENT }}
            />
            <span className="num text-sm text-text">
              {valueFmt
                ? valueFmt(Number(p.value), p.name)
                : Number(p.value).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AxisX({
  dataKey,
  formatter,
}: {
  dataKey: string;
  formatter?: (v: string) => string;
}) {
  return (
    <XAxis
      dataKey={dataKey}
      tick={{ fill: TICK, fontSize: 10, fontWeight: 500 }}
      axisLine={false}
      tickLine={false}
      tickMargin={10}
      minTickGap={20}
      tickFormatter={formatter}
    />
  );
}

function AxisY({
  width = 36,
  domain,
}: {
  width?: number;
  domain?: [number, number];
}) {
  return (
    <YAxis
      tick={{ fill: TICK, fontSize: 10, fontWeight: 500 }}
      axisLine={false}
      tickLine={false}
      width={width}
      tickMargin={6}
      allowDecimals={false}
      domain={domain}
    />
  );
}

export function ProgressAreaChart({
  data,
  xKey,
  yKey,
  color = ACCENT,
  xFormatter,
  valueLabel = "Value",
  valueUnit = "",
  emptyHint,
}: {
  data: Record<string, string | number | null>[];
  xKey: string;
  yKey: string;
  color?: string;
  xFormatter?: (v: string) => string;
  valueLabel?: string;
  valueUnit?: string;
  emptyHint?: string;
}) {
  if (!data.length) {
    return (
      <div className="flex h-44 flex-col items-center justify-center gap-1 rounded-xl bg-raised/40 px-4">
        <p className="text-sm text-text-2">Veri yok</p>
        {emptyHint ? (
          <p className="max-w-[14rem] text-center text-xs text-text-3">{emptyHint}</p>
        ) : null}
      </div>
    );
  }

  const vals = data
    .map((d) => Number(d[yKey]))
    .filter((n) => !Number.isNaN(n));
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const pad = Math.max((max - min) * 0.12, max * 0.04, 1);
  const domain: [number, number] = [
    Math.max(0, Math.floor(min - pad)),
    Math.ceil(max + pad),
  ];

  const last = vals[vals.length - 1];
  const first = vals[0];
  const delta = last != null && first != null ? last - first : 0;
  const gradId = `g-${yKey.replace(/[^a-z0-9]/gi, "")}-${color.replace("#", "")}`;

  return (
    <div className="min-w-0">
      {last != null && (
        <div className="mb-2 flex items-end justify-between gap-2 px-0.5">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-text-3">
              Son
            </p>
            <p className="num text-2xl leading-none text-text">
              {last.toLocaleString()}
              <span className="ml-1 text-sm font-normal text-text-2">{valueUnit}</span>
            </p>
          </div>
          {vals.length > 1 && (
            <p
              className={`num text-sm ${delta > 0 ? "text-success" : delta < 0 ? "text-danger" : "text-text-2"}`}
            >
              {delta > 0 ? "+" : ""}
              {delta.toLocaleString()} {valueUnit}
            </p>
          )}
        </div>
      )}
      <div className="chart-box h-48 sm:h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.45} />
                <stop offset="55%" stopColor={color} stopOpacity={0.12} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
              <filter id={`glow-${gradId}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid
              stroke={GRID}
              vertical={false}
              strokeDasharray="0"
            />
            <AxisX dataKey={xKey} formatter={xFormatter} />
            <AxisY domain={domain} />
            <Tooltip
              cursor={{ stroke: color, strokeWidth: 1, strokeOpacity: 0.25 }}
              content={
                <ChartTip
                  labelFmt={xFormatter}
                  valueFmt={(v) =>
                    `${v.toLocaleString()}${valueUnit ? ` ${valueUnit}` : ""} · ${valueLabel}`
                  }
                />
              }
            />
            <Area
              type="monotone"
              dataKey={yKey}
              stroke={color}
              fill={`url(#${gradId})`}
              connectNulls
              isAnimationActive
              animationDuration={600}
              dot={false}
              activeDot={{
                r: 5,
                strokeWidth: 3,
                stroke: SURFACE,
                fill: color,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function MultiLineChart({
  data,
  xKey,
  series,
  xFormatter,
}: {
  data: Record<string, string | number | null>[];
  xKey: string;
  series: { key: string; label: string; color: string; visible: boolean }[];
  xFormatter?: (v: string) => string;
}) {
  const active = series.filter((s) => s.visible);
  if (!data.length || active.length === 0) {
    return (
      <div className="flex h-44 items-center justify-center rounded-xl bg-raised/40 text-sm text-text-2">
        Veri yok
      </div>
    );
  }

  return (
    <div className="chart-box h-48 sm:h-52">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID} vertical={false} />
          <AxisX dataKey={xKey} formatter={xFormatter} />
          <AxisY />
          <Tooltip
            cursor={{ stroke: GRID, strokeWidth: 1 }}
            content={
              <ChartTip
                labelFmt={xFormatter}
                valueFmt={(v, name) =>
                  `${v.toLocaleString()} cm${name ? ` · ${name}` : ""}`
                }
              />
            }
          />
          {active.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              connectNulls
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: SURFACE, fill: s.color }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function VolumeBarChart({
  data,
  emptyHint,
}: {
  data: { week: string; tonnage: number }[];
  emptyHint?: string;
}) {
  const allEmpty = data.every((v) => v.tonnage === 0);
  const total = data.reduce((s, d) => s + d.tonnage, 0);
  const peak = Math.max(...data.map((d) => d.tonnage), 0);
  const last = data[data.length - 1]?.tonnage ?? 0;

  return (
    <div className="min-w-0">
      <div className="mb-3 grid grid-cols-3 gap-2">
        <MiniStat label="12 hf toplam" value={fmtTon(total)} />
        <MiniStat label="Bu hafta" value={fmtTon(last)} accent />
        <MiniStat label="Zirve" value={fmtTon(peak)} />
      </div>
      <div className="chart-box h-44 sm:h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 2, left: 0, bottom: 0 }} barCategoryGap="22%">
            <CartesianGrid stroke={GRID} vertical={false} />
            <AxisX dataKey="week" />
            <AxisY width={34} />
            <Tooltip
              cursor={{ fill: "rgba(242,194,48,0.06)" }}
              content={
                <ChartTip
                  valueFmt={(v) => `${Number(v).toLocaleString()} kg`}
                />
              }
            />
            <Bar dataKey="tonnage" radius={[6, 6, 2, 2]} maxBarSize={22}>
              {data.map((entry, i) => {
                const isLast = i === data.length - 1;
                const fill =
                  entry.tonnage <= 0
                    ? "rgba(242,194,48,0.12)"
                    : isLast
                      ? ACCENT
                      : "rgba(242,194,48,0.55)";
                return <Cell key={i} fill={fill} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {allEmpty && emptyHint ? (
        <p className="mt-2 text-center text-xs text-text-2">{emptyHint}</p>
      ) : null}
    </div>
  );
}

function MiniStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg bg-raised/50 px-2.5 py-2">
      <p className="text-[10px] uppercase tracking-wide text-text-3">{label}</p>
      <p className={`num mt-0.5 text-lg leading-none ${accent ? "text-accent" : "text-text"}`}>
        {value}
      </p>
    </div>
  );
}

function fmtTon(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}t`;
  return n.toLocaleString();
}

export { formatChartDate } from "@/lib/utils";
