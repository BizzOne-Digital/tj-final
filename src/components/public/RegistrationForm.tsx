"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema } from "@/validators/registration";
import type { z } from "zod";
import { useMemo, useState } from "react";
import { calculateRegistrationTotalCents, formatUsdFromCents } from "@/lib/fee-calculator";

type FormValues = z.infer<typeof registrationSchema>;

export function RegistrationForm({
  seasonSlug,
  firstTeamCents,
  additionalTeamCents,
  registrationOpen,
}: {
  seasonSlug: string;
  firstTeamCents: number;
  additionalTeamCents: number;
  registrationOpen: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      seasonSlug,
      teams: [{ teamName: "", divisionKey: "grades-5-6" }],
      eligibilityAcknowledged: false,
      formsAcknowledged: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "teams",
  });

  const teamCount = form.watch("teams").length;
  const total = useMemo(
    () => calculateRegistrationTotalCents(teamCount, firstTeamCents, additionalTeamCents),
    [teamCount, firstTeamCents, additionalTeamCents],
  );

  async function onSubmit(values: FormValues) {
    setStatus("loading");
    setMessage("");
    const res = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus("error");
      setMessage(data.error?.message ?? data.error ?? "Submission failed.");
      return;
    }
    setStatus("done");
    setMessage(data.message ?? "Submitted successfully.");
    form.reset();
  }

  if (!registrationOpen) {
    return (
      <p className="rounded-xl border border-white/10 bg-white/5 p-6 text-cool-grey">
        Registration is currently closed. Contact the league for availability.
      </p>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="School / organization" error={form.formState.errors.schoolName?.message}>
          <input className="input" {...form.register("schoolName")} />
        </Field>
        <Field label="Contact name" error={form.formState.errors.contactName?.message}>
          <input className="input" {...form.register("contactName")} />
        </Field>
        <Field label="Email" error={form.formState.errors.contactEmail?.message}>
          <input type="email" className="input" {...form.register("contactEmail")} />
        </Field>
        <Field label="Phone" error={form.formState.errors.contactPhone?.message}>
          <input className="input" {...form.register("contactPhone")} />
        </Field>
      </div>

      <div className="space-y-4">
        <p className="font-semibold text-ice-white">Teams</p>
        {fields.map((field, index) => (
          <div key={field.id} className="grid gap-3 rounded-xl border border-white/10 p-4 md:grid-cols-3">
            <Field label="Team name" error={form.formState.errors.teams?.[index]?.teamName?.message}>
              <input className="input" {...form.register(`teams.${index}.teamName`)} />
            </Field>
            <Field label="Division" error={form.formState.errors.teams?.[index]?.divisionKey?.message}>
              <select className="input" {...form.register(`teams.${index}.divisionKey`)}>
                <option value="grades-5-6">Grades 5-6</option>
                <option value="grades-3-4">Grades 3-4</option>
              </select>
            </Field>
            {fields.length > 1 && (
              <button
                type="button"
                className="self-end text-sm text-red-300"
                onClick={() => remove(index)}
              >
                Remove team
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-electric-blue"
          onClick={() => append({ teamName: "", divisionKey: "grades-5-6" })}
        >
          + Add another team
        </button>
      </div>

      <Field label="Notes (optional)" error={form.formState.errors.notes?.message}>
        <textarea className="input min-h-[80px]" {...form.register("notes")} />
      </Field>

      <label className="flex gap-2 text-sm text-cool-grey">
        <input type="checkbox" {...form.register("eligibilityAcknowledged")} />
        We confirm our teams meet league eligibility (school-based, grades 3-6).
      </label>
      <label className="flex gap-2 text-sm text-cool-grey">
        <input type="checkbox" {...form.register("formsAcknowledged")} />
        We understand required yearly forms must be completed before play.
      </label>

      <p className="text-lg font-semibold text-ice-white">
        Estimated total: {formatUsdFromCents(total)} (snapshot at submission)
      </p>

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-royal-blue px-8 py-3 font-semibold text-white hover:bg-electric-blue disabled:opacity-50"
      >
        {status === "loading" ? "Submitting…" : "Submit registration request"}
      </button>

      {message && (
        <p className={status === "error" ? "text-red-300" : "text-green-300"} role="status">
          {message}
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-cool-grey">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
    </div>
  );
}
