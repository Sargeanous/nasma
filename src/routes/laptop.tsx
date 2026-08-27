import { createFileRoute } from "@tanstack/react-router";
import { isRoleId, sessionForRole } from "@/lib/session";
import type { RoleId } from "@/data/types";

export const Route = createFileRoute("/laptop")({
  validateSearch: (search: Record<string, unknown>): { role: RoleId } => ({
    role: isRoleId(search["role"] as string) ? (search["role"] as RoleId) : "hq_admin",
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
    ],
  }),
  component: LaptopPlaceholder,
});

function LaptopPlaceholder() {
  const { role } = Route.useSearch();
  const { person } = sessionForRole(role);
  return (
    <main className="flex min-h-screen items-center justify-center bg-sand px-4">
      <p className="t-body text-muted-ink">Fleet surface for {person.name_en}, stage 7.</p>
    </main>
  );
}
