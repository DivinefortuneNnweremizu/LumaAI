import { isAuthApiError, isAuthRetryableFetchError } from "@supabase/supabase-js";

/**
 * Translates Supabase Auth errors into plain, everyday language.
 * Never surface provider error strings (e.g. "fetch failed") to users.
 * See .agents/rules/architecture.md#error-handling.
 */
export function toFriendlyAuthMessage(error: unknown, context: "sign-up" | "sign-in"): string {
  if (isAuthRetryableFetchError(error)) {
    return "We can't reach our servers right now. Please check your internet connection and try again in a moment.";
  }

  if (isAuthApiError(error)) {
    const code = (error as { code?: string }).code;

    switch (code) {
      case "email_exists":
      case "user_already_exists":
      case "identity_already_exists":
        return "An account with this email already exists. Try signing in instead.";
      case "weak_password":
        return "That password is too easy to guess. Use a longer password with a mix of letters and numbers.";
      case "invalid_credentials":
        return "The email or password you entered doesn't match our records.";
      case "email_not_confirmed":
        return "Please confirm your email address before signing in. Check your inbox for the confirmation link.";
      case "email_address_invalid":
        return "That doesn't look like a valid email address. Please double-check and try again.";
      case "email_address_not_authorized":
        return "Sign-ups from this email address aren't allowed right now.";
      case "over_request_rate_limit":
      case "over_email_send_rate_limit":
        return "You've tried this too many times in a short period. Please wait a few minutes and try again.";
      case "signup_disabled":
        return "New sign-ups aren't available right now. Please try again later.";
      case "user_banned":
        return "This account isn't able to sign in right now. Contact support if you think this is a mistake.";
      case "same_password":
        return "That's the same as your current password. Please choose a different one.";
      case "captcha_failed":
        return "We couldn't verify you're human. Please refresh the page and try again.";
      default:
        break;
    }
  }

  return context === "sign-up"
    ? "We couldn't create your account right now. Please try again in a moment."
    : "We couldn't sign you in right now. Please try again in a moment.";
}
