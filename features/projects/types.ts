import { StructuredDesignSpecification } from "@/services/ai/types";
import { ChatMessage } from "./chat-types";

export interface ProjectVersion {
  versionNumber: number;
  spec: StructuredDesignSpecification;
  markdown: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  versionCount: number;
  chat?: ChatMessage[];
  versions?: ProjectVersion[];
}
