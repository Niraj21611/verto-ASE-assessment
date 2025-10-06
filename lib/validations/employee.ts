import { z } from "zod"

const lettersOnly = /^[A-Za-z\s'-]+$/

export const employeeCreateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be 80 characters or less")
    .regex(lettersOnly, "Name can only contain letters, spaces, apostrophes, and hyphens"),
  email: z
    .string()
    .min(3, "Email is required")
    .max(120, "Email must be 120 characters or less")
    .email("Please enter a valid email address"),
  position: z
    .string()
    .min(2, "Position must be at least 2 characters")
    .max(80, "Position must be 80 characters or less")
    .regex(lettersOnly, "Position can only contain letters, spaces, apostrophes, and hyphens"),
})

export const employeeUpdateSchema = employeeCreateSchema.partial().superRefine((val, ctx) => {
  if (!val.name && !val.email && !val.position) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "At least one field must be provided for update",
      path: [],
    })
  }
})

export type EmployeeCreateInput = z.infer<typeof employeeCreateSchema>
export type EmployeeUpdateInput = z.infer<typeof employeeUpdateSchema>
