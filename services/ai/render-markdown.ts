import { StructuredDesignSpecification } from "./types";

export function renderDesignMarkdown(spec: StructuredDesignSpecification): string {
  const dateStr = spec.metadata.lastUpdated || new Date().toISOString().split("T")[0];

  let md = `# ${spec.title}\n\n`;

  // Metadata block
  md += `| Field | Value |\n`;
  md += `|---|---|\n`;
  md += `| **Version** | ${spec.metadata.version} |\n`;
  md += `| **Status** | ${spec.metadata.status} |\n`;
  md += `| **Last Updated** | ${dateStr} |\n\n`;

  // Overview
  md += `## Overview\n\n${spec.overview}\n\n`;

  // Goals
  md += `## Goals\n\n`;
  spec.goals.forEach((item) => {
    md += `- ${item.text}${item.isAssumption ? " *(Assumption)*" : ""}\n`;
  });
  md += `\n`;

  // Non-Goals
  if (spec.nonGoals && spec.nonGoals.length > 0) {
    md += `## Non-Goals\n\n`;
    spec.nonGoals.forEach((item) => {
      md += `- ${item.text}${item.isAssumption ? " *(Assumption)*" : ""}\n`;
    });
    md += `\n`;
  }

  // Users & Personas
  md += `## Users & Personas\n\n`;
  spec.usersAndPersonas.forEach((persona) => {
    md += `### ${persona.role}\n\n`;
    md += `${persona.description}\n\n`;
    if (persona.needs && persona.needs.length > 0) {
      md += `**Key Needs:**\n`;
      persona.needs.forEach((need) => {
        md += `- ${need}\n`;
      });
      md += `\n`;
    }
  });

  // User Flows
  md += `## User Flows\n\n`;
  spec.userFlows.forEach((flow) => {
    md += `### ${flow.flowName}\n\n`;
    flow.steps.forEach((step, idx) => {
      md += `${idx + 1}. ${step}\n`;
    });
    md += `\n`;
  });

  // Information Architecture
  md += `## Information Architecture\n\n`;
  md += `| Module / Area | Description |\n`;
  md += `|---|---|\n`;
  spec.informationArchitecture.forEach((ia) => {
    md += `| **${ia.module}** | ${ia.details} |\n`;
  });
  md += `\n`;

  // Screens & Layouts
  md += `## Screens & Layouts\n\n`;
  spec.screensAndLayouts.forEach((screen) => {
    md += `### ${screen.screenName}\n\n`;
    md += `${screen.layoutDescription}\n\n`;
    if (screen.keyElements && screen.keyElements.length > 0) {
      md += `**Key Elements:**\n`;
      screen.keyElements.forEach((el) => {
        md += `- ${el}\n`;
      });
      md += `\n`;
    }
  });

  // Components & Patterns
  md += `## Components & Patterns\n\n`;
  md += `| Component | Purpose | Pattern / Notes |\n`;
  md += `|---|---|---|\n`;
  spec.componentsAndPatterns.forEach((comp) => {
    md += `| **${comp.componentName}** | ${comp.purpose} | ${comp.pattern} |\n`;
  });
  md += `\n`;

  // States
  md += `## States\n\n`;
  md += `- **Loading:** ${spec.states.loading}\n`;
  md += `- **Empty:** ${spec.states.empty}\n`;
  md += `- **Error:** ${spec.states.error}\n`;
  md += `- **Success:** ${spec.states.success}\n\n`;

  // Accessibility
  md += `## Accessibility\n\n`;
  spec.accessibilityNotes.forEach((note) => {
    md += `- ${note}\n`;
  });
  md += `\n`;

  // Assumptions
  md += `## Assumptions\n\n`;
  if (spec.assumptions && spec.assumptions.length > 0) {
    spec.assumptions.forEach((assump) => {
      md += `- **Assumption:** ${assump}\n`;
    });
  } else {
    md += `- *No unconfirmed assumptions required.*\n`;
  }
  md += `\n`;

  // Open Questions
  md += `## Open Questions\n\n`;
  if (spec.openQuestions && spec.openQuestions.length > 0) {
    spec.openQuestions.forEach((q) => {
      md += `- ${q}\n`;
    });
  } else {
    md += `- *All open questions resolved.*\n`;
  }
  md += `\n`;

  // Version History
  md += `## Version History\n\n`;
  md += `| Version | Date | Changes |\n`;
  md += `|---|---|---|\n`;
  md += `| ${spec.metadata.version} | ${dateStr} | Initial specification generated |\n`;

  return md;
}
