import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "ar" | "en";
export type Dir = "rtl" | "ltr";

type DirectionContextValue = {
  lang: Lang;
  dir: Dir;
  isRtl: boolean;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  /** Pick the right string for the active language. */
  t: (en: string, ar: string) => string;
};

const DirectionContext = createContext<DirectionContextValue | null>(null);

export function DirectionProvider({
  children,
  defaultLang = "en",
}: {
  children: ReactNode;
  defaultLang?: Lang;
}) {
  const [lang, setLang] = useState<Lang>(defaultLang);

  useEffect(() => {
    setLang(defaultLang);
  }, [defaultLang]);

  const dir: Dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
  }, [dir, lang]);

  const toggleLang = useCallback(
    () => setLang((current) => (current === "ar" ? "en" : "ar")),
    [],
  );

  const value = useMemo<DirectionContextValue>(
    () => ({
      lang,
      dir,
      isRtl: dir === "rtl",
      setLang,
      toggleLang,
      t: (en: string, ar: string) => (lang === "ar" ? ar : en),
    }),
    [lang, dir, toggleLang],
  );

  return (
    <DirectionContext.Provider value={value}>
      <div dir={dir} lang={lang} className={lang === "ar" ? "font-arabic" : undefined}>
        {children}
      </div>
    </DirectionContext.Provider>
  );
}

export function useDirection(): DirectionContextValue {
  const ctx = useContext(DirectionContext);
  if (!ctx) {
    // Safe default so components can render outside a provider (e.g. print views).
    return {
      lang: "en",
      dir: "ltr",
      isRtl: false,
      setLang: () => {},
      toggleLang: () => {},
      t: (en: string) => en,
    };
  }
  return ctx;
}
