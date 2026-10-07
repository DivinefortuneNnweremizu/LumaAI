import { logger } from "@/lib/logger";
import { ClarificationQuestion, StructuredDesignSpecification, StructuredDesignSpecificationSchema } from "./types";
import { renderDesignMarkdown } from "./render-markdown";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";

function buildDynamicQuestions(ideaDescription: string): ClarificationQuestion[] {
  const text = ideaDescription.toLowerCase();
  const questions: ClarificationQuestion[] = [];

  if (text.includes("mobile") || text.includes("app") || text.includes("ios") || text.includes("android")) {
    questions.push({
      id: "q1",
      question: "Should this prioritize native mobile features (e.g., push notifications, offline storage) or web responsive access?",
      context: "Clarifying platform architecture and technical bounds.",
    });
  } else if (text.includes("data") || text.includes("dashboard") || text.includes("analytics") || text.includes("report")) {
    questions.push({
      id: "q1",
      question: "What primary metrics, charts, or export formats are required for the main view?",
      context: "Establishing data visualization and reporting scope.",
    });
  } else {
    questions.push({
      id: "q1",
      question: "What primary target user persona or workflow should be prioritized in the initial launch?",
      context: "Clarifying core user focus for primary navigation and feature hierarchy.",
    });
  }

  if (text.includes("user") || text.includes("team") || text.includes("role") || text.includes("auth") || text.includes("login")) {
    questions.push({
      id: "q2",
      question: "What level of access control or multi-tenant permissions will team members require?",
      context: "Defining user roles and security boundaries.",
    });
  } else {
    questions.push({
      id: "q2",
      question: "Are there key third-party services or APIs (e.g. payment, CRM, email) that must be integrated?",
      context: "Determining external dependency scope.",
    });
  }

  return questions.slice(0, 2);
}

