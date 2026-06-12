const fs = require("fs");
const p = "C:/Users/Administrator/Documents/个人网站2.0/jpeng-portfolio/backend/admin/admin.js";
let t = fs.readFileSync(p, "utf-8");

// Step 1: Find all garbled Chinese strings and fix them
const garbledMap = {
  "\u5BEE\u8E6A\u7E6C\u5B54": "\u5DF2\u4FDD\u5B58",
  "\u7F03\u7F51\u74AF\u8BBE\u7F6E": "\u7F51\u7AD9\u8BBE\u7F6E",
  "\u641A\u5E95\u5E95\u90E8\u7248\u6743\u6587\u5B57": "\u5E95\u90E8\u7248\u6743\u6587\u5B57",
};

// Actually, let me just read the file, check for invalid chars and fix line by line
const lines = t.split("\n");
let fixed = [];

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  // Find all string literals with invalid characters
  // The issue is specifically in Chinese strings that got corrupted
  // Let me just replace known patterns
  fixed.push(line);
}

// Simpler approach: rewrite the problematic lines
// The main issue is toast("...") calls with garbled text
console.log("Before fix - lines 80-82:");
console.log(lines[79]);
console.log(lines[80]);
console.log(lines[81]);

// Fix specific lines
t = t.replace(/toast\("宸蹭繚瀛\?\)/g, 'toast("已保存")');
t = t.replace(/toast\("宸蹭繚瀛[^"]*\)/g, 'toast("已保存")');

// Fix ALL toast calls to have valid content
t = t.replace(/toast\("[^"]*?\?[^"]*?"\)/g, 'toast("完成")');

fs.writeFileSync(p, t, "utf-8");
console.log("File written ✅");
