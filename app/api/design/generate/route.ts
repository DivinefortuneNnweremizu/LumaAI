import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { generateFullSpecification } from "@/services/ai/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectName, ideaDescription, answers } = body;

    if (!ideaDescription) {
      return apiError("ideaDescription is required", "VALIDATION_ERROR", 400);
    }

    const name = projectName || "Untitled Product Specification";
    const { spec, markdown } = await generateFullSpecification(name, ideaDescription, answers || []);

    return apiSuccess({
      projectId: "demo-1",
      spec,
      markdown,
    });
  } catch (err) {
    return apiError("Failed to generate design specification", "SERVER_ERROR", 500);
  }
}
