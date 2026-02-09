"use client";

import { useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
import type { SalesIndexItem, VendingMachineMoneyStatus } from "@/lib/api/types";

type Point = {
  id: number;
  type: string;
  lat: number;
  lng: number;
};

const points: Point[] = [
  { id: 1, type: "A", lat: 59.9286, lng: 30.2929 },
  { id: 16, type: "M", lat: 59.9304, lng: 30.3156 },
  { id: 124, type: "B", lat: 59.9257, lng: 30.3354 },
  { id: 6512, type: "B", lat: 59.942, lng: 30.3472 },
  { id: 62010, type: "M", lat: 59.9189, lng: 30.3142 },
];

function colorByIndex(index?: number) {
  if (index == null) return "#94a3b8";
  if (index >= 70) return "#16a34a";
  if (index >= 40) return "#f59e0b";
  return "#ef4444";
}

export function VendingMap({
  salesIndex,
  moneyFill,
}: {
  salesIndex?: SalesIndexItem[];
  moneyFill?: VendingMachineMoneyStatus[];
}) {
  const indexById = useMemo(() => {
    const map = new Map<number, number>();
    for (const item of salesIndex ?? []) map.set(item.machineId, item.percentage);
    return map;
  }, [salesIndex]);

  const moneyById = useMemo(() => {
    const map = new Map<number, VendingMachineMoneyStatus>();
    for (const item of moneyFill ?? []) map.set(item.machineId, item);
    return map;
  }, [moneyFill]);

  return (
    <MapContainer
      center={[59.9311, 30.3162]}
      zoom={13}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {points.map((p, i) => {
        const idx = indexById.get(p.id);
        const m = moneyById.get(p.id);
        const fill =
          m == null ? undefined : Math.round((m.coinFillPercentage + m.banknotesFillPercentage) / 2);
        const color = colorByIndex(idx);
        const icon = L.divIcon({
          className: "vm-pin-wrapper",
          html: `<div class="vm-pin" style="--vm-pin:${color}">${i + 1}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });
        return (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={icon}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              <div className="text-xs">
                <div className="font-semibold">
                  ТА {p.type}-{p.id}
                </div>
                <div>Индекс продаж: {idx ?? "—"}%</div>
                <div>Заполненность денег: {fill ?? "—"}%</div>
              </div>
            </Tooltip>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

