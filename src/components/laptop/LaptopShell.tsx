import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDirection } from "@/lib/direction";
import { Wordmark } from "@/components/nasma/Wordmark";
import { DatePair, Avatar, NamePair } from "@/components/nasma/pairs";
import type { Person } from "@/data/types";

export type TabId = "fleet" | "map" | "maintenance" | "twin" | "cooling" | "access";

export const laptopTabs: { id: TabId; en: string; ar: string }[] = [
  { id: "fleet", en: "Fleet overview", ar: "نظرة الأسطول" },
  { id: "map", en: "Map", ar: "الخريطة" },
  { id: "maintenance", en: "Maintenance", ar: "الصيانة" },
  { id: "twin", en: "Mosque twin", ar: "التوأم الرقمي" },
  { id: "cooling", en: "Cooling", ar: "التبريد" },
  { id: "access", en: "Users and access", ar: "المستخدمون والصلاحيات" },
];

export function LaptopShell({
  person,
  tab,
  onTab,
  onSwitchLang,
  children,
}: {
  person: Person;
  tab: TabId;
  onTab: (tab: TabId) => void;
  onSwitchLang: () => void;
  children: ReactNode;
}) {
  const { t, lang } = useDirection();

  return (
    <div className="min-h-screen bg-sand">
      <header className="sticky top-0 z-40 bg-deep-green">
        <div className="mx-auto flex max-w-[1420px] items-center gap-6 px-6 py-2.5">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              aria-label={t("Back to role selection", "العودة إلى اختيار الدور")}
              className="-ms-2 inline-flex size-9 items-center justify-center rounded-[9px] text-primary-foreground/80 transition-calm hover:bg-primary-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light"
            >
              <ChevronLeft className="icon-directional size-5 stroke-[1.5]" aria-hidden="true" />
            </Link>
            <Wordmark tone="light" />
            <span className="rounded-[9px] border border-primary-foreground/25 px-2.5 py-1 t-micro text-primary-foreground/85">
              {t("LAPTOP", "حاسوب")}
            </span>
          </div>

          <nav
            className="flex flex-1 items-center gap-1 overflow-x-auto"
            aria-label={t("Sections", "الأقسام")}
          >
            {laptopTabs.map((item) => {
              const active = item.id === tab;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTab(item.id)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "shrink-0 rounded-[9px] px-3 py-2 t-body-sm transition-calm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light",
                    active
                      ? "bg-primary-foreground/12 font-medium text-primary-foreground shadow-[inset_0_-2px_0_0_var(--color-gold)]"
                      : "text-primary-foreground/75 hover:bg-primary-foreground/8 hover:text-primary-foreground",
                  )}
                >
                  {t(item.en, item.ar)}
                </button>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-4">
            <DatePair tone="light" align="end" />
            <span className="h-8 w-px bg-primary-foreground/20" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <div className="text-end">
                <NamePair
                  en={person.name_en}
                  ar={person.name_ar}
                  tone="light"
                  size="sm"
                  className="max-w-[190px]"
                />
                <p className="t-caption text-primary-foreground/60">
                  {t(person.scope_en, person.scope_ar)}
                </p>
              </div>
              <Avatar initials={person.initials} tone="gold" size={36} />
            </div>
            <Link
              to="/"
              className="rounded-[9px] border border-primary-foreground/25 px-3 py-2 t-caption text-primary-foreground/85 transition-calm hover:bg-primary-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light"
            >
              {t("Switch role", "تبديل الدور")}
            </Link>
            <button
              type="button"
              onClick={onSwitchLang}
              className="rounded-[9px] border border-primary-foreground/25 px-3 py-2 t-caption text-primary-foreground/85 transition-calm hover:bg-primary-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light"
              lang={lang === "ar" ? "en" : "ar"}
            >
              {lang === "ar" ? "EN" : "ع"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1420px] px-6 py-6">{children}</main>
    </div>
  );
}
