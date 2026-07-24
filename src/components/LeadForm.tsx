"use client";

import { useRef, useState } from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { BRAND } from "@/config/brand";

export interface SelectOption { value: string; label: string }

export interface Field {
  name: string;
  label: string;
  type?: "text" | "email" | "url" | "textarea" | "select";
  required?: boolean;
  placeholder?: string;
  hint?: string;
  options?: Array<string | SelectOption>;
  full?: boolean;
  autoComplete?: string;
}

type FormStatus = "idle" | "submitting" | "ok" | "error";

function requiredMessage(field: Field) {
  switch (field.name) {
    case "decision":
      return "Tell me what you are deciding so I know where to start.";
    case "name":
      return "Add your name so I know who I am replying to.";
    case "email":
      return "Add the email where you want my reply.";
    case "engagement":
      return "Choose the kind of help that feels closest.";
    case "stage":
      return "Choose what exists today.";
    default:
      return `Add ${field.label.toLowerCase()}.`;
  }
}

function fieldMessage(field: Field, error?: string) {
  if (error === "invalid_email" || field.type === "email") {
    return "That email looks incomplete. Check it and try again.";
  }
  if (error === "invalid_url" || field.type === "url") {
    return "Paste a full link beginning with http:// or https://, or leave it blank.";
  }
  return `Check ${field.label.toLowerCase()} and try again.`;
}

function captureErrorMessage(error?: string) {
  switch (error) {
    case "lead_capture_unconfigured":
      return "The form is temporarily unavailable. Your answers are still here. Try again in a moment.";
    case "lead_backend_unavailable":
      return "The connection to TasteLoop timed out. Your answers are still here. Try again.";
    case "lead_rate_limited":
      return "There have been too many attempts. Wait a minute, then try again. Your answers are still here.";
    case "idempotency_conflict":
      return "These answers changed during a retry. Review them once more, then send a fresh message.";
    default:
      return "I couldn’t save your message. Your answers are still here. Try again.";
  }
}

