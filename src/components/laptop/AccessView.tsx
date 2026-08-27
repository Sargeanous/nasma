import { useMemo, useState } from "react";
import { Check, Minus, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDirection } from "@/lib/direction";
import { BidiText } from "@/lib/bidi";
import { Card, CardHeader, Chip, Denied } from "@/components/nasma/primitives";
import { auditTrail, people, permissionMatrix, roleColumns } from "@/data";
import type { PermissionRow, RoleId } from "@/data/types";

const groupLabels = {
  maintenance: { en: "Maintenance", ar: "الصيانة" },
  cooling: { en: "Cooling and meters", ar: "التبريد والعدادات" },
  oversight: { en: "Oversight", ar: "الإشراف" },
} as const;

export function AccessView({ viewerRole }: { viewerRole: RoleId }) {
  const { t } = useDirection();
  const [hoverRole, setHoverRole] = useState<RoleId | null>(null);
  const canRead = viewerRole === "hq_admin" || viewerRole === "regional_supervisor";

  const groups = useMemo(() => {
    const keys = ["maintenance", "cooling", "oversight"] as const;
    return keys.map((k) => ({
      key: k,
      rows: permissionMatrix.filter((r) => r.group === k),
    }));
  }, []);

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader
          title={t("Who can do what", "من يستطيع ماذا")}
          sub={t(
            "The matrix is the server's rule, not a description of the interface. A refused action never reaches the data.",
            "المصفوفة هي قاعدة الخادم، لا وصفا للواجهة. الإجراء المرفوض لا يصل إلى البيانات أصلا.",
          )}
        />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse">
            <caption className="sr-only">
              {t("Permissions by role", "الصلاحيات حسب الدور")}
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky inset-inline-start-0 bg-card px-3 pb-3 text-start t-micro text-muted-ink"
                >
                  {t("PERMISSION", "الصلاحية")}
                </th>
                {roleColumns.map((c) => (
                  <th
                    key={c.id}
                    scope="col"
                    onMouseEnter={() => setHoverRole(c.id)}
                    onMouseLeave={() => setHoverRole(null)}
                    className={cn(
                      "px-2 pb-3 align-bottom t-micro transition-calm",
                      hoverRole === c.id ? "text-ink" : "text-muted-ink",
                    )}
                  >
                    {t(c.label_en, c.label_ar)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <RowGroup
                  key={g.key}
                  label={t(groupLabels[g.key].en, groupLabels[g.key].ar)}
                  rows={g.rows}
                  hoverRole={hoverRole}
                />
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 inline-flex items-center gap-2 t-caption text-muted-ink">
          <ShieldCheck className="size-3.5 stroke-[1.5] text-green" aria-hidden="true" />
          {t(
            "Every grant is scoped to the mosques a person holds, never the whole fleet.",
            "كل صلاحية محصورة بالمساجد التي يتولاها الشخص، لا بالأسطول كاملا.",
          )}
        </p>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <Card>
          <CardHeader
            title={t("People and scope", "الأشخاص والنطاق")}
            sub={t("Eight accounts across three regions.", "ثمانية حسابات في ثلاث مناطق.")}
          />
          <ul className="mt-3 divide-y divide-hairline">
            {people.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-3 py-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-green/10 t-caption text-green">
                  <BidiText>{p.initials}</BidiText>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate t-body-sm font-medium text-ink">
                    {t(p.name_en, p.name_ar)}
                  </span>
                  <span className="block truncate t-caption text-muted-ink">
                    {t(p.role_en, p.role_ar)} | {t(p.scope_en, p.scope_ar)}
                  </span>
                </span>
                <Chip tone="neutral" size="sm">
                  {t(
                    `${p.permission_count} permissions`,
                    `${p.permission_count} صلاحية`,
                  )}
                </Chip>
                <Chip tone="neutral" size="sm">
                  {p.device === "phone"
                    ? t("Phone", "هاتف")
                    : p.device === "ipad"
                      ? t("iPad", "آيباد")
                      : t("Laptop", "حاسوب")}
                </Chip>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title={t("Audit trail", "سجل التدقيق")}
            sub={t("Append only. Nothing here can be edited.", "إضافة فقط. لا شيء هنا قابل للتعديل.")}
          />
          {canRead ? (
            <ol className="mt-3 space-y-3">
              {auditTrail.map((e, i) => (
                <li key={`${e.timestamp}-${i}`} className="border-t border-hairline pt-3 first:border-t-0 first:pt-0">
                  <BidiText className="block t-caption text-muted-ink">{e.timestamp}</BidiText>
                  <p className="t-body-sm text-ink">{t(e.action_en, e.action_ar)}</p>
                  <p className="t-caption text-muted-ink">
                    {t(e.actor_en, e.actor_ar)} | {t(e.role_en, e.role_ar)} |{" "}
                    <BidiText>{e.object}</BidiText>
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <Denied className="mt-3" />
          )}
        </Card>
      </div>
    </div>
  );
}

function RowGroup({
  label,
  rows,
  hoverRole,
}: {
  label: string;
  rows: PermissionRow[];
  hoverRole: RoleId | null;
}) {
  const { t } = useDirection();
  return (
    <>
      <tr>
        <th
          scope="colgroup"
          colSpan={roleColumns.length + 1}
          className="bg-sand-2/70 px-3 py-1.5 text-start t-micro text-muted-ink"
        >
          {label}
        </th>
      </tr>
      {rows.map((r) => (
        <tr key={r.label_en} className="border-t border-hairline">
          <th scope="row" className="px-3 py-2.5 text-start t-body-sm font-normal text-ink">
            {t(r.label_en, r.label_ar)}
          </th>
          {roleColumns.map((c) => {
            const granted = r.granted.includes(c.id);
            return (
              <td
                key={c.id}
                className={cn(
                  "px-2 py-2.5 text-center transition-calm",
                  hoverRole === c.id && "bg-green/6",
                )}
              >
                <span className="sr-only">
                  {granted ? t("Allowed", "مسموح") : t("Not allowed", "غير مسموح")}
                </span>
                {granted ? (
                  <Check
                    className="mx-auto size-4 stroke-[2] text-green"
                    aria-hidden="true"
                  />
                ) : (
                  <Minus className="mx-auto size-3.5 stroke-[1.5] text-hairline" aria-hidden="true" />
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}
