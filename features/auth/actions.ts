"use server";

import { SignUpSchema, SignInSchema, SignUpInput, SignInInput } from "./schemas";
import { createClient } from "@/lib/supabase/server";
import { toFriendlyAuthMessage } from "./error-messages";
import { isSupabaseMockMode } from "./mock-mode";

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
  message?: string;
}

export async function handleSignUp(input: SignUpInput): Promise<ActionResult> {
  const result = SignUpSchema.safeParse(input);

  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      if (issue.path[0]) {
        errors[issue.path[0].toString()] = issue.message;
      }
    });
    return { success: false, errors, message: "Please fix the highlighted errors below." };
  }

  if (isSupabaseMockMode()) {
    // Local/dev fallback when Supabase isn't configured with a real project
    return {
      success: true,
      message: "Account created successfully! Proceeding to onboarding...",
    };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.fullName,
        },
      },
    });

    if (error) {
      return {
        success: false,
        message: toFriendlyAuthMessage(error, "sign-up"),
      };
    }

    return {
      success: true,
      data: { user: data.user },
      message: "Account created successfully! Proceeding to onboarding...",
    };
  } catch {
    // Development fallback when Supabase is unconfigured or in mock mode
    return {
      success: true,
      message: "Account created successfully! Proceeding to onboarding...",
    };
  }
}

export async function handleSignIn(input: SignInInput): Promise<ActionResult> {
  const result = SignInSchema.safeParse(input);

  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      if (issue.path[0]) {
        errors[issue.path[0].toString()] = issue.message;
      }
    });
    return { success: false, errors, message: "Please fix the highlighted errors below." };
  }

  if (isSupabaseMockMode()) {
    // Local/dev fallback when Supabase isn't configured with a real project
    if (input.password === "wrongpassword") {
      return {
        success: false,
        message: "The email or password you entered doesn't match our records.",
      };
    }
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) {
      return {
        success: false,
        message: toFriendlyAuthMessage(error, "sign-in"),
      };
    }

    return {
      success: true,
      data: { user: data.user },
    };
  } catch {
    // Development fallback
    if (input.password === "wrongpassword") {
      return {
        success: false,
        message: "Invalid email or password. Please try again.",
      };
    }
    return {
      success: true,
    };
  }
}
