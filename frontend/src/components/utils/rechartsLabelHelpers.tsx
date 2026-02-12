export type RechartsLabelRenderProps = {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  value?: unknown;
  payload?: unknown;
  viewBox?: unknown;
};

export function toFiniteNumber(v: unknown): number | null {
  const n =
    typeof v === "number" ? v : v == null ? Number.NaN : Number(v as never);
  return Number.isFinite(n) ? n : null;
}

export function getLabelBoxXYW(props: RechartsLabelRenderProps): {
  x: number;
  y: number;
  width: number;
} | null {
  const x = toFiniteNumber(props.x);
  const y = toFiniteNumber(props.y);
  const width = toFiniteNumber(props.width);
  if (x == null || y == null || width == null) return null;
  return { x, y, width };
}

export function getLabelBoxXYWH(props: RechartsLabelRenderProps): {
  x: number;
  y: number;
  width: number;
  height: number;
} | null {
  const x = toFiniteNumber(props.x);
  const y = toFiniteNumber(props.y);
  const width = toFiniteNumber(props.width);
  const height = toFiniteNumber(props.height);
  if (x == null || y == null || width == null || height == null) return null;
  return { x, y, width, height };
}

export function renderValuePill(
  props: RechartsLabelRenderProps,
  opts?: {
    bottomOffset?: number;
    minTopInset?: number;
  },
) {
  const box = getLabelBoxXYWH(props);
  if (!box) return null;

  const num = toFiniteNumber(props.value);
  if (num == null) return null;

  const label = String(num);
  const pillHeight = 20;
  const pillPaddingX = 10;
  const pillWidth = Math.max(34, label.length * 7 + pillPaddingX * 2);
  const cx = box.x + box.width / 2;
  const pillX = cx - pillWidth / 2;
  const bottomOffset = opts?.bottomOffset ?? 8;
  const unclampedPillY = box.y + box.height - pillHeight - bottomOffset;
  const pillY =
    typeof opts?.minTopInset === "number"
      ? Math.max(box.y + opts.minTopInset, unclampedPillY)
      : unclampedPillY;

  return (
    <g>
      <rect
        x={pillX}
        y={pillY}
        width={pillWidth}
        height={pillHeight}
        rx={10}
        ry={10}
        fill="#ffffff"
        stroke="rgba(16,24,40,0.08)"
      />
      <text
        x={cx}
        y={pillY + 14}
        textAnchor="middle"
        fill="rgba(16,24,40,0.92)"
        fontSize={12}
        fontWeight={600}
      >
        {label}
      </text>
    </g>
  );
}

export function renderFixedYPctLabel(
  props: RechartsLabelRenderProps,
  labelY: number,
  opts?: { suffix?: string },
) {
  const box = getLabelBoxXYW(props);
  if (!box) return null;

  const v = toFiniteNumber(props.value);
  if (v == null) return null;

  const onFill = labelY >= box.y + 2;
  const fill = onFill ? "rgba(255,255,255,0.96)" : "rgba(71,84,103,0.55)";
  const stroke = onFill ? "rgba(0,0,0,0.18)" : "transparent";
  const strokeWidth = onFill ? 2 : 0;
  const suffix = opts?.suffix ?? "%";

  return (
    <text
      x={box.x + box.width / 2}
      y={labelY}
      textAnchor="middle"
      fill={fill}
      fontSize={12}
      fontWeight={600}
      stroke={stroke}
      strokeWidth={strokeWidth}
      paintOrder="stroke"
    >
      {v}
      {suffix}
    </text>
  );
}
