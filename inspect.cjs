const fs = require("fs");
const p = "C:/Users/Administrator/Documents/个人网站2.0/jpeng-portfolio/backend/admin/admin.js";
const b = fs.readFileSync(p);
const t = b.toString("utf-8");
// Find all toast calls
let pos = 0;
while ((pos = t.indexOf("toast(", pos)) >= 0) {
  const ctx = t.substring(pos, pos + 30);
  console.log("Found toast at", pos, ":", JSON.stringify(ctx));
  pos++;
}
