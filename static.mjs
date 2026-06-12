import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "dist");
const PORTS = [3000, 80];
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
};
const handler = (req, res) => {
  const url = req.url === "/" ? "/index.html" : req.url;
  const filePath = path.join(DIST, url);
  const ext = path.extname(filePath);
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Access-Control-Allow-Origin", "*");
  fs.readFile(filePath, (err, data) => {
    if (err) {
      fs.readFile(path.join(DIST, "index.html"), (e2, d2) => {
        if (e2) { res.writeHead(404); res.end("404"); return; }
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(d2);
      });
      return;
    }
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
};
PORTS.forEach(port => {
  http.createServer(handler).listen(port, "::", () => {
    console.log("Server: http://localhost:" + port);
  });
});