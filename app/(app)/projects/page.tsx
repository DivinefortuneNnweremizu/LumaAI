"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, FileText, Calendar, ArrowRight, Sparkles } from "lucide-react";

interface MockProject {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  versionCount: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<MockProject[]>([
    {
      id: "demo-1",
      name: "Acme Analytics Mobile App",
      description: "Mobile analytics dashboard specification with real-time charts and export features.",
      updatedAt: "Today",
      versionCount: 2,
    },
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Design Specifications</h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Transform product ideas into implementation-ready <code className="px-1.5 py-0.5 rounded bg-surface-container font-mono text-[11px]">design.md</code> specifications.
          </p>
        </div>

        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-on-primary font-semibold text-sm hover:opacity-95 transition-all shadow-sm focus-visible:outline-none"
        >
          <Plus className="w-4 h-4" />
          <span>New Specification</span>
        </Link>
      </div>

      {/* Projects List or Educational Empty State */}
      {projects.length === 0 ? (
        <div className="w-full p-12 rounded-xl bg-surface border border-outline-variant text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-on-surface">Start by describing your first product idea.</h3>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
            Provide a text description, screenshot, or moodboard. Luma will ask up to 2 clarification questions and generate a full 13-section specification.
          </p>
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-on-primary text-xs font-bold hover:opacity-95 transition-opacity"
          >
            Create First Project
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="p-5 rounded-xl bg-surface border border-outline-variant hover:border-primary/60 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                    {p.name}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                    {p.versionCount} {p.versionCount === 1 ? "Version" : "Versions"}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-4 mt-4 border-t border-outline-variant/40">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Updated {p.updatedAt}
                </span>
                <span className="font-semibold text-primary group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  View Spec &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
