"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleSignIn } from "@/features/auth/actions";
import { SignInSchema, signInFieldSchemas } from "@/features/auth/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, LogIn } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = SignInSchema.safeParse(formData).success;

  const FIELD_LABELS: Record<string, string> = {
    email: "Email",
    password: "Password",
  };

  const validateField = (
    field: keyof typeof signInFieldSchemas,
    value: string,
    showLengthErrors: boolean
  ): string | undefined => {
    if (!value.trim()) {
      return showLengthErrors ? `${FIELD_LABELS[field]} cannot be empty` : undefined;
    }

    const result = signInFieldSchemas[field].safeParse(value);
    if (result.success) return undefined;

    const issue = result.error.issues[0];
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

  const handleChange = (field: keyof typeof signInFieldSchemas, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldError(field, validateField(field, value, touched[field] === true));
    if (generalError) setGeneralError(null);
  };

  const handleBlur = (field: keyof typeof signInFieldSchemas) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setFieldError(field, validateField(field, formData[field], true));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGeneralError(null);

    const res = await handleSignIn(formData);
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

    router.push("/projects");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">
          Welcome Back
        </h1>
        <p className="text-xs text-on-surface-variant">
          Sign in to access your product specifications.
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

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Email Address"
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
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          onBlur={() => handleBlur("password")}
          error={errors.password}
        />

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!isFormValid}
          variant="primary"
          size="lg"
          className="w-full mt-2"
        >
          <LogIn className="w-4 h-4 mr-2" />
          <span>Sign In to Workspace</span>
        </Button>
      </form>

      <div className="pt-2 text-center text-xs text-on-surface-variant border-t border-outline-variant/50">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-bold text-primary hover:underline transition-all"
        >
          Create an Account
        </Link>
      </div>
    </div>
  );
}
