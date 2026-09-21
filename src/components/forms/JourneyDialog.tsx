"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { FileText, UploadSimple, X } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";
import { lockScroll, unlockScroll } from "@/components/motion/SmoothScroll";
import { cn } from "@/lib/utils";
import { journeyForms, journeys, type JourneyField, type JourneyId } from "@/lib/site";

/*
 * One pop-up form for the three "Three ways in" cards.
 *
 * Each card opens the same dialog with its own question set (journeyForms in
 * site.ts), and every submission carries a `journey` field, so the team always
 * knows which card was clicked. Three tailored forms, one component to keep
 * accessible.
 *
 * Built on native <dialog> + showModal(): the browser supplies the focus trap,
 * Escape to close, the inert page behind it and the top layer, all of which a
 * hand-rolled modal gets subtly wrong.
 *
 * Opening: any <JourneyTrigger journey="…"> dispatches OPEN_EVENT. The dialog
 * is mounted once per page (inside the Journeys section) and listens for it,
 * so the section itself can stay a Server Component.
 *
 * Scrolling: Lenis is stopped while the dialog is open, and a stopped Lenis
 * calls preventDefault on every wheel event — which would freeze scrolling
 * inside a long form. `data-lenis-prevent` on the scroll area tells Lenis to
 * leave those events alone.
 */

export const OPEN_EVENT = "journey:open";

const COMMON = {
  name: "name",
  email: "email",
  notes: "notes",
} as const;

type Values = Record<string, string | string[] | File | null>;
type Errors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function emptyValues(fields: readonly JourneyField[]): Values {
  const v: Values = { [COMMON.name]: "", [COMMON.email]: "", [COMMON.notes]: "" };
  for (const f of fields) v[f.name] = f.kind === "checkboxes" ? [] : f.kind === "file" ? null : "";
  return v;
}

function validateField(field: JourneyField, value: Values[string]): string {
  const empty =
    value == null || (Array.isArray(value) ? value.length === 0 : typeof value === "string" && !value.trim());

  if (field.required && empty) {
    if (field.kind === "checkboxes") return "Choose at least one option.";
    if (field.kind === "radio" || field.kind === "select") return "Choose an option.";
    if (field.kind === "file") return "Attach your manuscript, or the first three chapters.";
    return "This one is needed.";
  }
  if (empty) return "";

  if (field.kind === "file" && value instanceof File) {
    const ext = "." + (value.name.split(".").pop() ?? "").toLowerCase();
    if (!field.accept.split(",").includes(ext)) {
      return "That file type is not supported. Use Word, PDF, RTF or ODT.";
    }
    if (value.size > field.maxMb * 1024 * 1024) {
      return `That file is over ${field.maxMb} MB. Send the first three chapters instead.`;
    }
  }
  if (field.kind === "url" && typeof value === "string" && !/^https?:\/\/\S+\.\S+/.test(value.trim())) {
    return "Enter a full link, starting with https://";
  }
  if (field.kind === "number" && typeof value === "string" && !/^\d[\d,]*$/.test(value.trim())) {
    return "Enter a number, such as 60000.";
  }
  return "";
}

function validateCommon(name: string, value: string): string {
  if (name === COMMON.name && !value.trim()) return "Please enter your name.";
  if (name === COMMON.email) {
    if (!value.trim()) return "Please enter your email address.";
    if (!EMAIL_RE.test(value.trim())) return "Enter an email address like name@example.com.";
  }
  return "";
}

const formatSize = (bytes: number) =>
  bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/* ------------------------------------------------------------------------ */

/** The button on each card. Tiny client island; the card stays server-rendered. */
export function JourneyTrigger({
  journey,
  variant,
  service,
  children,
}: {
  journey: JourneyId;
  variant: "primary" | "secondary";
  /** Set on a service page, so the submission also says which service it came from. */
  service?: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant={variant}
      size="lg"
      aria-haspopup="dialog"
      onClick={(e) => {
        window.dispatchEvent(
          new CustomEvent(OPEN_EVENT, { detail: { journey, service, opener: e.currentTarget } }),
        );
      }}
    >
      {children}
    </Button>
  );
}

