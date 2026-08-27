import { createFileRoute } from "@tanstack/react-router";
import { isRoleId, sessionForRole } from "@/lib/session";
import type { RoleId } from "@/data/types";

export const Route = createFileRoute("/phone")({
  validateSearch: (search: Record<string, unknown>): { role: RoleId } => ({
    role: isRoleId(search["role"] as string) ? (search["role"] as RoleId) : "imam",
  }),
  head: () => ({
    meta: [
      { title: "Nasma Phone - Mosque team" },
      {
        name: "description",
        content:
          "The Nasma phone surface for imams, muezzins, caretakers and technicians: prayer times, tasks, fault reporting and utilities.",
      },
      { property: "og:title", content: "Nasma Phone - Mosque team" },
      {
        property: "og:description",
        content: "Arabic first, one hand, under two minutes a day.",
      },
    ],
  }),
  component: PhonePlaceholder,
});

function PhonePlaceholder() {
  const { role } = Route.useSearch();
  const { person } = sessionForRole(role);
  return (
    <main className="flex min-h-screen items-center justify-center bg-sand px-4">
      <p className="t-body text-muted-ink">Phone surface for {person.name_en}, stage 5.</p>
    </main>
  );
}
