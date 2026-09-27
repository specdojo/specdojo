const fs = require("fs");
const file = process.argv[2];
const content = fs.readFileSync(file, "utf8");
const match = content.match(/"documentCount":(\d+)/);
if (match) {
  console.log("documentCount:", match[1]);
} else {
  console.log("Not found. Let's see the start of the file:");
  console.log(content.substring(0, 500));
}
