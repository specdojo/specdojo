const regex = /(^|\/)controls\/project-register\/pjr-[^/]+\.md$/;
console.log(regex.test("controls/project-register/pjr-0007-pjr-index.md")); // true
console.log(regex.test("controls/project-register/generated/pjr-index.md")); // false
const viewsRegex = /(^|\/)controls\/project-register\/generated\/pjr-views-by-[^/]+\.md$/;
console.log(viewsRegex.test("controls/project-register/generated/pjr-views-by-owner.md")); // true
console.log(viewsRegex.test("controls/project-register/generated/pjr-index.md")); // false
