import { z } from "zod";

export const registrationTeamSchema = z.object({
  teamName: z.string().min(2).max(120),
  divisionKey: z.enum(["grades-3-4", "grades-5-6"]),
});

export const registrationSchema = z.object({
  schoolName: z.string().min(2).max(200),
  contactName: z.string().min(2).max(120),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(7).max(30),
  seasonSlug: z.string().min(2),
  teams: z.array(registrationTeamSchema).min(1).max(10),
  notes: z.string().max(2000).optional(),
  eligibilityAcknowledged: z
    .boolean()
    .refine((v) => v === true, "Required"),
  formsAcknowledged: z.boolean().refine((v) => v === true, "Required"),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(5000),
});
