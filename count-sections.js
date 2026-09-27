const fs = require("fs");
const file = process.argv[2];
const content = fs.readFileSync(file, "utf8");

// The file looks like: export default {"documentCount":3139,"nextId":3139,"documentIds":{...
// Or it exports a pre-built index.
const match = content.match(/"documentCount":(\d+)/);
if (match) {
  console.log("documentCount:", match[1]);
} else {
  // Try to find the number of objects or keys if it's not pre-built minisearch.
  console.log("Not found. Let's see the start of the file:");
  console.log(content.substring(0, 500));
}
