const fs = require("fs");
const p = "C:/Users/Administrator/Documents/个人网站2.0/jpeng-portfolio/backend/admin/admin.js";
let t = fs.readFileSync(p, "utf-8");

// Find all broken Chinese string literals - pattern: "...? where ? should be closing "
// Strategy: find all "..." patterns where the closing " got replaced by ?
// A simple heuristic: find lines with Chinese chars that have unbalanced quotes
const lines = t.split("\n");
let fixed = [];
let fixCount = 0;
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  // Check if line has Chinese chars and ? that might be a broken quote
  // Only fix if the ? is NOT part of a ternary operator
  if (/[\u4e00-\u9fff]/.test(line) && line.includes("?")) {
    // Count quotes - if odd, there might be a broken closing quote
    let quoteCount = 0;
    for (let j = 0; j < line.length; j++) {
      if (line[j] === "\"" && (j === 0 || line[j-1] !== "\\")) {
        // Skip escaped quotes in strings
        quoteCount++;
      }
    }
    // If odd number of quotes, the last one is the broken ?
    if (quoteCount % 2 !== 0) {
      // Find the last ? that should be a closing quote
      const lastQ = line.lastIndexOf("?");
      if (lastQ >= 0) {
        // Check if this ? appears to be a closing quote
        // It should be followed by ), ;, }, or , and no other " after it
        const after = line.substring(lastQ + 1);
        const restQuoteCount = (after.match(/"/g) || []).length;
        if (restQuoteCount === 0 || (restQuoteCount % 2 !== 0 && /^[\s\);,\}]+$/.test(after.replace(/"/g, "")))) {
          line = line.substring(0, lastQ) + "\"" + after;
          fixCount++;
        }
      }
    }
  }
  fixed.push(line);
}
t = fixed.join("\n");

// Also fix specific known garbled strings
t = t.replace(/绮鹃€変綔鍝?/g, "精选作品");
t = t.replace(/鏂拌彍鍗?/g, "新菜单");

fs.writeFileSync(p, t, "utf-8");
console.log("Fixed", fixCount, "broken quotes");

// Verify syntax
const { execSync } = require("child_process");
try {
  execSync("node --check \"" + p + "\"", { stdio: "pipe" });
  console.log("Syntax check PASSED");
} catch(e) {
  const err = e.stderr.toString();
  console.log("Syntax FAILED:", err.substring(0, 400));
}
