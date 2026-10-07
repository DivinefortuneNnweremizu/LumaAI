import { ClarificationQuestion } from "@/services/ai/types";

export interface ChatImageAttachment {
  id: string;
  name: string;
  dataUrl: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  images?: ChatImageAttachment[];
  clarificationQuestions?: ClarificationQuestion[];
  createdAt: string;
}
