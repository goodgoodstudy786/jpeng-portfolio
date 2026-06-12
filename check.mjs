import http from "node:http";
const html = await new Promise(r => http.get("http://localhost:3000", res => { let d = ""; res.on("data", c => d += c); res.on("end", () => r(d)) }));
const m = html.match(/src="([^"]+\.js)"/);
if (!m) { console.log("no js link", html.length); process.exit(1) }
const js = await new Promise(r => http.get("http://localhost:3000" + m[1], res => { let j = ""; res.on("data", c => j += c); res.on("end", () => r(j)) }));
console.log("React is not defined:", js.includes("React is not defined"));
console.log("createRoot:", js.includes("createRoot"));
console.log("BrowserRouter:", js.includes("BrowserRouter"));
console.log("onerror:", js.includes("onerror"));
console.log("size:", js.length);