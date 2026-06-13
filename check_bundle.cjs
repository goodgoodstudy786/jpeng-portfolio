const fs = require("fs");
fetch("https://web-production-0f5d7.up.railway.app/")
  .then(r => r.text())
  .then(html => {
    const jsMatch = html.match(/src="([^"]+\.js)"/);
    console.log("Deployed JS:", jsMatch ? jsMatch[1] : "NOT FOUND");
    
    const localHtml = fs.readFileSync("C:/Users/Administrator/Documents/个人网站2.0/jpeng-portfolio/dist/index.html", "utf8");
    const localJsMatch = localHtml.match(/src="([^"]+\.js)"/);
    console.log("Local JS:", localJsMatch ? localJsMatch[1] : "NOT FOUND");
    
    console.log("Match:", jsMatch && localJsMatch && jsMatch[1] === localJsMatch[1] ? "SAME" : "DIFFERENT");
    if (html.includes("charset=UTF-8")) console.log("UTF-8: YES");
    else console.log("UTF-8: NO");
  });
