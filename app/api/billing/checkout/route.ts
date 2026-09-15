import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { createCheckoutSession } from "@/services/billing/flutterwave";

export async function POST(req: NextRequest) {
  try {
    const session = await createCheckoutSession("demo-user-id", "user@example.com");
    return apiSuccess(session);
  } catch (err) {
    return apiError("Failed to create billing checkout session", "SERVER_ERROR", 500);
  }
}
