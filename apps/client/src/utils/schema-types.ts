import { z } from "zod";

export const subjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  parentId: z.nullable(z.string().uuid()),
  credits: z.number().int().positive(),
});

export const classSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  teacher: z.string(),
  place: z.string(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  maxStudents: z.number().int().positive(),
  subjectId: z.number().int().positive(),
  subject: subjectSchema,
});

export type ClassSchema = z.infer<typeof classSchema>;

const studentSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export type StudentSchema = z.infer<typeof studentSchema>;
