import { apiSuccess } from "@/lib/api-response";

export async function GET() {
  return apiSuccess({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Luma Design Specification Platform",
  });
}
