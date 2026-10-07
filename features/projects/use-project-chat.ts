import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchClarificationQuestions, generateSpecification } from "./api";
import { addProjectVersion, createDraftProject, getProject, saveProjectChat } from "./store";
import { Project, ProjectVersion } from "./types";
import { ChatImageAttachment, ChatMessage } from "./chat-types";
import { ClarificationQuestion } from "@/services/ai/types";
import { FREE_ENTITLEMENTS } from "@/services/billing/entitlements";

const GENERATION_STAGES = [
  "Understanding your product...",
  "Identifying design patterns...",
  "Creating user flows & information architecture...",
  "Writing the 13-section design.md...",
  "Reviewing accessibility & finalizing specification...",
];

const FALLBACK_QUESTION: ClarificationQuestion = {
  id: "q1",
  question: "What primary user role should be prioritized?",
  context: "Clarifying target audience scope.",
};

function newMessage(role: ChatMessage["role"], text: string, extra: Partial<ChatMessage> = {}): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    text,
    createdAt: new Date().toISOString(),
    ...extra,
  };
}

/**
 * Owns the chat-driven project creation/revision flow: conversation state,
 * clarification questions, generation status, and persistence. Keeps this
 * out of the page component per architecture.md's "business logic lives
 * off the UI" rule.
 */
