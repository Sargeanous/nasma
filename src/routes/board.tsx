import { createFileRoute } from "@tanstack/react-router";
import { isRoleId, sessionForRole } from "@/lib/session";
import type { RoleId } from "@/data/types";

export const Route = createFileRoute("/board")({
  validateSearch: (search: Record<string, unknown>): { role: RoleId } => ({
    role: isRoleId(search["role"] as string) ? (search["role"] as RoleId) : "fm_supervisor",
  }),
  head: () => ({
    meta: [
      { title: "Nasma Board - FM contract supervisor" },
      {
        name: "description",
        content:
          "The Nasma iPad board for FM contract supervisors: open work orders, SLA position, team load and the PPM calendar.",
      },
      { property: "og:title", content: "Nasma Board - FM contract supervisor" },
      { property: "og:description", content: "A working board, landscape, on site." },
    ],
  }),
  component: BoardPlaceholder,
});

function BoardPlaceholder() {
  const { role } = Route.useSearch();
  const { person } = sessionForRole(role);
  return (
    <main className="flex min-h-screen items-center justify-center bg-sand px-4">
      <p className="t-body text-muted-ink">Supervisor board for {person.name_en}, stage 6.</p>
    </main>
  );
}
