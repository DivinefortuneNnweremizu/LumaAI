import { z } from "zod";

export const FactOrAssumptionSchema = z.object({
  text: z.string(),
  isAssumption: z.boolean().default(false),
});

export type FactOrAssumption = z.infer<typeof FactOrAssumptionSchema>;

export const StructuredDesignSpecificationSchema = z.object({
  title: z.string(),
  metadata: z.object({
    version: z.string(),
    status: z.string(),
    lastUpdated: z.string(),
  }),
  overview: z.string(),
  goals: z.array(FactOrAssumptionSchema),
  nonGoals: z.array(FactOrAssumptionSchema),
  usersAndPersonas: z.array(z.object({
    role: z.string(),
    description: z.string(),
    needs: z.array(z.string()),
  })),
  userFlows: z.array(z.object({
    flowName: z.string(),
    steps: z.array(z.string()),
  })),
  informationArchitecture: z.array(z.object({
    module: z.string(),
    details: z.string(),
  })),
  screensAndLayouts: z.array(z.object({
    screenName: z.string(),
    layoutDescription: z.string(),
    keyElements: z.array(z.string()),
  })),
  componentsAndPatterns: z.array(z.object({
    componentName: z.string(),
    purpose: z.string(),
    pattern: z.string(),
  })),
  states: z.object({
    loading: z.string(),
    empty: z.string(),
    error: z.string(),
    success: z.string(),
  }),
  accessibilityNotes: z.array(z.string()),
  assumptions: z.array(z.string()),
  openQuestions: z.array(z.string()),
});

export type StructuredDesignSpecification = z.infer<typeof StructuredDesignSpecificationSchema>;

export interface ClarificationQuestion {
  id: string;
  question: string;
  context: string;
}