export function useProjectChat(existingProjectId: string | null) {
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pendingQuestions, setPendingQuestions] = useState<ClarificationQuestion[] | null>(null);
  const [pendingIdea, setPendingIdea] = useState<{ title: string; description: string } | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [versions, setVersions] = useState<ProjectVersion[]>([]);
  const [activeVersionNumber, setActiveVersionNumber] = useState<number | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  // Load an existing chat-based project (e.g. returning from /projects)
  useEffect(() => {
    if (!existingProjectId) return;
    const found = getProject(existingProjectId);
    if (!found) return;
    setProject(found);
    setMessages(found.chat || []);
    setVersions(found.versions || []);
    if (found.versions && found.versions.length > 0) {
      setActiveVersionNumber(found.versions[found.versions.length - 1].versionNumber);
      setIsPanelOpen(true);
    }
  }, [existingProjectId]);

  const persistChat = (next: ChatMessage[], forProject: Project) => {
    setMessages(next);
    const saved = saveProjectChat(forProject.id, next);
    if (!saved) {
      setStorageError(
        "Your browser's storage is full, so this message wasn't saved. Try removing image attachments or clearing some older projects."
      );
    }
  };

  const ensureProject = (fromTitle: string): Project | null => {
    if (project) return project;
    try {
      const created = createDraftProject(fromTitle);
      setProject(created);
      router.replace(`/projects/new?project=${created.id}`, { scroll: false });
      return created;
    } catch (err) {
      setStorageError(err instanceof Error ? err.message : "Couldn't create the project.");
      return null;
    }
  };

  const withGenerationProgress = async <T,>(work: () => Promise<T>): Promise<T> => {
    setIsThinking(true);
    let stageIndex = 0;
    setStatusMessage(GENERATION_STAGES[0]);
    const interval = setInterval(() => {
      stageIndex++;
      if (stageIndex < GENERATION_STAGES.length) {
        setStatusMessage(GENERATION_STAGES[stageIndex]);
      }
    }, 1200);

    try {
      return await work();
    } finally {
      clearInterval(interval);
      setIsThinking(false);
      setStatusMessage(null);
    }
  };

  const runGeneration = async (
    activeProject: Project,
    title: string,
    description: string,
    answers: Array<{ question: string; answer: string }>,
    revision?: { instruction: string; previousSpec: ProjectVersion["spec"] }
  ) => {
    let savedVersion: ProjectVersion;
    try {
      const { spec, markdown } = await withGenerationProgress(() =>
        generateSpecification({ projectName: title, ideaDescription: description, answers, revision })
      );

      savedVersion = addProjectVersion(activeProject.id, {
        spec,
        markdown,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      const isStorageFailure = err instanceof Error && err.message.includes("storage");
      const failureText = isStorageFailure
        ? "The specification was generated, but your browser's storage is full so it couldn't be saved. Free up space and try again."
        : revision
        ? "I couldn't apply that change. Please try rephrasing your request or try again in a moment."
        : "I couldn't generate the specification. Please try again in a moment.";
      persistChat([...messages, newMessage("assistant", failureText)], activeProject);
      return;
    }

    setVersions((prev) => [...prev, savedVersion]);
    setActiveVersionNumber(savedVersion.versionNumber);
    setIsPanelOpen(true);

    const confirmationText = revision
      ? `I've updated the specification to version ${savedVersion.versionNumber} with that change. You can see it in the panel — let me know if you'd like anything else adjusted.`
      : `Your design.md is ready. I've opened it in the panel on the right — you can keep chatting here to refine any section.`;

    persistChat([...messages, newMessage("assistant", confirmationText)], activeProject);
  };

  const handleFirstSend = async (text: string, images: ChatImageAttachment[]) => {
    const title = text.trim().slice(0, 60) || "Untitled Product Specification";
    const activeProject = ensureProject(title);
    if (!activeProject) return; // storageError is already set

    const userMsg = newMessage("user", text, { images: images.length > 0 ? images : undefined });
    const withUser = [...messages, userMsg];
    persistChat(withUser, activeProject);
    setPendingIdea({ title, description: text });

    const maxFreeImages = FREE_ENTITLEMENTS.maxImagesPerMessage;
    const hitLimit = maxFreeImages !== -1 && images.length >= maxFreeImages;
    const attachmentNote = hitLimit
      ? ` Note: You've reached the Free plan limit of ${maxFreeImages} image${maxFreeImages === 1 ? "" : "s"} per message.`
      : "";

    setIsThinking(true);
    try {
      const fetched = await fetchClarificationQuestions(text);
      const questions = fetched.length > 0 ? fetched : [FALLBACK_QUESTION];
      setPendingQuestions(questions);
      persistChat(
        [
          ...withUser,
          newMessage(
            "assistant",
            `Thanks — before I write the specification, a couple of quick questions will help me get it right.${attachmentNote}`,
            { clarificationQuestions: questions }
          ),
        ],
        activeProject
      );
    } catch {
      setPendingQuestions([FALLBACK_QUESTION]);
      persistChat(
        [
          ...withUser,
          newMessage(
            "assistant",
            `Thanks — one quick question will help me get the specification right.${attachmentNote}`,
            { clarificationQuestions: [FALLBACK_QUESTION] }
          ),
        ],
        activeProject
      );
    } finally {
      setIsThinking(false);
    }
  };

  const handleClarificationSubmit = async (answers: Array<{ question: string; answer: string }>) => {
    if (!project || !pendingIdea) return;
    setPendingQuestions(null);

    const summary = answers.map((a) => `**${a.question}**\n${a.answer}`).join("\n\n");
    const withUser = [...messages, newMessage("user", summary)];
    persistChat(withUser, project);

    await runGeneration(project, pendingIdea.title, pendingIdea.description, answers);
  };

  const handleFollowUpSend = async (text: string, images: ChatImageAttachment[]) => {
    if (!project) return;

    const withUser = [...messages, newMessage("user", text, { images: images.length > 0 ? images : undefined })];
    persistChat(withUser, project);

    const latestVersion = versions[versions.length - 1];
    if (!latestVersion) return;

    await runGeneration(
      project,
      project.name,
      project.description || pendingIdea?.description || text,
      [],
      { instruction: text, previousSpec: latestVersion.spec }
    );
  };

  const sendMessage = (text: string, images: ChatImageAttachment[]) => {
    if (pendingQuestions) return; // must answer clarification first
    setStorageError(null);
    if (project && versions.length > 0) {
      handleFollowUpSend(text, images);
    } else if (project && pendingIdea) {
      // Idea already sent, questions pending elsewhere — ignore duplicate sends
      return;
    } else {
      handleFirstSend(text, images);
    }
  };

  const activeVersion = versions.find((v) => v.versionNumber === activeVersionNumber) || null;

  return {
    project,
    messages,
    pendingQuestions,
    isThinking,
    statusMessage,
    storageError,
    versions,
    activeVersion,
    isPanelOpen,
    setIsPanelOpen,
    setActiveVersionNumber,
    sendMessage,
    submitClarification: handleClarificationSubmit,
  };
}
