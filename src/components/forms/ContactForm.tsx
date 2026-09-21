"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

/*
 * Enquiry form, built to the form rules in the UX article:
 *
 *   single column          two-column forms make people zigzag and are the
 *                          single most common cause of skipped fields
 *   labels, not            a placeholder disappears the moment you type, so
 *   placeholders           anyone who loses their place has to clear the field
 *                          to find out what it wanted
 *   ask for the minimum    five fields, one of them optional
 *   validate inline        on blur, next to the field, in words — never a
 *                          single "something went wrong" at the top on submit
 *   explain errors         "Enter an email address like name@example.com",
 *                          not "Invalid input"
 *   targets >= 44px        every control, on touch as well as pointer
 *
 * Accessibility: each input owns its label, errors are tied to the input with
 * aria-describedby and announced via role="alert", aria-invalid marks the
 * field itself, and the summary after submit takes focus order via role
 * status. Nothing here depends on colour alone to signal an error.
 */

type Field = "name" | "email" | "project" | "stage" | "message";

const STAGES = [
  "I have an idea",
  "I have a draft",
  "I have a finished manuscript",
  "My book is published",
] as const;

const REQUIRED: Field[] = ["name", "email", "message"];

function validate(field: Field, value: string): string {
  const v = value.trim();
  if (REQUIRED.includes(field) && !v) {
    const what =
      field === "name" ? "your name" : field === "email" ? "your email address" : "a message";
    return `Please enter ${what}.`;
  }
  if (field === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
    return "Enter an email address like name@example.com.";
  }
  if (field === "message" && v && v.length < 20) {
    return "A sentence or two more would help us reply usefully.";
  }
  return "";
}

export function ContactForm() {
  const uid = useId();
  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    email: "",
    project: "",
    stage: STAGES[0],
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [sent, setSent] = useState(false);

  const set = (field: Field, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Re-validate as they type only once they have already seen an error —
    // validating from the first keystroke shouts at people mid-word.
    if (touched[field]) setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
  };

  const blur = (field: Field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validate(field, values[field]) }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<Field, string>> = {};
    (Object.keys(values) as Field[]).forEach((f) => {
      const msg = validate(f, values[f]);
      if (msg) next[f] = msg;
    });
    setErrors(next);
    setTouched({ name: true, email: true, project: true, stage: true, message: true });

    const bad = (Object.keys(next) as Field[])[0];
    if (bad) {
      document.getElementById(`${uid}-${bad}`)?.focus();
      return;
    }
    setSent(true);
  };

  const fieldBase =
    "w-full min-h-11 rounded-card border bg-surface px-4 py-3 text-base text-ink transition-colors duration-200 placeholder:text-ink-subtle focus:outline-none";

  const ring = (field: Field) =>
    errors[field] && touched[field]
      ? "border-accent focus:border-accent"
      : "border-line focus:border-ink";

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-card border border-line bg-surface p-8 lg:p-10"
      >
        <h2 className="text-h3">Thank you — that&apos;s with us.</h2>
        <p className="mt-3 text-lead text-ink-muted">
          We read every enquiry ourselves and reply within two working days. If it is
          urgent, email us directly and say so in the subject line.
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="max-w-xl">
      <p className="text-sm text-ink-muted">
        Fields marked <span aria-hidden>*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      <div className="mt-8 space-y-7">
        {/* --- Name ------------------------------------------------------- */}
        <div>
          <label htmlFor={`${uid}-name`} className="block text-sm font-medium text-ink">
            Your name <span className="text-accent">*</span>
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            onBlur={() => blur("name")}
            aria-invalid={Boolean(errors.name && touched.name)}
            aria-describedby={errors.name && touched.name ? `${uid}-name-err` : undefined}
            className={cn("mt-2", fieldBase, ring("name"))}
          />
          {errors.name && touched.name && (
            <p id={`${uid}-name-err`} role="alert" className="mt-2 text-sm text-accent">
              {errors.name}
            </p>
          )}
        </div>

        {/* --- Email ------------------------------------------------------ */}
        <div>
          <label htmlFor={`${uid}-email`} className="block text-sm font-medium text-ink">
            Email address <span className="text-accent">*</span>
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            onBlur={() => blur("email")}
            aria-invalid={Boolean(errors.email && touched.email)}
            aria-describedby={errors.email && touched.email ? `${uid}-email-err` : undefined}
            className={cn("mt-2", fieldBase, ring("email"))}
          />
          {errors.email && touched.email && (
            <p id={`${uid}-email-err`} role="alert" className="mt-2 text-sm text-accent">
              {errors.email}
            </p>
          )}
        </div>

        {/* --- Working title (optional) ----------------------------------- */}
        <div>
          <label htmlFor={`${uid}-project`} className="block text-sm font-medium text-ink">
            Working title{" "}
            <span className="font-normal text-ink-subtle">(optional)</span>
          </label>
          <input
            id={`${uid}-project`}
            name="project"
            type="text"
            value={values.project}
            onChange={(e) => set("project", e.target.value)}
            className={cn("mt-2", fieldBase, ring("project"))}
          />
        </div>

        {/* --- Stage ------------------------------------------------------ */}
        <div>
          <label htmlFor={`${uid}-stage`} className="block text-sm font-medium text-ink">
            Where the book is now
          </label>
          <select
            id={`${uid}-stage`}
            name="stage"
            value={values.stage}
            onChange={(e) => set("stage", e.target.value)}
            className={cn("mt-2", fieldBase, ring("stage"))}
          >
            {STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>

        {/* --- Message ---------------------------------------------------- */}
        <div>
          <label htmlFor={`${uid}-message`} className="block text-sm font-medium text-ink">
            What are you hoping to do? <span className="text-accent">*</span>
          </label>
          <p id={`${uid}-message-hint`} className="mt-1 text-sm text-ink-subtle">
            A paragraph is plenty. Word count and any deadline help most.
          </p>
          <textarea
            id={`${uid}-message`}
            name="message"
            rows={6}
            required
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
            onBlur={() => blur("message")}
            aria-invalid={Boolean(errors.message && touched.message)}
            aria-describedby={cn(
              `${uid}-message-hint`,
              errors.message && touched.message ? `${uid}-message-err` : "",
            ).trim()}
            className={cn("mt-2 resize-y", fieldBase, ring("message"))}
          />
          {errors.message && touched.message && (
            <p id={`${uid}-message-err`} role="alert" className="mt-2 text-sm text-accent">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="mt-9 inline-flex min-h-12 items-center justify-center rounded-pill bg-accent-bright px-7 text-sm font-medium text-ink transition-[filter] duration-200 hover:brightness-95"
      >
        Send enquiry
      </button>

      <p className="mt-4 text-sm text-ink-subtle">
        We reply within two working days. Your details are never shared.
      </p>
    </form>
  );
}
