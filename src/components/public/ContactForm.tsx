"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/validators/registration";
import type { z } from "zod";
import { useState } from "react";

type FormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setStatus("loading");
    setMessage("");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus("error");
      setMessage(typeof data.error === "string" ? data.error : "Failed to send. Please try again.");
      return;
    }
    setStatus("done");
    setMessage("Thank you — your message was sent to league staff.");
    form.reset();
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="rounded-2xl border border-electric-blue/15 bg-[#020a18]/40 p-6 sm:p-8"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" error={form.formState.errors.name?.message} className="sm:col-span-2">
          <input className="input w-full" autoComplete="name" {...form.register("name")} />
        </Field>
        <Field label="Email" error={form.formState.errors.email?.message}>
          <input
            className="input w-full"
            type="email"
            autoComplete="email"
            {...form.register("email")}
          />
        </Field>
        <Field label="Phone (optional)" error={form.formState.errors.phone?.message}>
          <input className="input w-full" type="tel" autoComplete="tel" {...form.register("phone")} />
        </Field>
        <Field label="Subject" error={form.formState.errors.subject?.message} className="sm:col-span-2">
          <input className="input w-full" {...form.register("subject")} />
        </Field>
        <Field label="Message" error={form.formState.errors.message?.message} className="sm:col-span-2">
          <textarea
            className="input min-h-[140px] w-full resize-y"
            {...form.register("message")}
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 w-full rounded-full bg-royal-blue px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-electric-blue disabled:opacity-50 sm:w-auto"
      >
        {status === "loading" ? "Sending…" : "Send message"}
      </button>

      {message ? (
        <p
          role="status"
          className={`mt-4 text-sm ${status === "error" ? "text-red-300" : "text-green-300"}`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-ice-white">{label}</label>
      {children}
      {error ? <p className="mt-1 text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
