import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature, verifyFlutterwaveTransaction } from "@/services/billing/flutterwave";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("verif-hash");
    if (!verifyWebhookSignature(signature)) {
      logger.warn("Invalid Flutterwave webhook signature");
      return NextResponse.json({ status: "error", message: "Invalid signature" }, { status: 401 });
    }

    const payload = await req.json();
    const { event, data } = payload;

    logger.info("Flutterwave webhook received", { event, tx_ref: data?.tx_ref });

    if (event === "charge.completed" && data?.status === "successful") {
      const isVerified = await verifyFlutterwaveTransaction(data.id);
      if (isVerified) {
        logger.info("Transaction verified, upgrading user subscription", { reference: data.tx_ref });
        // Upgrade subscription logic verified
      }
    }

    return NextResponse.json({ status: "success" });
  } catch (err) {
    logger.error("Error processing Flutterwave webhook", err);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
