import { z } from "zod";

const fullNameSchema = z
  .string()
  .min(2, "Full name must be at least 2 characters long")
  .regex(/^[A-Za-z\s'-]+$/, "Full name can only contain letters, spaces, hyphens, and apostrophes — no numbers or symbols");

const emailSchema = z
  .string()
  .min(1, "Email address is required")
  .email("Please enter a valid email address");

const passwordSchema = z
  .string()
  .min(8, "Your password needs to be at least 8 characters long")
  .regex(/[A-Za-z]/, "Your password needs at least one letter")
  .regex(/[0-9]/, "Your password needs at least one number");

export const SignUpSchema = z
  .object({
    fullName: fullNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export type SignInInput = z.infer<typeof SignInSchema>;

/** Per-field schemas, for live validation as the user types. */
export const signUpFieldSchemas = {
  fullName: fullNameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, "Please confirm your password"),
} as const;

export const signInFieldSchemas = {
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
} as const;

export const OnboardingStep1Schema = z.object({
  role: z.string().min(1, "Please select your primary role"),
});

export const OnboardingStep2Schema = z.object({
  goal: z.string().min(1, "Please select your primary goal"),
});
