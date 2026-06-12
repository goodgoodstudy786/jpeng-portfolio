const fs = require("fs");
const p = "C:/Users/Administrator/Documents/个人网站2.0/jpeng-portfolio/backend/admin/admin.js";
let t = fs.readFileSync(p, "latin1"); // Read as raw bytes
// Find the broken toast string and fix it
// The broken bytes are: E5 AE AE E8 B1 A1 E7 BB 9C E5 AD 98 3F
// Should be: E5 B7 B2 E4 BF 9D E5 AD 98 22
const broken = Buffer.from([0xE5, 0xAE, 0xAE, 0xE8, 0xB1, 0xA1, 0xE7, 0xBB, 0x9C, 0xE5, 0xAD, 0x98, 0x3F]);
const fixed = Buffer.from([0xE5, 0xB7, 0xB2, 0xE4, 0xBF, 0x9D, 0xE5, 0xAD, 0x98, 0x22]); // 已保存"
t = t.split(broken.toString("latin1")).join(fixed.toString("latin1"));
fs.writeFileSync(p, t, "latin1");
console.log("Fixed with bytes");
