import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BoardFrame } from "@/components/board/BoardFrame";
import { SupervisorBoard } from "@/components/board/SupervisorBoard";
import { useDirection, type Lang } from "@/lib/direction";
import { isRoleId, sessionForRole } from "@/lib/session";
import { portfolioFor } from "@/data/board";
import type { RoleId } from "@/data/types";

type BoardSearch = { role: RoleId; lang: Lang };

export const Route = createFileRoute("/board")({
  validateSearch: (search: Record<string, unknown>): BoardSearch => ({
    role: isRoleId(search["role"] as string) ? (search["role"] as RoleId) : "fm_supervisor",
    lang: search["lang"] === "en" ? "en" : "ar",
  }),
  head: () => ({
    meta: [
      { title: "Nasma Board - FM contract supervisor" },
      {
        name: "description",
        content:
          "The Nasma iPad board for FM contract supervisors: open work orders, SLA position, team load and the planned maintenance calendar.",
      },
      { property: "og:title", content: "Nasma Board - FM contract supervisor" },
      { property: "og:description", content: "A working board, landscape, on site." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BoardSurface,
});

function BoardSurface() {
  const { role, lang } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { setLang, t } = useDirection();
  const { person } = sessionForRole(role);
  const count = portfolioFor(person.id).length;

  useEffect(() => {
    setLang(lang);
  }, [lang, setLang]);

  return (
    <BoardFrame
      person={person}
      deviceLabel={t("FM SUPERVISOR", "مشرف الصيانة")}
      contractLine={t(
        `${person.contractor ?? ""} | ${count} mosques`,
        `${person.contractor ?? ""} | ${count} مساجد`,
      )}
      onSwitchLang={() =>
        navigate({ search: (prev) => ({ ...prev, lang: prev.lang === "ar" ? "en" : "ar" }) })
      }
    >
      <SupervisorBoard person={person} />
    </BoardFrame>
  );
}
