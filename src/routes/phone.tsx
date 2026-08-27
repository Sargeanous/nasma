import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone/PhoneFrame";
import { StaffHome } from "@/components/phone/StaffHome";
import { TechnicianHome } from "@/components/phone/TechnicianHome";
import { useDirection, type Lang } from "@/lib/direction";
import { isRoleId, sessionForRole } from "@/lib/session";
import type { RoleId } from "@/data/types";

type PhoneSearch = { role: RoleId; lang: Lang };

export const Route = createFileRoute("/phone")({
  validateSearch: (search: Record<string, unknown>): PhoneSearch => ({
    role: isRoleId(search["role"] as string) ? (search["role"] as RoleId) : "imam",
    lang: search["lang"] === "en" ? "en" : "ar",
  }),
  head: () => ({
    meta: [
      { title: "Nasma Phone - The mosque team" },
      {
        name: "description",
        content:
          "The Nasma phone surface for imams, muezzins, caretakers and technicians: prayer times, daily tasks, ten second fault reporting, utilities and monthly maintenance.",
      },
      { property: "og:title", content: "Nasma Phone - The mosque team" },
      {
        property: "og:description",
        content: "Arabic first, one hand, under two minutes a day.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PhoneSurface,
});

function PhoneSurface() {
  const { role, lang } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { setLang } = useDirection();
  const { person } = sessionForRole(role);

  useEffect(() => {
    setLang(lang);
  }, [lang, setLang]);

  return (
    <PhoneFrame
      initials={person.initials}
      onSwitchLang={() =>
        navigate({ search: (prev) => ({ ...prev, lang: prev.lang === "ar" ? "en" : "ar" }) })
      }
    >
      {person.role === "fm_technician" ? (
        <TechnicianHome person={person} />
      ) : (
        <StaffHome person={person} />
      )}
    </PhoneFrame>
  );
}
