import fs from "fs";
let content = fs.readFileSync("tests/src/grade-triggers.test.ts", "utf8");

content = content.replace(
  /kind: track\\nid: prj-0001:sch-track-test\\ntasks:\\n  - local_id: my-recipe\\n    phase_id: recipe-consolidate\\n  - local_id: doc-a\\n    phase_id: review\\n  - local_id: doc-b\\n    phase_id: review\\n/,
  `kind: track\\nid: prj-0001:sch-track-test\\ntrack: test\\ntasks:\\n  - local_id: my-recipe\\n    phase_id: recipe-consolidate\\n    phase_suffix: "10"\\n  - local_id: doc-a\\n    phase_id: review\\n    phase_suffix: "20"\\n  - local_id: doc-b\\n    phase_id: review\\n    phase_suffix: "30"\\n`,
);
fs.writeFileSync("tests/src/grade-triggers.test.ts", content);