/* ------------------------------------------------------------------------ */

export function JourneyDialog() {
  const uid = useId();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const serviceRef = useRef<string | undefined>(undefined);

  const [journey, setJourney] = useState<JourneyId>("idea");
  const form = journeyForms[journey];
  const [values, setValues] = useState<Values>(() => emptyValues(form.fields));
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"editing" | "sending" | "sent">("editing");
  const [dragging, setDragging] = useState(false);
  /* Mirrors for the open handler, which is registered once and would
   * otherwise only ever see the first render's values. */
  const statusRef = useRef(status);
  const journeyRef = useRef(journey);
  useEffect(() => {
    statusRef.current = status;
    journeyRef.current = journey;
  }, [status, journey]);

  const fieldId = (name: string) => `${uid}-${name}`;
  const dirty = Object.values(values).some((v) =>
    Array.isArray(v) ? v.length > 0 : v instanceof File ? true : typeof v === "string" && v.trim() !== "",
  );

  /* Scroll lock and focus return run synchronously on every close path.
   * They used to hang off the dialog's "close" event, which is dispatched as
   * a later task; when it was late (or never came) the page was left
   * scroll-locked with the dialog already gone. lockedRef makes release
   * idempotent, so the "close" listener below is only a safety net. */
  const lockedRef = useRef(false);
  const [openSeq, setOpenSeq] = useState(0);

  const release = useCallback(() => {
    if (!lockedRef.current) return;
    lockedRef.current = false;
    unlockScroll();
    // Explicit, because Safari does not focus a button on click, so the
    // browser's own focus restoration would land on <body>.
    openerRef.current?.focus();
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
    release();
  }, [release]);

  // Open on request from any trigger, resetting to that journey's questions.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const { journey: next, opener, service } = (
        e as CustomEvent<{ journey: JourneyId; opener: HTMLElement; service?: string }>
      ).detail;
      openerRef.current = opener;
      serviceRef.current = service;
      /* Keep a half-filled form if they reopen the same card: an accidental
       * Escape should not cost them what they typed. Reset only for a
       * different journey, or once the last one was sent. */
      if (journeyRef.current !== next || statusRef.current === "sent") {
        setValues(emptyValues(journeyForms[next].fields));
        setErrors({});
        setTouched({});
        setStatus("editing");
      }
      setJourney(next);
      const d = dialogRef.current;
      if (d && !d.open) {
        d.showModal();
        lockedRef.current = true;
        lockScroll();
        setOpenSeq((n) => n + 1);
      }
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  // Native close (button, Escape, or form done) → release scroll, return focus.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    d.addEventListener("close", release);
    return () => d.removeEventListener("close", release);
  }, [release]);

  // Land on the first field, not the scroll container, once the dialog opens.
  useEffect(() => {
    if (openSeq && dialogRef.current?.open) document.getElementById(fieldId(COMMON.name))?.focus();
    // fieldId is derived from a stable useId; openSeq is the real trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSeq]);

  const allFields = form.fields;

  const errorFor = (name: string, value: Values[string]) => {
    if (name === COMMON.name || name === COMMON.email) return validateCommon(name, String(value ?? ""));
    const f = allFields.find((x) => x.name === name);
    return f ? validateField(f, value) : "";
  };

  const update = (name: string, value: Values[string]) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Only re-check as they type once they have already seen an error.
    if (touched[name]) setErrors((prev) => ({ ...prev, [name]: errorFor(name, value) }));
  };

  const blur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: errorFor(name, values[name]) }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const names = [COMMON.name, COMMON.email, ...allFields.map((f) => f.name)];
    const next: Errors = {};
    for (const n of names) {
      const msg = errorFor(n, values[n]);
      if (msg) next[n] = msg;
    }
    setErrors(next);
    setTouched(Object.fromEntries(names.map((n) => [n, true])));

    const firstBad = names.find((n) => next[n]);
    if (firstBad) {
      // Radios and checkboxes: focus the first option of the group.
      const el =
        document.getElementById(fieldId(firstBad)) ??
        document.querySelector<HTMLElement>(`[name="${firstBad}"]`);
      el?.focus();
      return;
    }

    /* Everything the endpoint needs, including which card was clicked and the
     * manuscript file itself. There is no backend yet (see docs/ROADMAP.md):
     * this is the single place to POST it once one exists. */
    const data = new FormData();
    data.set("journey", journey);
    if (serviceRef.current) data.set("service", serviceRef.current);
    for (const [k, v] of Object.entries(values)) {
      if (v == null) continue;
      if (Array.isArray(v)) v.forEach((item) => data.append(k, item));
      else data.set(k, v);
    }

    setStatus("sending");
    await Promise.resolve(data);
    setStatus("sent");
  };

  // Backdrop click closes — unless they have typed something, which a stray
  // click should never throw away.
  const onDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current && (!dirty || status === "sent")) close();
  };

  const journeyMeta = journeys.find((j) => j.id === journey);
  const titleId = `${uid}-title`;
  const introId = `${uid}-intro`;

  const inputBase =
    "mt-2 w-full min-h-11 rounded-card border bg-surface px-4 py-3 text-base text-ink transition-colors duration-200 focus:outline-none";
  const ring = (name: string) =>
    errors[name] && touched[name] ? "border-accent focus:border-accent" : "border-line focus:border-ink";

  const describedBy = (name: string, hint?: string) =>
    [hint ? `${fieldId(name)}-hint` : "", errors[name] && touched[name] ? `${fieldId(name)}-err` : ""]
      .filter(Boolean)
      .join(" ") || undefined;

  const errorText = (name: string) =>
    errors[name] && touched[name] ? (
      <p id={`${fieldId(name)}-err`} role="alert" className="mt-2 text-sm text-accent">
        {errors[name]}
      </p>
    ) : null;

  const label = (name: string, text: string, required?: boolean) => (
    <label htmlFor={fieldId(name)} className="block text-sm font-medium text-ink">
      {text} {required ? <span className="text-accent">*</span> : <span className="font-normal text-ink-subtle">(optional)</span>}
    </label>
  );

  /* A rejected file is never stored. Storing it swapped the dropzone for a
   * file card showing the bad file, so the author saw "cover.png, 1 KB" as if
   * it were attached, next to an error, and had to Remove it to try again. */
  const pickFile = (f: Extract<JourneyField, { kind: "file" }>, picked: File | null) => {
    const msg = picked ? validateField(f, picked) : "";
    setTouched((p) => ({ ...p, [f.name]: true }));
    setErrors((p) => ({ ...p, [f.name]: msg }));
    if (!msg) setValues((p) => ({ ...p, [f.name]: picked }));
  };

  const renderField = (f: JourneyField) => {
    const hint = f.hint ? (
      <p id={`${fieldId(f.name)}-hint`} className="mt-1 text-sm text-ink-subtle">
        {f.hint}
      </p>
    ) : null;
    const invalid = Boolean(errors[f.name] && touched[f.name]);

    if (f.kind === "radio" || f.kind === "checkboxes") {
      const selected = values[f.name];
      return (
        <fieldset
          key={f.name}
          aria-describedby={describedBy(f.name, f.hint)}
          aria-invalid={invalid || undefined}
        >
          <legend className="text-sm font-medium text-ink">
            {f.label}{" "}
            {f.required ? <span className="text-accent">*</span> : <span className="font-normal text-ink-subtle">(optional)</span>}
          </legend>
          {hint}
          <div className="mt-3 flex flex-wrap gap-2">
            {f.options.map((opt) => {
              const checked =
                f.kind === "radio" ? selected === opt : Array.isArray(selected) && selected.includes(opt);
              return (
                <label
                  key={opt}
                  className={cn(
                    "inline-flex min-h-11 cursor-pointer items-center rounded-pill border px-4 text-sm transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
                    checked
                      ? "border-ink bg-ink text-inverse-ink"
                      : "border-line bg-surface text-ink hover:border-ink/40",
                  )}
                >
                  <input
                    type={f.kind === "radio" ? "radio" : "checkbox"}
                    name={f.name}
                    value={opt}
                    checked={checked}
                    className="sr-only"
                    onChange={() => {
                      if (f.kind === "radio") update(f.name, opt);
                      else {
                        const cur = Array.isArray(selected) ? selected : [];
                        update(f.name, checked ? cur.filter((x) => x !== opt) : [...cur, opt]);
                      }
                    }}
                    onBlur={() => blur(f.name)}
                  />
                  {opt}
                </label>
              );
            })}
          </div>
          {errorText(f.name)}
        </fieldset>
      );
    }

    if (f.kind === "file") {
      const file = values[f.name] instanceof File ? (values[f.name] as File) : null;
      return (
        <div key={f.name}>
          {label(f.name, f.label, f.required)}
          {hint}
          {/* Always in the DOM, so the label above always has a target and the
              dropzone below can open it via htmlFor. `peer` lets the dropzone
              show this input's keyboard focus. */}
          <input
            id={fieldId(f.name)}
            type="file"
            name={f.name}
            accept={f.accept}
            className="peer sr-only"
            tabIndex={file ? -1 : 0}
            aria-describedby={describedBy(f.name, f.hint)}
            aria-invalid={invalid || undefined}
            onChange={(e) => {
              pickFile(f, e.target.files?.[0] ?? null);
              // Clear it, so choosing the same file again still fires change.
              e.target.value = "";
            }}
          />
          {file ? (
            <div className="mt-3 flex items-center gap-4 rounded-card border border-line bg-surface p-4">
              <FileText size={28} aria-hidden className="shrink-0 text-accent" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{file.name}</p>
                <p className="text-sm text-ink-subtle">{formatSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  update(f.name, null);
                  setErrors((p) => ({ ...p, [f.name]: "" }));
                }}
                className="inline-flex min-h-11 items-center rounded-pill px-3 text-sm text-ink underline underline-offset-4 hover:text-accent"
              >
                Remove<span className="sr-only"> {file.name}</span>
              </button>
            </div>
          ) : (
            /* The input is visually hidden, so it cannot receive a drop itself;
               the label takes the drop and hands the file over. */
            <label
              htmlFor={fieldId(f.name)}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                pickFile(f, e.dataTransfer.files?.[0] ?? null);
              }}
              className={cn(
                "mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border border-dashed px-6 py-8 text-center transition-colors duration-200 hover:border-ink/50 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
                dragging ? "border-ink bg-accent-soft" : invalid ? "border-accent" : "border-ink/25",
              )}
            >
              <UploadSimple size={26} aria-hidden className="text-ink-muted" />
              <span className="text-sm font-medium text-ink">Choose a file</span>
              <span className="text-sm text-ink-subtle">or drop it here</span>
            </label>
          )}
          {errorText(f.name)}
        </div>
      );
    }

    const common = {
      id: fieldId(f.name),
      name: f.name,
      value: String(values[f.name] ?? ""),
      onBlur: () => blur(f.name),
      "aria-describedby": describedBy(f.name, f.hint),
      "aria-invalid": invalid || undefined,
      required: f.required,
    };

    return (
      <div key={f.name}>
        {label(f.name, f.label, f.required)}
        {hint}
        {f.kind === "textarea" ? (
          <textarea
            {...common}
            rows={f.rows ?? 4}
            onChange={(e) => update(f.name, e.target.value)}
            className={cn(inputBase, "resize-y", ring(f.name))}
          />
        ) : f.kind === "select" ? (
          <select
            {...common}
            onChange={(e) => update(f.name, e.target.value)}
            className={cn(inputBase, ring(f.name))}
          >
            <option value="">Choose one…</option>
            {f.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : (
          <input
            {...common}
            type={f.kind === "number" ? "text" : f.kind}
            inputMode={f.kind === "number" ? "numeric" : f.kind === "url" ? "url" : undefined}
            onChange={(e) => update(f.name, e.target.value)}
            className={cn(inputBase, ring(f.name))}
          />
        )}
        {errorText(f.name)}
      </div>
    );
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={introId}
      onClick={onDialogClick}
      onCancel={(e) => {
        // Escape. Route it through close() so the lock is released immediately.
        e.preventDefault();
        close();
      }}
      className="journey-dialog m-auto w-[min(44rem,calc(100vw-1.5rem))] max-w-none rounded-card bg-paper p-0 text-ink shadow-lift backdrop:bg-ink/55 backdrop:backdrop-blur-sm"
    >
      <div data-lenis-prevent className="max-h-[min(88dvh,60rem)] overflow-y-auto overscroll-contain">
        {/* Header stays pinned while the form scrolls, so Close is always reachable. */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-6 border-b border-line bg-paper/95 px-6 py-5 backdrop-blur-md sm:px-10">
          <div>
            <p className="text-eyebrow font-semibold uppercase text-accent">
              {journeyMeta?.num} · {journeyMeta?.title}
            </p>
            <h2 id={titleId} className="mt-2 text-h2">
              {status === "sent" ? "Thank you. It's with us." : form.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-inverse-ink"
          >
            <X size={18} weight="bold" aria-hidden />
          </button>
        </div>

        {status === "sent" ? (
          <div role="status" className="px-6 py-8 sm:px-10 sm:py-10">
            <p id={introId} className="text-lead text-ink-muted">
              We read every enquiry ourselves and reply within two working days, with honest
              advice on what your book needs next.
            </p>
            <Button type="button" variant="secondary" className="mt-8" onClick={close}>
              Close
            </Button>
          </div>
        ) : (
          <form noValidate onSubmit={onSubmit} className="px-6 py-8 sm:px-10 sm:py-10">
            <input type="hidden" name="journey" value={journey} />
            <p id={introId} className="text-lead text-ink-muted">
              {form.intro}
            </p>
            <p className="mt-3 text-sm text-ink-subtle">
              Fields marked <span aria-hidden>*</span>
              <span className="sr-only">with an asterisk</span> are required.
            </p>

            <div className="mt-8 grid gap-7 sm:grid-cols-2">
              {([COMMON.name, COMMON.email] as const).map((n) => (
                <div key={n}>
                  {label(n, n === COMMON.name ? "Your name" : "Email address", true)}
                  <input
                    id={fieldId(n)}
                    name={n}
                    type={n === COMMON.email ? "email" : "text"}
                    autoComplete={n === COMMON.email ? "email" : "name"}
                    inputMode={n === COMMON.email ? "email" : undefined}
                    value={String(values[n] ?? "")}
                    onChange={(e) => update(n, e.target.value)}
                    onBlur={() => blur(n)}
                    aria-invalid={Boolean(errors[n] && touched[n]) || undefined}
                    aria-describedby={describedBy(n)}
                    className={cn(inputBase, ring(n))}
                  />
                  {errorText(n)}
                </div>
              ))}
            </div>

            <div className="mt-7 space-y-7">
              {allFields.map(renderField)}

              <div>
                {label(COMMON.notes, "Anything else we should know?")}
                <textarea
                  id={fieldId(COMMON.notes)}
                  name={COMMON.notes}
                  rows={3}
                  value={String(values[COMMON.notes] ?? "")}
                  onChange={(e) => update(COMMON.notes, e.target.value)}
                  className={cn(inputBase, "resize-y border-line focus:border-ink")}
                />
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button type="submit" size="lg" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : form.submit}
              </Button>
              <p className="text-sm text-ink-subtle">We reply within two working days.</p>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}
