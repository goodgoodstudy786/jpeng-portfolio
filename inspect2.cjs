const fs = require("fs");

// Read the file and find ALL non-ASCII string issues
const p = "C:/Users/Administrator/Documents/个人网站2.0/jpeng-portfolio/backend/admin/admin.js";
let t = fs.readFileSync(p, "utf-8");

// Let me just check the current state after all fixes
const lines = t.split("\n");
console.log("Total lines:", lines.length);
let problemLines = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Check for lines with ? that should be Chinese closing quotes
  if (line.includes("?") && /["'\u201c]\s*[^"]+?\?/.test(line)) {
    problemLines.push({ line: i+1, text: line.substring(0, 100).trim() });
  }
}
console.log("Problematic lines:", problemLines.length);
problemLines.slice(0, 20).forEach(l => console.log("  L" + l.line + ": " + l.text));

// Read the HTML too
const html = fs.readFileSync("C:/Users/Administrator/Documents/个人网站2.0/jpeng-portfolio/backend/admin/index.html", "utf-8");
const htmlLines = html.split("\n");
console.log("\nHTML lines:", htmlLines.length);
let problems = 0;
for (let i = 0; i < htmlLines.length; i++) {
  if (htmlLines[i].includes("?") && /["'].*?\?/.test(htmlLines[i])) {
    problems++;
    if (problems <= 5) {
      console.log("  H" + (i+1) + ": " + htmlLines[i].substring(0, 120).trim());
    }
  }
}
console.log("HTML problems:", problems);
