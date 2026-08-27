import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Book,
  Building2,
  ChevronRight,
  ClipboardList,
  Laptop,
  Map,
  Megaphone,
  Monitor,
  Smartphone,
  SprayCan,
  Tablet,
  Wrench,
} from "lucide-react";
import type { ReactNode } from "react";
import { Wordmark } from "@/components/nasma/Wordmark";
import { DatePair } from "@/components/nasma/pairs";
import { Chip } from "@/components/nasma/primitives";
import { useDirection } from "@/lib/direction";
import { roleCards, deviceLabels } from "@/data/roles";
import { routeForRole } from "@/lib/session";
import type { DeviceClass } from "@/data/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nasma - Select a role to enter" },
      {
        name: "description",
        content:
          "Nasma, the mosque operations platform for Awqaf Abu Dhabi. Select a role to enter: HQ administrator, regional supervisor, FM contract supervisor, imam, muezzin, caretaker or FM technician.",
      },
      { property: "og:title", content: "Nasma - Select a role to enter" },
      {
        property: "og:description",
        content:
          "Mosque operations for Awqaf Abu Dhabi. Each role opens on the device that job is actually done on.",
      },
    ],
  }),
  component: AccessGate,
});

const icons: Record<string, ReactNode> = {
  building: <Building2 className="size-5 stroke-[1.5]" aria-hidden="true" />,
  map: <Map className="size-5 stroke-[1.5]" aria-hidden="true" />,
  clipboard: <ClipboardList className="size-5 stroke-[1.5]" aria-hidden="true" />,
  book: <Book className="size-5 stroke-[1.5]" aria-hidden="true" />,
  megaphone: <Megaphone className="size-5 stroke-[1.5]" aria-hidden="true" />,
  broom: <SprayCan className="size-5 stroke-[1.5]" aria-hidden="true" />,
  wrench: <Wrench className="size-5 stroke-[1.5]" aria-hidden="true" />,
};

const deviceIcons: Record<DeviceClass, ReactNode> = {
  laptop: <Laptop className="size-3.5 stroke-[1.5]" aria-hidden="true" />,
  ipad: <Tablet className="size-3.5 stroke-[1.5]" aria-hidden="true" />,
  phone: <Smartphone className="size-3.5 stroke-[1.5]" aria-hidden="true" />,
};

function AccessGate() {
  const { t, lang, toggleLang } = useDirection();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-sand">
      <header className="border-b border-hairline bg-deep-green">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-4">
            <Wordmark tone="light" size="lg" />
            <span className="hidden h-7 w-px bg-primary-foreground/20 sm:block" aria-hidden="true" />
            <span className="hidden t-caption text-primary-foreground/70 sm:block">
              {t(
                "Awqaf Abu Dhabi - mosque operations",
                "أوقاف أبوظبي - تشغيل المساجد",
              )}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <DatePair tone="light" align="end" />
            <button
              onClick={toggleLang}
              className="min-h-11 rounded-[9px] border border-primary-foreground/30 px-3 t-body-sm text-primary-foreground transition-calm hover:bg-primary-foreground/10"
            >
              {lang === "ar" ? "EN" : "ع"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] px-6 py-10">
        <div className="relative overflow-hidden rounded-[16px] border border-hairline bg-card px-6 py-7">
          <div className="geo-watermark pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative max-w-[70ch]">
            <h1 className="t-heading text-ink">{t("Select a role to enter.", "اختر الدور للدخول.")}</h1>
            <p className="mt-2 t-body text-muted-ink">
              {t(
                "Access is enforced on the server, so the role decides what the platform returns, not just what it draws. Each role opens on the device that job is actually done on.",
                "تُطبق الصلاحيات على الخادم، فالدور يحدد ما يعيده النظام لا ما يرسمه فقط. وكل دور يفتح على الجهاز الذي يُنجز عليه العمل فعلا.",
              )}
            </p>
          </div>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roleCards.map((role) => (
            <li key={role.id}>
              <button
                type="button"
                onClick={() => navigate({ to: routeForRole(role.id), search: { role: role.id } })}
                className="group flex h-full w-full flex-col rounded-[16px] border border-hairline bg-card p-5 text-start shadow-soft transition-calm hover:border-green/40 hover:shadow-lift"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-[9px] border border-green/20 bg-green/8 text-green">
                    {icons[role.icon]}
                  </span>
                  <ChevronRight
                    className="icon-directional mt-2 size-4 stroke-[1.5] text-muted-ink transition-calm group-hover:text-green"
                    aria-hidden="true"
                  />
                </div>

                <h2 className="mt-4 t-title text-ink">{t(role.name_en, role.name_ar)}</h2>
                <p className="t-caption text-muted-ink">
                  <span
                    dir={lang === "ar" ? "ltr" : "rtl"}
                    className={lang === "ar" ? "inline-block" : "font-arabic inline-block"}
                  >
                    {lang === "ar" ? role.name_en : role.name_ar}
                  </span>
                </p>

                <p className="mt-2 flex-1 t-body-sm text-muted-ink">
                  {t(role.does_en, role.does_ar)}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Chip tone="neutral">{t(role.scope_en, role.scope_ar)}</Chip>
                  <Chip tone="green" icon={deviceIcons[role.device]}>
                    {t(deviceLabels[role.device].en, deviceLabels[role.device].ar)}
                  </Chip>
                  <span className="ms-auto inline-flex items-center gap-1 t-caption font-medium text-green">
                    {t("Enter", "دخول")}
                    <ChevronRight className="icon-directional size-3.5 stroke-[1.5]" aria-hidden="true" />
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-6 flex items-center gap-2 t-caption text-muted-ink">
          <Monitor className="size-3.5 stroke-[1.5]" aria-hidden="true" />
          {t(
            "The device is a consequence of the role, not a separate choice. There is no password step in this build.",
            "الجهاز نتيجة للدور وليس خيارا منفصلا. ولا توجد خطوة كلمة مرور في هذه النسخة.",
          )}
        </p>
      </div>
    </main>
  );
}
