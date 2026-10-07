import { ClarificationQuestion, StructuredDesignSpecification } from "@/services/ai/types";

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

export async function fetchClarificationQuestions(ideaDescription: string): Promise<ClarificationQuestion[]> {
  const res = await fetch("/api/design/clarify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ideaDescription }),
  });
  const data: ApiEnvelope<{ questions: ClarificationQuestion[] }> = await res.json();
  return data.data?.questions || [];
}

interface GenerateSpecInput {
  projectName: string;
  ideaDescription: string;
  answers: Array<{ question: string; answer: string }>;
  revision?: { instruction: string; previousSpec: StructuredDesignSpecification };
}

export async function generateSpecification(
  input: GenerateSpecInput
): Promise<{ spec: StructuredDesignSpecification; markdown: string }> {
  const res = await fetch("/api/design/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      projectName: input.projectName,
      ideaDescription: input.ideaDescription,
      answers: input.answers,
      revisionInstruction: input.revision?.instruction,
      previousSpec: input.revision?.previousSpec,
    }),
  });
  const data: ApiEnvelope<{ spec: StructuredDesignSpecification; markdown: string }> = await res.json();

  if (!data.success || !data.data) {
    throw new Error(data.error?.message || "Generation failed");
  }

  return data.data;
}