function buildDynamicSpecification(
  projectName: string,
  ideaDescription: string,
  answers: Array<{ question: string; answer: string }>,
  revision?: { instruction: string; previousSpec: StructuredDesignSpecification }
): StructuredDesignSpecification {
  const dateStr = new Date().toISOString().split("T")[0];

  if (revision) {
    const [major, minor = "0", patch = "0"] = revision.previousSpec.metadata.version.split(".");
    const nextVersion = `${major}.${(parseInt(minor, 10) || 0) + 1}.${patch}`;
    
    return {
      ...revision.previousSpec,
      metadata: {
        ...revision.previousSpec.metadata,
        version: nextVersion,
        lastUpdated: dateStr,
      },
      overview: `${revision.previousSpec.overview}\n\n**Revision Updates (v${nextVersion}):** Incorporated change request: "${revision.instruction}".`,
      assumptions: [
        `Revision instruction applied: "${revision.instruction}"`,
        ...revision.previousSpec.assumptions,
      ],
    };
  }

  const cleanTitle = projectName.trim() || "Product Specification";
  const cleanDescription = ideaDescription.trim() || "Product concept specification.";
  const answersText = answers.length > 0
    ? answers.map((a) => `${a.question}: ${a.answer}`).join("; ")
    : "";

  return {
    title: cleanTitle,
    metadata: {
      version: "1.0.0",
      status: "Draft",
      lastUpdated: dateStr,
    },
    overview: `${cleanTitle} is a tailored digital product designed to streamline workflows and solve user pain points. ${cleanDescription} ${
      answersText ? `\n\nKey decisions established during initial planning:\n- ${answers.map((a) => `${a.question} → ${a.answer}`).join("\n- ")}` : ""
    }\n\nThe product emphasizes content-first design, low latency, clear visual hierarchy, and an intuitive user interface for end users.`,
    goals: [
      { text: `Deliver an intuitive, high-performance interface for ${cleanTitle}`, isAssumption: false },
      { text: "Achieve fast initial load times (<2 seconds) and responsive reflow across device sizes", isAssumption: false },
      { text: "Comply with WCAG 2.1 AA accessibility standards including keyboard navigation and focus management", isAssumption: false },
      { text: "Provide structured data management and portable export functionality", isAssumption: false },
      { text: "Maintain strict security boundaries with server-side validation and authorization", isAssumption: false },
    ],
    nonGoals: [
      { text: "Complex real-time multi-tenant canvas collaboration in the initial MVP release", isAssumption: true },
      { text: "Custom third-party plugin extension ecosystem prior to core feature stabilization", isAssumption: true },
    ],
    usersAndPersonas: [
      {
        role: "Primary End User",
        description: `Direct user interacting with ${cleanTitle} to accomplish key tasks efficiently with minimal friction.`,
        needs: [
          "Fast onboarding and intuitive primary workflows",
          "Clear visual feedback and status announcements",
          "Reliable data persistence and responsive controls",
        ],
      },
      {
        role: "Administrator / Team Lead",
        description: "Oversees system settings, manages user permissions, and reviews platform analytics or activity history.",
        needs: [
          "Comprehensive admin controls and overview dashboard",
          "Exportable reports and audit history",
          "Role-based permission configuration",
        ],
      },
    ],
    userFlows: [
      {
        flowName: "Initial Setup & Core Workflow Execution",
        steps: [
          `User launches ${cleanTitle} application interface`,
          "User completes brief onboarding or enters initial setup parameters",
          "System validates inputs and configures default workspace state",
          "User executes primary action and views real-time progress feedback",
          "System persists output and displays interactive review options",
        ],
      },
      {
        flowName: "Data Inspection & Export Workflow",
        steps: [
          "User navigates to the detailed overview panel",
          "User applies filters or requests dynamic updates",
          "System updates the view while preserving user preferences",
          "User exports finalized data or document output",
        ],
      },
    ],
    informationArchitecture: [
      { module: "Main Dashboard", details: "Central overview panel featuring active items, status cards, and primary creation CTAs." },
      { module: "Primary Workspace", details: "Core interactive workspace containing main controls, input area, and result display." },
      { module: "Inspector & Details Panel", details: "Contextual drawer/panel for deep-dive editing and metadata inspection." },
      { module: "Settings & Profile", details: "Account management, security settings, notification preferences, and billing integration." },
    ],
    screensAndLayouts: [
      {
        screenName: "Primary Workspace Screen",
        layoutDescription: "Spacious single-column main content layout with optional collapsible inspection side panel.",
        keyElements: [
          "Header bar with navigation breadcrumbs and user profile menu",
          "Interactive input/composer area with action controls",
          "Dynamic status indicator bar with step feedback",
          "Main content viewer with zoom/scroll controls",
        ],
      },
      {
        screenName: "Management Dashboard",
        layoutDescription: "Grid-based overview dashboard displaying metric cards and active project items.",
        keyElements: [
          "Global Command Search bar (Cmd+K / Ctrl+K)",
          "Filter chips and sort dropdown controls",
          "Responsive grid of project cards with status tags",
          "Educational empty state widget for new users",
        ],
      },
    ],
    componentsAndPatterns: [
      {
        componentName: "Input Composer",
        purpose: "Captures user inputs and parameters with multi-line text support and action triggers.",
        pattern: "Floating composer bar with auto-expanding text area",
      },
      {
        componentName: "Document / Data Viewer",
        purpose: "Displays primary outputs with clear typography scale and syntax formatting.",
        pattern: "Content-first reader view with contextual toolbar",
      },
      {
        componentName: "Clarification Prompt Card",
        purpose: "Surfaces contextual follow-up questions to refine output accuracy.",
        pattern: "Inline surface container with form controls",
      },
      {
        componentName: "Status & Progress Bar",
        purpose: "Communicates asynchronous background process stage updates.",
        pattern: "Animated progress toast with accessible live-region announcements",
      },
    ],
    states: {
      loading: "Progressive skeleton loaders reserving layout bounds with concrete stage status text.",
      empty: "Educational empty state card with clear instructions and prominent primary CTA button.",
      error: "User-actionable alert banner with plain-language error message and immediate retry button.",
      success: "Clean surface render with subtle confirmation toast notification.",
    },
    accessibilityNotes: [
      "WCAG 2.1 AA compliant color contrast ratios across light and dark mode design tokens.",
      "Full keyboard navigation support with visible focus rings and Esc key overlay dismissal.",
      "Semantic HTML5 structure (<main>, <nav>, <header>) with a single <h1> heading per screen.",
      "Aria-live region announcements for background processing and streaming updates.",
      "Minimum 44x44px touch targets and full respect for prefers-reduced-motion CSS settings.",
    ],
    assumptions: [
      `Target users access ${cleanTitle} via standard web and mobile browsers.`,
      "All user inputs are validated both client-side for UX and server-side for security.",
    ],
    openQuestions: [
      "Should third-party export integrations (e.g. Notion, Jira, or PDF export) be prioritized for Phase 2?",
      "Will real-time multi-user collaboration be required for team accounts?",
    ],
  };
}

