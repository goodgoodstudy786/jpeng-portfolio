const fs = require("fs");
const p = "C:/Users/Administrator/Documents/个人网站2.0/jpeng-portfolio/backend/admin/admin.js";
let t = fs.readFileSync(p, "utf-8");

// Fix ALL string literals that have ? instead of closing quote
// Pattern: "...? where ? should be "
// We need to be careful not to break legitimate ? characters
// Fix: replace ? before ); or , or } or ) with "
t = t.replace(/\u003f\s*\)\s*;/g, "\");");
t = t.replace(/\u003f\s*,\s*/g, '", ');
t = t.replace(/\u003f\s*\}\s*\)/g, '"} )');
t = t.replace(/\u003f\s*\}/g, '"}');
t = t.replace(/\u003f\s*\)/g, '")');

// Also handle the specific case: "鏂拌彍鍗?, href: 
// The garbled 鏂拌彍鍗? should be "新菜单"
t = t.replace(/鏂拌彍鍗?/g, "新菜单");

// Remove the fix_all.cjs and inspect.cjs
fs.writeFileSync(p, t, "utf-8");
console.log("All fixes applied");

// Verify
const { execSync } = require("child_process");
try {
  execSync("node --check \"" + p + "\"", { stdio: "pipe" });
  console.log("Syntax check PASSED");
} catch(e) {
  console.log("Syntax FAILED:", e.stderr.toString().substring(0, 500));
}
