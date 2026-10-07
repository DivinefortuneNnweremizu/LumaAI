"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleSignUp } from "@/features/auth/actions";
import { signUpFieldSchemas } from "@/features/auth/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, UserPlus, CheckCircle2 } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const FIELD_LABELS: Record<string, string> = {
    fullName: "Full name",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm password",
  };

  const validateField = (
    field: keyof typeof signUpFieldSchemas,
    value: string,
    passwordValue: string,
    showLengthErrors: boolean
  ): string | undefined => {
    if (!value.trim()) {
      return showLengthErrors ? `${FIELD_LABELS[field]} cannot be empty` : undefined;
    }

    if (field === "confirmPassword") {
      return value !== passwordValue ? "Passwords do not match" : undefined;
    }

    const result = signUpFieldSchemas[field].safeParse(value);
    if (result.success) return undefined;

    const issue = result.error.issues[0];
    // While the user is still typing, don't flag "too short" yet — only
    // surface it once they've paused (blur) or the field was already touched.
    if (!showLengthErrors && issue.code === "too_small") return undefined;
    return issue.message;
  };

  const setFieldError = (field: string, error: string | undefined) => {
    setErrors((prev) => {
      const copy = { ...prev };
      if (error) {
        copy[field] = error;
      } else {
        delete copy[field];
      }
      return copy;
    });
  };

  const handleChange = (field: keyof typeof signUpFieldSchemas, value: string) => {
    const nextFormData = { ...formData, [field]: value };
    setFormData(nextFormData);

    setFieldError(field, validateField(field, value, nextFormData.password, touched[field] === true));

    // Keep the confirm-password error in sync when the password itself changes.
    if (field === "password" && nextFormData.confirmPassword) {
      setFieldError(
        "confirmPassword",
        validateField("confirmPassword", nextFormData.confirmPassword, value, touched.confirmPassword === true)
      );
    }

    if (generalError) setGeneralError(null);
  };

  const handleBlur = (field: keyof typeof signUpFieldSchemas) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setFieldError(field, validateField(field, formData[field], formData.password, true));
  };

  const isFormIncomplete = Object.values(formData).some((value) => !value.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);

    const hasEmptyField = Object.values(formData).some((value) => !value.trim());
    if (hasEmptyField) {
      setGeneralError("Fields cannot be empty. Please fill in all fields to continue.");
      return;
    }

    setIsLoading(true);
    const res = await handleSignUp(formData);
    setIsLoading(false);

    if (!res.success) {
      if (res.errors) {
        setErrors(res.errors);
      }
      if (res.message) {
        setGeneralError(res.message);
      }
      return;
    }

    setSuccessMessage("Account created! Redirecting to onboarding...");
    setTimeout(() => {
      router.push("/onboarding");
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">
          Create your Account
        </h1>
        <p className="text-xs text-on-surface-variant">
          Start transforming your product ideas into structured specs.
        </p>
      </div>

      {generalError && (
        <div
          role="alert"
          className="p-3.5 rounded-md bg-error-container border border-error/30 text-on-error-container flex items-start gap-2.5 text-xs font-medium animate-in fade-in"
        >
          <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
          <span>{generalError}</span>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="p-3.5 rounded-md bg-success-container border border-success/30 text-on-success-container flex items-start gap-2.5 text-xs font-medium animate-in fade-in"
        >
          <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="e.g. Alex Morgan"
          value={formData.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          onBlur={() => handleBlur("fullName")}
          error={errors.fullName}
        />

        <Input
          label="Work Email"
          type="email"
          placeholder="alex@company.com"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          error={errors.email}
        />

        <Input
          label="Password"
          type="password"
          placeholder="At least 8 characters (letters & numbers)"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          onBlur={() => handleBlur("password")}
          error={errors.password}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          onBlur={() => handleBlur("confirmPassword")}
          error={errors.confirmPassword}
        />

        <Button
          type="submit"
          isLoading={isLoading}
          variant="primary"
          size="lg"
          className={`w-full mt-2 ${isFormIncomplete ? "cursor-not-allowed" : ""}`}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          <span>Create Account & Continue</span>
        </Button>
      </form>

      <div className="pt-2 text-center text-xs text-on-surface-variant border-t border-outline-variant/50">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-bold text-primary hover:underline transition-all"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
