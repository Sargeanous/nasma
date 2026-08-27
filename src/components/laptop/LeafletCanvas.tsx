import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useDirection } from "@/lib/direction";
import { mosque, mosques, mosqueUrgency, ordersForMosque } from "@/data";

const colour = {
  alert: "#B3372E",
  warning: "#B4690E",
  clear: "#1F7A4D",
} as const;

function radiusFor(capacity: number) {
  return 8 + Math.sqrt(capacity) / 3.4;
}

function Recenter({ id }: { id: string }) {
  const map = useMap();
  useEffect(() => {
    const m = mosque(id);
    map.flyTo([m.lat, m.lng], map.getZoom() < 9 ? 9 : map.getZoom(), { duration: 0.2 });
  }, [id, map]);
  return null;
}

export default function LeafletCanvas({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const { t } = useDirection();
  const [tilesFailed, setTilesFailed] = useState(false);
  const failures = useRef(0);

  if (tilesFailed) {
    return (
      <div className="flex h-[620px] flex-col gap-2 overflow-auto p-4">
        <p className="t-caption text-muted-ink">
          {t(
            "Map tiles did not load. The 12 mosques are listed instead.",
            "تعذر تحميل خرائط الموقع. المساجد الاثنا عشر معروضة كقائمة.",
          )}
        </p>
        {mosques.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelect(m.id)}
            className="rounded-[9px] border border-hairline bg-sand-2/50 px-3 py-2 text-start t-body-sm text-ink hover:bg-sand-2"
          >
            {t(m.name_en, m.name_ar)}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="h-[620px]" dir="ltr">
      <MapContainer
        center={[24.35, 54.6]}
        zoom={8}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", background: "var(--color-sand-3)" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{
            tileerror: () => {
              failures.current += 1;
              if (failures.current > 12) setTilesFailed(true);
            },
          }}
        />
        <Recenter id={selectedId} />
        {mosques.map((m) => {
          const urgency = mosqueUrgency(m.id);
          const open = ordersForMosque(m.id).filter((w) => w.status !== "closed").length;
          const c = colour[urgency];
          return (
            <div key={m.id}>
              {urgency === "alert" ? (
                <CircleMarker
                  center={[m.lat, m.lng]}
                  radius={radiusFor(m.capacity) + 9}
                  pathOptions={{
                    color: c,
                    weight: 1,
                    dashArray: "3 4",
                    fill: false,
                    opacity: 0.7,
                  }}
                  interactive={false}
                />
              ) : null}
              <CircleMarker
                center={[m.lat, m.lng]}
                radius={radiusFor(m.capacity)}
                pathOptions={{
                  color: c,
                  weight: m.id === selectedId ? 3 : 1.5,
                  fillColor: c,
                  fillOpacity: m.id === selectedId ? 0.5 : 0.28,
                }}
                eventHandlers={{ click: () => onSelect(m.id) }}
              >
                <Tooltip direction="top" offset={[0, -6]}>
                  <span className="t-caption">
                    {t(m.name_en, m.name_ar)}
                    {" | "}
                    {t(`${open} open`, `${open} مفتوح`)}
                  </span>
                </Tooltip>
              </CircleMarker>
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
}
