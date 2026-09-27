import fs from "fs";

let content = fs.readFileSync("tests/src/grade-triggers.test.ts", "utf8");

content = content.replace(
  /mkdirSync\(join\(rootDir, "docs\/ja\/projects\/prj-0001\/catalog"\), \{ recursive: true \}\);/,
  `mkdirSync(join(rootDir, "docs/ja/projects/prj-0001/010-deliverables-catalog"), { recursive: true });`,
);

content = content.replace(
  /writeFileSync\(\n *join\(rootDir, "docs\/ja\/projects\/prj-0001\/catalog\/dct-test.yaml"\),/,
  `writeFileSync(\n      join(rootDir, "docs/ja/projects/prj-0001/010-deliverables-catalog/dct-test.yaml"),`,
);

// To figure out why buildScheduleIndex failed, let's console.log in the test
fs.writeFileSync("tests/src/grade-triggers.test.ts", content);
