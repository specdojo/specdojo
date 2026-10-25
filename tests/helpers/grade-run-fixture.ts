import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { dump } from "js-yaml";
import type { ReviewViewpointsDoc } from "../../src/review/types.js";

export const GRADE_RUN_MARKERS =
  "[VIEWPOINT vp-content]\nLEVEL: 4\nContent verified.\n[END VIEWPOINT]\n";
export const GRADE_RUN_DOCUMENT = "docs/ja/specdojo/rulebooks/example-rulebook.md";

export function writeGradeRunFixture(root: string): void {
  const write = (path: string, text: string): void => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text, "utf8");
  };
  write(
    ".specdojo/specdojo.config.json",
    JSON.stringify({
      version: 1,
      current_project: "test",
      projects: {
        test: {
          schedule_path: "schedule",
          execution_path: "execution",
          viewpoints_path: "viewpoints.yaml",
          catalog_path: "catalog",
        },
      },
    }),
  );
  write(
    ".specdojo/agent-members.yaml",
    dump({
      version: 1,
      members: [
        {
          nickname: "actual-grader",
          display_name: "Test grader",
          roles: ["QE"],
          type: "agent",
          provider: "custom",
          capabilities: [],
          proficiency: "expert",
          priority: 1,
          mode: "review",
          stage_role: "executor",
          command: "node fake-agent.cjs",
        },
      ],
      aliases: [{ nickname: "grader-alias", alias_of: "actual-grader" }],
    }),
  );
  const viewpoints: ReviewViewpointsDoc = {
    id: "test:pm-review-viewpoints",
    type: "project",
    status: "draft",
    grade_rubric: {
      id: "grade-rubric-v1",
      pass_score: 70,
      levels: [0, 1, 2, 3, 4].map((level) => ({
        level,
        name: `L${level}`,
        description: `Level ${level}`,
        review_verdict:
          level === 4 ? "complete" : level === 3 ? "complete-with-findings" : "incomplete",
      })),
      weights: { kata: { quality: 100 }, deliverable: { quality: 100 } },
    },
    viewpoints: [
      {
        id: "vp-content",
        role: "QE",
        category: "quality",
        title: "Content",
        check: "Check the content.",
        evidence: "Document text.",
        default_severity: "major",
        evaluation: "referential",
      },
    ],
  };
  write("viewpoints.yaml", dump(viewpoints));
  write(
    GRADE_RUN_DOCUMENT,
    "---\nspecdojo:\n  id: test:example-rulebook\n  type: rulebook\n  status: draft\n  rulebook: none\n---\n\n# Example\n\nContent to grade.\n",
  );
  write(
    "fake-agent.cjs",
    `const fs = require('node:fs'); fs.readFileSync(0, 'utf8'); fs.appendFileSync('agent-calls.txt', 'called\\n'); process.stdout.write(${JSON.stringify(GRADE_RUN_MARKERS)});\n`,
  );
  mkdirSync(join(root, "catalog"), { recursive: true });
}
