import { logger } from "@/lib/logger";
import { ClarificationQuestion, StructuredDesignSpecification } from "./types";
import { renderDesignMarkdown } from "./render-markdown";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";

export async function generateClarificationQuestions(
  ideaDescription: string
): Promise<ClarificationQuestion[]> {
  logger.info("Generating clarification questions", { ideaLength: ideaDescription.length });

  // Deepseek flash call or structured mock response for dev testing
  if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY.startsWith("mock")) {
    return [
      {
        id: "q1",
        question: "What primary user role or persona should be emphasized first in the workflow?",
        context: "Clarifying target user focus for initial navigation.",
      },
      {
        id: "q2",
        question: "Will users need offline access or mobile push notifications?",
        context: "Determining platform capabilities and technical bounds.",
      },
    ];
  }

  try {
    const res = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-v4-flash",
        messages: [
          {
            role: "system",
            content:
              "You are an expert product designer. Analyze the user's product idea and produce at most TWO high-impact clarification questions as a JSON array of objects with keys: id, question, context.",
          },
          {
            role: "user",
            content: ideaDescription,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      throw new Error(`Deepseek API error: ${res.statusText}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "[]";
    const cleaned = content.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned) as ClarificationQuestion[];
  } catch (err) {
    logger.error("Failed to fetch clarification questions from Deepseek", err);
    return [
      {
        id: "q1",
        question: "What primary target user role should be prioritized?",
        context: "Clarifying target audience scope.",
      },
      {
        id: "q2",
        question: "Are there any strict third-party API integrations required?",
        context: "Establishing technical scope.",
      },
    ];
  }
}

export async function generateFullSpecification(
  projectName: string,
  ideaDescription: string,
  answers: Array<{ question: string; answer: string }>
): Promise<{ spec: StructuredDesignSpecification; markdown: string }> {
  logger.info("Generating full design specification", { projectName });

  const formattedAnswers = answers
    .map((a) => `Q: ${a.question}\nA: ${a.answer}`)
    .join("\n\n");

  const prompt = `
Product Name: ${projectName}
Description: ${ideaDescription}

Confirmed Clarifications:
${formattedAnswers || "None provided"}
  `.trim();

  let spec: StructuredDesignSpecification;

  if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY.startsWith("mock")) {
    spec = {
      title: projectName,
      metadata: {
        version: "1.0.0",
        status: "Draft",
        lastUpdated: new Date().toISOString().split("T")[0],
      },
      overview: ideaDescription,
      goals: [
        { text: "Provide a seamless, intuitive experience for target users", isAssumption: false },
        { text: "Ensure fast (<2s) response times and accessible WCAG AA standards", isAssumption: false },
        { text: "Support easy export and portable documentation", isAssumption: false },
      ],
      nonGoals: [
        { text: "Real-time multi-user canvas collaboration in initial MVP", isAssumption: true },
      ],
      usersAndPersonas: [
        {
          role: "Product Designer / Manager",
          description: "Needs clear, structured design requirements before jumping into design tools or code.",
          needs: ["Structured specifications", "Exportable Markdown", "Clear user flows"],
        },
      ],
      userFlows: [
        {
          flowName: "Initial Setup & Specification Generation",
          steps: [
            "User enters product idea description in composer",
            "System asks up to 2 clarification questions",
            "User answers or skips questions",
            "System generates complete 13-section design.md document",
          ],
        },
      ],
      informationArchitecture: [
        { module: "Landing Page", details: "100vh minimalistic presentation with Get Started CTA" },
        { module: "Dashboard", details: "Project listing and active specifications overview" },
        { module: "Workspace", details: "Markdown spec reader, section editor, and export toolbar" },
      ],
      screensAndLayouts: [
        {
          screenName: "Specification Reader",
          layoutDescription: "Clean, comfortable reading column displaying generated design.md sections.",
          keyElements: ["Sticky navigation bar", "Table of contents", "Section regenerate button", "Export menu"],
        },
      ],
      componentsAndPatterns: [
        {
          componentName: "Prompt Composer",
          purpose: "Captures product ideas with multi-line input and clarification prompts.",
          pattern: "AI Composer Pattern",
        },
        {
          componentName: "Markdown Viewer",
          purpose: "Displays long-form design specifications with strict typography hierarchy.",
          pattern: "Notion-like document view",
        },
      ],
      states: {
        loading: "Skeleton loader with concrete stage labels",
        empty: "Educational prompt guiding user to describe their product idea",
        error: "User-actionable alert with retry option",
        success: "Clean document rendering with notification toast",
      },
      accessibilityNotes: [
        "Full keyboard tab navigation andEsc dialog trap",
        "WCAG 2.1 AA contrast ratio adherence across light theme tokens",
        "Semantic HTML landmark structures and aria-live status updates",
      ],
      assumptions: [
        "Primary users prefer clean Markdown output over proprietary canvas tools.",
      ],
      openQuestions: [
        "Will third-party export plugins (e.g. Notion integration) be required in Phase 2?",
      ],
    };
  } else {
    try {
      const res = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-v4-pro",
          messages: [
            {
              role: "system",
              content: `You are an elite product designer. Return a JSON object matching the exact specification schema: title, metadata (version, status, lastUpdated), overview, goals (array of {text, isAssumption}), nonGoals (array of {text, isAssumption}), usersAndPersonas (array of {role, description, needs}), userFlows (array of {flowName, steps}), informationArchitecture (array of {module, details}), screensAndLayouts (array of {screenName, layoutDescription, keyElements}), componentsAndPatterns (array of {componentName, purpose, pattern}), states (object with loading, empty, error, success keys), accessibilityNotes (string array), assumptions (string array), openQuestions (string array).`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.2,
        }),
      });

      if (!res.ok) {
        throw new Error(`Deepseek API error: ${res.statusText}`);
      }

      const data = await res.json();
      const rawJson = data.choices?.[0]?.message?.content || "{}";
      spec = JSON.parse(rawJson);
    } catch (err) {
      logger.error("Deepseek generation failed, falling back to structured model", err);
      spec = {
        title: projectName,
        metadata: {
          version: "1.0.0",
          status: "Draft",
          lastUpdated: new Date().toISOString().split("T")[0],
        },
        overview: ideaDescription,
        goals: [{ text: "Streamline product design specification", isAssumption: false }],
        nonGoals: [{ text: "Interactive wireframe editing", isAssumption: false }],
        usersAndPersonas: [{ role: "Product Manager", description: "Wants clean specs fast", needs: ["Speed"] }],
        userFlows: [{ flowName: "Create Spec", steps: ["Input idea", "Generate", "Export"] }],
        informationArchitecture: [{ module: "Workspace", details: "Main design.md reader" }],
        screensAndLayouts: [{ screenName: "Spec Reader", layoutDescription: "Single column document", keyElements: ["Markdown viewer"] }],
        componentsAndPatterns: [{ componentName: "Viewer", purpose: "Render document", pattern: "Reader" }],
        states: { loading: "Loading", empty: "Empty", error: "Error", success: "Success" },
        accessibilityNotes: ["Keyboard navigable"],
        assumptions: ["User needs Markdown output"],
        openQuestions: [],
      };
    }
  }

  const markdown = renderDesignMarkdown(spec);
  return { spec, markdown };
}
