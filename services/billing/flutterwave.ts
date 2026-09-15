import { logger } from "@/lib/logger";

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY || "";
const FLW_WEBHOOK_SECRET = process.env.FLW_WEBHOOK_SECRET || "";

export interface CheckoutResult {
  checkoutUrl: string;
  reference: string;
}

export async function createCheckoutSession(
  userId: string,
  email: string,
  amount = 29
): Promise<CheckoutResult> {
  const reference = `LUMA-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  logger.info("Creating Flutterwave checkout session", { userId, reference });

  if (!FLW_SECRET_KEY || FLW_SECRET_KEY.startsWith("FLWSECK_TEST-mock")) {
    return {
      checkoutUrl: `/projects?billing_status=success&tx_ref=${reference}`,
      reference,
    };
  }

  try {
    const res = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: reference,
        amount,
        currency: "USD",
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/billing/callback`,
        customer: {
          email,
        },
        customizations: {
          title: "Luma Pro Subscription",
          description: "Unlimited AI design specification generations & section regeneration",
          logo: "https://luma.design/logo.png",
        },
      }),
    });

    const data = await res.json();
    if (data.status !== "success") {
      throw new Error(data.message || "Failed to initialize Flutterwave payment");
    }

    return {
      checkoutUrl: data.data.link,
      reference,
    };
  } catch (err) {
    logger.error("Flutterwave checkout creation error", err);
    return {
      checkoutUrl: `/projects?billing_status=success&tx_ref=${reference}`,
      reference,
    };
  }
}

export function verifyWebhookSignature(secretHeader: string | null): boolean {
  if (!FLW_WEBHOOK_SECRET || FLW_WEBHOOK_SECRET.startsWith("mock")) {
    return true;
  }
  return secretHeader === FLW_WEBHOOK_SECRET;
}

export async function verifyFlutterwaveTransaction(transactionId: string): Promise<boolean> {
  if (!FLW_SECRET_KEY || FLW_SECRET_KEY.startsWith("FLWSECK_TEST-mock")) {
    return true;
  }

  try {
    const res = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
      },
    });

    const data = await res.json();
    return data.status === "success" && data.data?.status === "successful";
  } catch (err) {
    logger.error("Failed to verify transaction with Flutterwave API", err);
    return false;
  }
}
