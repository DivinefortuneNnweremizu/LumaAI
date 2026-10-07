import { Project, ProjectVersion } from "./types";
import { ChatMessage } from "./chat-types";

const STORAGE_KEY = "luma:projects";

const DEMO_PROJECT: Project = {
  id: "demo-1",
  name: "Acme Analytics Mobile App",
  description: "Mobile analytics dashboard specification with real-time charts and export features.",
  updatedAt: "Today",
  versionCount: 2,
};

/**
 * Local project store, backed by localStorage until a real database is
 * connected (see prisma/schema.prisma's Project model for the eventual
 * source of truth). Keeps onboarding/new-project creation visible on
 * /projects without requiring a live backend.
 */
export function getProjects(): Project[] {
  if (typeof window === "undefined") return [DEMO_PROJECT];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([DEMO_PROJECT]));
      return [DEMO_PROJECT];
    }
    return JSON.parse(raw) as Project[];
  } catch {
    return [DEMO_PROJECT];
  }
}

export function getProject(id: string): Project | undefined {
  return getProjects().find((p) => p.id === id);
}

/** Returns true if the write succeeded, false if storage is full/unavailable. */
function persist(projects: Project[]): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return true;
  } catch {
    // localStorage unavailable (private browsing, quota exceeded) — the
    // caller's in-memory state has already moved on, so callers must be
    // told this failed instead of silently drifting from what's stored.
    return false;
  }
}

function upsertProject(project: Project): boolean {
  const projects = getProjects();
  const idx = projects.findIndex((p) => p.id === project.id);
  const updated = idx === -1 ? [project, ...projects] : projects.map((p) => (p.id === project.id ? project : p));
  return persist(updated);
}

/** Creates a project with no specification yet, for the chat-first new-project flow. */
export function createDraftProject(name: string): Project {
  const project: Project = {
    id: crypto.randomUUID(),
    name,
    description: "",
    updatedAt: "Today",
    versionCount: 0,
    chat: [],
    versions: [],
  };

  const saved = upsertProject(project);
  if (!saved) {
    throw new Error("Couldn't create the project — your browser's storage is full or unavailable.");
  }
  return project;
}

/** Returns false if the chat couldn't be persisted (e.g. storage is full). */
export function saveProjectChat(projectId: string, chat: ChatMessage[]): boolean {
  const project = getProject(projectId);
  if (!project) return false;
  return upsertProject({ ...project, chat, updatedAt: "Today" });
}

/**
 * Saves a new version. Throws if the project doesn't exist or the write
 * couldn't be persisted, so callers don't treat a failed save as if the
 * version were actually stored.
 */
export function addProjectVersion(
  projectId: string,
  version: Omit<ProjectVersion, "versionNumber">
): ProjectVersion {
  const project = getProject(projectId);
  if (!project) throw new Error(`Project ${projectId} not found`);

  const existingVersions = project.versions || [];
  const newVersion: ProjectVersion = {
    ...version,
    versionNumber: existingVersions.length + 1,
  };

  const saved = upsertProject({
    ...project,
    description: project.description || version.spec.overview,
    versions: [...existingVersions, newVersion],
    versionCount: existingVersions.length + 1,
    updatedAt: "Today",
  });

  if (!saved) {
    throw new Error("Couldn't save this version — your browser's storage is full or unavailable.");
  }

  return newVersion;
}
