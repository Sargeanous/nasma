import { useEffect, useState } from "react";
import {
  Camera,
  CheckCircle2,
  Mic,
  RotateCcw,
  Sparkles,
  Square,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BidiText } from "@/lib/bidi";
import { useDirection } from "@/lib/direction";
import { BottomSheet } from "@/components/nasma/BottomSheet";
import { Button } from "@/components/nasma/Button";
import { Meter } from "@/components/nasma/primitives";
import { GeometricMark } from "@/components/nasma/GeometricMark";
import { faultCategories, photoSuggestion } from "@/data/phone";
import { zones } from "@/data/prayer";
import type { FaultCategory } from "@/data/phone";

type Step = "capture" | "category" | "analysing" | "review" | "done";

export function FaultReportSheet({
  open,
  onClose,
  mosqueName,
}: {
  open: boolean;
  onClose: () => void;
  mosqueName: string;
}) {
  const { t } = useDirection();
  const [step, setStep] = useState<Step>("capture");
  const [captured, setCaptured] = useState(false);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [voiceNote, setVoiceNote] = useState<number | null>(null);
  const [category, setCategory] = useState<FaultCategory["id"] | null>(null);
  const [zone, setZone] = useState("women_hall");
  const [acceptedSuggestion, setAcceptedSuggestion] = useState(false);

  useEffect(() => {
    if (!recording) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [recording]);

  useEffect(() => {
    if (step !== "analysing") return;
    const id = window.setTimeout(() => setStep("review"), 1400);
    return () => window.clearTimeout(id);
  }, [step]);

  function reset() {
    setStep("capture");
    setCaptured(false);
    setRecording(false);
    setSeconds(0);
    setVoiceNote(null);
    setCategory(null);
    setAcceptedSuggestion(false);
  }

  function close() {
    onClose();
    window.setTimeout(reset, 250);
  }

  const titles: Record<Step, string> = {
    capture: t("Report a fault", "الإبلاغ عن عطل"),
    category: t("What is it", "ما نوع العطل"),
    analysing: t("Reading the photo", "قراءة الصورة"),
    review: t("Check and send", "المراجعة والإرسال"),
    done: t("Reported", "تم الإبلاغ"),
  };

  return (
    <BottomSheet
      open={open}
      onClose={close}
      title={titles[step]}
      className="mx-auto w-full max-w-[402px] sm:rounded-b-[28px]"
      footer={<Footer />}
    >
      {step === "capture" ? <CaptureStep /> : null}
      {step === "category" ? <CategoryStep /> : null}
      {step === "analysing" ? <AnalysingStep /> : null}
      {step === "review" ? <ReviewStep /> : null}
      {step === "done" ? <DoneStep /> : null}
    </BottomSheet>
  );

  function Footer() {
    if (step === "capture") {
      return (
        <Button variant="primary" full disabled={!captured} onClick={() => setStep("category")}>
          {t("Continue", "متابعة")}
        </Button>
      );
    }
    if (step === "category") {
      return (
        <Button variant="primary" full disabled={!category} onClick={() => setStep("analysing")}>
          {t("Continue", "متابعة")}
        </Button>
      );
    }
    if (step === "review") {
      return (
        <Button variant="primary" full onClick={() => setStep("done")}>
          {t("Send the report", "إرسال البلاغ")}
        </Button>
      );
    }
    if (step === "done") {
      return (
        <Button variant="primary" full onClick={close}>
          {t("Done", "تم")}
        </Button>
      );
    }
    return null;
  }

  function CaptureStep() {
    return (
      <div className="space-y-3">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] border border-hairline bg-ink/90">
          {captured ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-deep-green/90 text-primary-foreground">
              <CheckCircle2 className="size-8 stroke-[1.5]" aria-hidden="true" />
              <span className="t-body-sm">{t("Photo captured", "تم التقاط الصورة")}</span>
              <span className="t-caption text-primary-foreground/70">
                {t("Women's hall, ceiling unit", "مصلى النساء، وحدة السقف")}
              </span>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 flex items-center justify-center">
                <GeometricMark className="size-24 text-primary-foreground/15" />
              </div>
              <Corner className="start-3 top-3 border-s-2 border-t-2" />
              <Corner className="end-3 top-3 border-e-2 border-t-2" />
              <Corner className="bottom-3 start-3 border-b-2 border-s-2" />
              <Corner className="bottom-3 end-3 border-b-2 border-e-2" />
              <span className="absolute inset-x-0 bottom-3 text-center t-caption text-primary-foreground/70">
                {t("Point at the fault", "وجّه الكاميرا نحو العطل")}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setCaptured(true)}
            aria-label={t("Take the photo", "التقاط الصورة")}
            className="inline-flex size-16 items-center justify-center rounded-full border-4 border-hairline bg-card text-green shadow-soft transition-calm hover:border-green/40"
          >
            {captured ? (
              <RotateCcw className="size-6 stroke-[1.5]" aria-hidden="true" />
            ) : (
              <Camera className="size-6 stroke-[1.5]" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="rounded-[12px] border border-hairline bg-card p-3">
          <div className="flex items-center justify-between gap-3">
            <span className="t-body-sm text-ink">
              {t("Voice note, optional", "ملاحظة صوتية، اختيارية")}
            </span>
            <button
              type="button"
              onClick={() => {
                if (recording) {
                  setRecording(false);
                  setVoiceNote(seconds || 1);
                } else {
                  setSeconds(0);
                  setVoiceNote(null);
                  setRecording(true);
                }
              }}
              aria-label={recording ? t("Stop recording", "إيقاف التسجيل") : t("Record", "تسجيل")}
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-full border transition-calm",
                recording
                  ? "border-alert/30 bg-alert/10 text-alert"
                  : "border-hairline bg-sand-2 text-green",
              )}
            >
              {recording ? (
                <Square className="size-4 stroke-[1.5]" aria-hidden="true" />
              ) : (
                <Mic className="size-5 stroke-[1.5]" aria-hidden="true" />
              )}
            </button>
          </div>
          {recording || voiceNote !== null ? (
            <div className="mt-3 flex items-center gap-3">
              <Waveform active={recording} />
              <BidiText className="t-caption tnum text-muted-ink">
                {formatClock(recording ? seconds : (voiceNote ?? 0))}
              </BidiText>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  function CategoryStep() {
    return (
      <div className="space-y-4">
        <div>
          <p className="t-body-sm text-muted-ink">
            {t("Choose one. You can change it later.", "اختر واحدة. يمكنك تغييرها لاحقا.")}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {faultCategories.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={category === c.id}
                onClick={() => setCategory(c.id)}
                className={cn(
                  "min-h-11 rounded-[9px] border px-4 t-body-sm transition-calm",
                  category === c.id
                    ? "border-green bg-green/10 font-medium text-green"
                    : "border-hairline bg-card text-ink hover:bg-sand-2",
                )}
              >
                {t(c.label_en, c.label_ar)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="t-micro text-muted-ink">{t("Where", "المكان")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {zones.slice(0, 4).map((z) => (
              <button
                key={z.id}
                type="button"
                aria-pressed={zone === z.id}
                onClick={() => setZone(z.id)}
                className={cn(
                  "min-h-11 rounded-[9px] border px-4 t-body-sm transition-calm",
                  zone === z.id
                    ? "border-green bg-green/10 font-medium text-green"
                    : "border-hairline bg-card text-ink hover:bg-sand-2",
                )}
              >
                {t(z.name_en, z.name_ar)}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function AnalysingStep() {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <GeometricMark className="size-16 animate-pulse text-green/40" />
        <p className="t-body text-ink">{t("Reading the photo", "قراءة الصورة")}</p>
        <p className="max-w-[28ch] t-caption text-muted-ink">
          {t(
            "A suggestion follows. Your choice stands unless you change it.",
            "سيظهر اقتراح. ويبقى اختيارك ما لم تغيّره.",
          )}
        </p>
        <Meter value={70} tone="green" className="mt-1 w-40" />
      </div>
    );
  }

  function ReviewStep() {
    const suggested = faultCategories.find((c) => c.id === photoSuggestion.category)!;
    const chosen = faultCategories.find((c) => c.id === category)!;
    const differs = photoSuggestion.category !== category;
    const finalCategory = acceptedSuggestion ? suggested : chosen;

    return (
      <div className="space-y-3">
        <div className="rounded-[12px] border border-gold/30 bg-gold/8 p-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 stroke-[1.5] text-[oklch(0.44_0.09_79.6)]" aria-hidden="true" />
            <span className="t-micro text-[oklch(0.44_0.09_79.6)]">
              {t("Suggested from the photo", "اقتراح من الصورة")}
            </span>
            <BidiText className="ms-auto t-caption tnum text-muted-ink">
              {Math.round(photoSuggestion.confidence * 100)}%
            </BidiText>
          </div>
          <p className="mt-2 t-body-sm text-ink">
            {t(photoSuggestion.description_en, photoSuggestion.description_ar)}
          </p>
          <p className="mt-1 t-caption text-muted-ink">
            {t("Category", "التصنيف")}: {t(suggested.label_en, suggested.label_ar)}
          </p>
          {differs ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={() => setAcceptedSuggestion(true)}>
                {t("Use the suggestion", "استخدام الاقتراح")}
              </Button>
              <Button size="sm" variant="quiet" onClick={() => setAcceptedSuggestion(false)}>
                {t("Keep my choice", "الإبقاء على اختياري")}
              </Button>
            </div>
          ) : (
            <p className="mt-2 t-caption text-muted-ink">
              {t("This matches what you chose.", "هذا يطابق ما اخترته.")}
            </p>
          )}
        </div>

        <dl className="rounded-[12px] border border-hairline bg-card p-3 t-body-sm">
          <Row label={t("Mosque", "المسجد")} value={mosqueName} />
          <Row
            label={t("Where", "المكان")}
            value={t(
              zones.find((z) => z.id === zone)!.name_en,
              zones.find((z) => z.id === zone)!.name_ar,
            )}
          />
          <Row
            label={t("Category", "التصنيف")}
            value={t(finalCategory.label_en, finalCategory.label_ar)}
          />
          <Row label={t("Photo", "الصورة")} value={t("Attached", "مرفقة")} />
          <Row
            label={t("Voice note", "ملاحظة صوتية")}
            value={voiceNote !== null ? formatClock(voiceNote) : t("None", "لا يوجد")}
          />
        </dl>
      </div>
    );
  }

  function DoneStep() {
    return (
      <div className="space-y-3 text-center">
        <div className="flex flex-col items-center gap-2 py-2">
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="size-7 stroke-[1.5]" aria-hidden="true" />
          </span>
          <p className="t-title text-ink">{t("Reported", "تم الإبلاغ")}</p>
          <BidiText className="t-body-sm text-muted-ink">t-1007</BidiText>
        </div>
        <div className="rounded-[12px] border border-hairline bg-card p-3 text-start">
          <Row label={t("Fix window", "مدة الإصلاح")} value={t("Within 24 hours", "خلال ٢٤ ساعة")} />
          <Row
            label={t("Contractor", "المقاول")}
            value={t("Al Diyar FM Services, notified", "الديار لخدمات المرافق، تم إشعاره")}
          />
          <Row
            label={t("Supervisor", "المشرف")}
            value={t("Joseph Mathew, notified", "جوزيف ماثيو، تم إشعاره")}
          />
        </div>
        <p className="t-caption text-muted-ink">
          {t(
            "You will see it under My reports with its service level.",
            "ستجده ضمن بلاغاتي مع مستوى الخدمة.",
          )}
        </p>
      </div>
    );
  }
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-hairline py-2 last:border-0">
      <dt className="t-caption text-muted-ink">{label}</dt>
      <dd className="t-body-sm text-end text-ink">{value}</dd>
    </div>
  );
}

function Corner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("absolute size-6 border-primary-foreground/40", className)}
    />
  );
}

function Waveform({ active }: { active: boolean }) {
  const bars = [6, 12, 20, 14, 26, 18, 10, 22, 15, 9, 18, 24, 12, 7, 16, 20, 11, 8];
  return (
    <div className="flex h-7 flex-1 items-end gap-[3px]" aria-hidden="true">
      {bars.map((h, i) => (
        <span
          key={i}
          className={cn("flex-1 rounded-full", active ? "bg-alert/70" : "bg-hairline")}
          style={{ height: h }}
        />
      ))}
    </div>
  );
}

function formatClock(total: number) {
  const m = String(Math.floor(total / 60)).padStart(1, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}
