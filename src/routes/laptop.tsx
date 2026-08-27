import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { isRoleId, sessionForRole } from "@/lib/session";
import { useDirection, type Lang } from "@/lib/direction";
import { LaptopShell, type TabId } from "@/components/laptop/LaptopShell";
import { FleetOverview } from "@/components/laptop/FleetOverview";
import { MapView } from "@/components/laptop/MapView";
import { MaintenanceView } from "@/components/laptop/MaintenanceView";
import { CoolingView } from "@/components/laptop/CoolingView";
import { AccessView } from "@/components/laptop/AccessView";
import { EmptyState } from "@/components/nasma/primitives";
import type { RoleId } from "@/data/types";

const tabIds: TabId[] = ["fleet", "map", "maintenance", "twin", "cooling", "access"];

type LaptopSearch = { role: RoleId; lang: Lang; tab: TabId };

export const Route = createFileRoute("/laptop")({
  validateSearch: (search: Record<string, unknown>): LaptopSearch => ({
    role: isRoleId(search["role"] as string) ? (search["role"] as RoleId) : "hq_admin",
    lang: search["lang"] === "ar" ? "ar" : "en",
    tab: tabIds.includes(search["tab"] as TabId) ? (search["tab"] as TabId) : "fleet",
  }),
  head: () => ({
    meta: [
      { title: "Nasma Fleet - Awqaf oversight" },
      {
        name: "description",
        content:
          "The Nasma laptop surface: fleet overview, map, maintenance ranking, mosque twin, cooling and access control across all 12 mosques.",
      },
      { property: "og:title", content: "Nasma Fleet - Awqaf oversight" },
      { property: "og:description", content: "Fleet oversight across all 12 mosques." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LaptopSurface,
});

function LaptopSurface() {
  const { role, lang, tab } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { setLang, t } = useDirection();
  const { person } = sessionForRole(role);

  useEffect(() => {
    setLang(lang);
  }, [lang, setLang]);

  const go = (next: Partial<LaptopSearch>) =>
    navigate({ search: (prev: LaptopSearch) => ({ ...prev, ...next }) });

  return (
    <LaptopShell
      person={person}
      tab={tab}
      onTab={(next) => go({ tab: next })}
      onSwitchLang={() => go({ lang: lang === "ar" ? "en" : "ar" })}
    >
      {tab === "fleet" && <FleetOverview onOpenMosque={() => go({ tab: "twin" })} />}
      {tab === "map" && <MapView onOpenMosque={() => go({ tab: "twin" })} />}
      {tab === "maintenance" && <MaintenanceView />}
      {tab === "cooling" && <CoolingView />}
      {tab === "access" && <AccessView viewerRole={role} />}
      {tab === "twin" && (
        <EmptyState
          line={t(
            "The mosque twin arrives in the next stage.",
            "التوأم الرقمي للمسجد يصل في المرحلة القادمة.",
          )}
        />
      )}
    </LaptopShell>
  );
}