export async function generateClarificationQuestions(
  ideaDescription: string
): Promise<ClarificationQuestion[]> {
  logger.info("Generating clarification questions", { ideaLength: ideaDescription.length });

  if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY.startsWith("mock")) {
    return buildDynamicQuestions(ideaDescription);
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
    return buildDynamicQuestions(ideaDescription);
  }
}

export async function generateFullSpecification(
  projectName: string,
  ideaDescription: string,
  answers: Array<{ question: string; answer: string }>,
  revision?: { instruction: string; previousSpec: StructuredDesignSpecification }
): Promise<{ spec: StructuredDesignSpecification; markdown: string }> {
  logger.info("Generating full design specification", { projectName, isRevision: !!revision });

  const formattedAnswers = answers
    .map((a) => `Q: ${a.question}\nA: ${a.answer}`)
    .join("\n\n");

  const prompt = revision
    ? `
Product Name: ${projectName}
Original Description: ${ideaDescription}

Existing Specification (JSON):
${JSON.stringify(revision.previousSpec)}

Requested Change:
${revision.instruction}

Update the existing specification to reflect the requested change. Preserve all sections and details that were not affected by the request.
    `.trim()
    : `
Product Name: ${projectName}
Description: ${ideaDescription}

Confirmed Clarifications:
${formattedAnswers || "None provided"}
  `.trim();

  let spec: StructuredDesignSpecification;

  if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY.startsWith("mock")) {
    spec = buildDynamicSpecification(projectName, ideaDescription, answers, revision);
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
              content: `You are an elite principal product designer. Generate an exhaustive, highly detailed 13-section design specification in JSON matching the exact schema:
- title: string
- metadata: { version: string, status: string, lastUpdated: string }
- overview: comprehensive description of the product, target audience, and core value proposition
- goals: array of {text: string, isAssumption: boolean} (5+ specific goals)
- nonGoals: array of {text: string, isAssumption: boolean} (2+ explicit boundaries)
- usersAndPersonas: array of {role: string, description: string, needs: string[]} (2+ personas with detailed needs each)
- userFlows: array of {flowName: string, steps: string[]} (2+ flows with 5+ step-by-step actions each)
- informationArchitecture: array of {module: string, details: string} (4+ core modules)
- screensAndLayouts: array of {screenName: string, layoutDescription: string, keyElements: string[]} (3+ screens with UI elements each)
- componentsAndPatterns: array of {componentName: string, purpose: string, pattern: string} (4+ design system components)
- states: object with loading, empty, error, success keys (detailed interaction states)
- accessibilityNotes: string array (4+ WCAG AA requirements)
- assumptions: string array (explicitly tagged assumptions)
- openQuestions: string array (unresolved technical or product questions)

Tailor EVERY SINGLE SECTION specifically to the user's product idea and answered clarification questions. Make the specification comprehensive, implementation-ready, and thorough.`,
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
      const parsed = JSON.parse(rawJson);

      const validated = StructuredDesignSpecificationSchema.safeParse(parsed);
      if (!validated.success) {
        throw new Error(`Deepseek response didn't match the expected specification shape: ${validated.error.message}`);
      }
      spec = validated.data;
    } catch (err) {
      logger.error("Deepseek generation failed, falling back to dynamic model", err);
      spec = buildDynamicSpecification(projectName, ideaDescription, answers, revision);
    }
  }

  const markdown = renderDesignMarkdown(spec);
  return { spec, markdown };
}
