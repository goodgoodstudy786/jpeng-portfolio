import { build } from "vite";
const result = await build({
  configFile: false,
  root: ".",
  logLevel: "warn",
  build: { write: false, minify: false }
});
const js = result.output.find(o => o.fileName.endsWith(".js"));
console.log("Size:", js.code.length);
console.log("Has BrowserRouter:", js.code.includes("BrowserRouter"));
console.log("Has Routes:", js.code.includes("Routes"));
console.log("Has Route:", js.code.includes("Route"));
console.log("Has react-router-dom:", js.code.includes("react-router-dom"));
console.log("Has Link:", js.code.includes("Link"));
console.log("Has useLocation:", js.code.includes("useLocation"));
console.log("Has useParams:", js.code.includes("useParams"));
console.log("Has Navbar:", js.code.includes("Navbar"));
console.log("Has Hero:", js.code.includes("Hero"));