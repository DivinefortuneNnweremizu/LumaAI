import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { generateClarificationQuestions } from "@/services/ai/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ideaDescription } = body;

    if (!ideaDescription) {
      return apiError("ideaDescription is required", "VALIDATION_ERROR", 400);
    }

    const questions = await generateClarificationQuestions(ideaDescription);
    return apiSuccess({ questions });
  } catch (err) {
    return apiError("Failed to generate clarification questions", "SERVER_ERROR", 500);
  }
}