export function LeadForm({
  leadType,
  leadTypeField,
  fields,
  initialValues = {},
  submitLabel = "Submit",
  successTitle = "Got it — thank you.",
  successBody = "We’ll be in touch shortly.",
  compact = false,
}: {
  leadType: string;
  leadTypeField?: string;
  fields: Field[];
  initialValues?: Record<string, string>;
  submitLabel?: string;
  successTitle?: string;
  successBody?: string;
  compact?: boolean;
}) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [persisted, setPersisted] = useState(false);
  const [showEmailFallback, setShowEmailFallback] = useState(false);
  const submissionId = useRef<string | null>(null);

  function set(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    submissionId.current = null;
    setPersisted(false);
    setShowEmailFallback(false);
    setFieldErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
    if (status === "error") {
      setStatus("idle");
      setError(null);
    }
  }

  function validate() {
    const nextErrors: Record<string, string> = {};
    for (const field of fields) {
      const value = values[field.name]?.trim() ?? "";
      if (field.required && !value) {
        nextErrors[field.name] = requiredMessage(field);
        continue;
      }
      if (value.length > 5000) {
        nextErrors[field.name] = `${field.label} is too long. Shorten it and try again.`;
        continue;
      }
      if (field.type === "email" && value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
        nextErrors[field.name] = fieldMessage(field, "invalid_email");
        continue;
      }
      if (field.type === "url" && value) {
        try {
          const url = new URL(value);
          if (url.protocol !== "http:" && url.protocol !== "https:") {
            nextErrors[field.name] = fieldMessage(field, "invalid_url");
          }
        } catch {
          nextErrors[field.name] = fieldMessage(field, "invalid_url");
        }
      }
    }
    return nextErrors;
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setPersisted(false);
    setShowEmailFallback(false);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setStatus("error");
      setError("A few details need attention before I can send this.");
      const firstField = fields.find((field) => validationErrors[field.name]);
      if (firstField) {
        window.requestAnimationFrame(() => {
          document.getElementById(`${leadType}-${firstField.name}`)?.focus();
        });
      }
      return;
    }

    setFieldErrors({});
    setStatus("submitting");
    const resolvedLeadType = leadTypeField && values[leadTypeField] ? values[leadTypeField] : leadType;
    submissionId.current ??= crypto.randomUUID();
    const stableSubmissionId = submissionId.current;
    let timeout: number | undefined;
    try {
      const controller = new AbortController();
      timeout = window.setTimeout(() => controller.abort(), 15000);
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: stableSubmissionId,
          leadType: resolvedLeadType,
          fields: values,
          hp: honeypot,
        }),
        signal: controller.signal,
      });
      const body = await response.json().catch(() => ({})) as {
        ok?: boolean;
        error?: string;
        field?: string;
        persisted?: boolean;
      };
      if (!response.ok || body.ok !== true) {
        if (body.persisted === true) {
          setPersisted(true);
          setShowEmailFallback(false);
          setStatus("error");
          setError("Your message is saved, but my email alert is delayed. Retry the alert—your submission will not be duplicated.");
          return;
        }
        if (body.field && fields.some((field) => field.name === body.field)) {
          const invalidField = fields.find((field) => field.name === body.field)!;
          setFieldErrors({ [body.field]: fieldMessage(invalidField, body.error) });
          setStatus("error");
          setError("One answer needs attention before I can send this.");
          window.requestAnimationFrame(() => {
            document.getElementById(`${leadType}-${body.field}`)?.focus();
          });
          return;
        }
        setStatus("error");
        setShowEmailFallback(true);
        setError(captureErrorMessage(body.error));
        return;
      }
      setStatus("ok");
    } catch (caught) {
      setStatus("error");
      setShowEmailFallback(true);
      const timedOut =
        caught instanceof DOMException && caught.name === "AbortError";
      setError(
        timedOut
          ? "The connection timed out. Your answers are still here. Try again."
          : "I couldn’t reach TasteLoop. Check your connection and try again. Your answers are still here.",
      );
    } finally {
      if (timeout !== undefined) window.clearTimeout(timeout);
    }
  }

  if (status === "ok") {
    return (
      <div role="status" aria-live="polite" className="rounded-2xl border border-loop/35 bg-loop/[0.07] p-6">
        <div className="flex items-center gap-2 text-loop"><Check className="h-5 w-5" /><span className="font-semibold">{successTitle}</span></div>
        <p className="mt-2 text-sm text-white/70">{successBody}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}
      aria-busy={status === "submitting"}
      noValidate
    >
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${leadType}-company-site`}>Company website</label>
        <input id={`${leadType}-company-site`} name="company-site" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
      </div>

      {fields.map((field) => {
        const id = `${leadType}-${field.name}`;
        const errorId = `${id}-error`;
        const hintId = `${id}-hint`;
        const value = values[field.name] ?? "";
        const fieldError = fieldErrors[field.name];
        const describedBy = [
          field.hint ? hintId : null,
          fieldError ? errorId : null,
        ].filter(Boolean).join(" ") || undefined;
        const commonClass = "w-full rounded-xl border border-line bg-black/35 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/28 hover:border-white/20 focus:border-loop";
        return (
          <div key={field.name} className={field.full || field.type === "textarea" || compact ? "sm:col-span-2" : ""}>
            <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-white/62">
              {field.label}{field.required && <span className="text-signal"> *</span>}
            </label>
            {field.hint && <p id={hintId} className="mb-2 text-xs leading-relaxed text-white/38">{field.hint}</p>}
            {field.type === "textarea" ? (
              <textarea id={id} name={field.name} rows={field.name === "decision" ? 7 : 5} required={field.required} disabled={status === "submitting"} aria-invalid={Boolean(fieldError)} aria-describedby={describedBy} placeholder={field.placeholder} value={value} onChange={(event) => set(field.name, event.target.value)} className={commonClass} />
            ) : field.type === "select" ? (
              <select id={id} name={field.name} required={field.required} disabled={status === "submitting"} aria-invalid={Boolean(fieldError)} aria-describedby={describedBy} value={value} onChange={(event) => set(field.name, event.target.value)} className={commonClass}>
                <option value="">Select…</option>
                {field.options?.map((option) => {
                  const normalized = typeof option === "string" ? { value: option, label: option } : option;
                  return <option key={normalized.value} value={normalized.value}>{normalized.label}</option>;
                })}
              </select>
            ) : (
              <input id={id} name={field.name} type={field.type ?? "text"} required={field.required} disabled={status === "submitting"} aria-invalid={Boolean(fieldError)} aria-describedby={describedBy} autoComplete={field.autoComplete} placeholder={field.placeholder} value={value} onChange={(event) => set(field.name, event.target.value)} className={commonClass} />
            )}
            {fieldError && <p id={errorId} className="mt-1.5 text-xs text-signal">{fieldError}</p>}
          </div>
        );
      })}

      {error && (
        <div role="alert" className={`flex items-start gap-2 rounded-xl border p-3 text-sm text-white/72 sm:col-span-2 ${persisted ? "border-loop/30 bg-loop/[0.06]" : "border-signal/25 bg-signal/[0.06]"}`}>
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
          <div>
            <p>{error}</p>
            {showEmailFallback && !persisted && (
              <a
                className="mt-1.5 inline-flex font-medium text-loop underline decoration-loop/40 underline-offset-2"
                href={`mailto:${BRAND.email}`}
              >
                Email Nam instead
              </a>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <button type="submit" disabled={status === "submitting"} className="inline-flex items-center gap-2 rounded-full bg-loop px-6 py-3 text-sm font-semibold text-ink transition hover:bg-loop/90 disabled:cursor-wait disabled:opacity-60">
          {status === "submitting" && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
          {status === "submitting" ? "Sending…" : persisted ? "Retry notification" : status === "error" ? "Try again" : submitLabel}
        </button>
        <p aria-live="polite" className="text-xs text-white/35">
          {status === "submitting" ? "Securely saving your decision…" : "Private intake. No automated sales sequence."}
        </p>
      </div>
    </form>
  );
}
