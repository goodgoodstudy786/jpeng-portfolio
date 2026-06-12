import http from "node:http";
http.get("http://localhost:3000", r => {
  let d = "";
  r.on("data", c => d += c);
  r.on("end", () => {
    const m = d.match(/src="([^"]+\.js)"/);
    console.log("HTML length:", d.length);
    console.log("JS file:", m ? m[1] : "none");
    console.log("Has fallback content:", d.includes("init-load"));
    if (m) {
      http.get("http://localhost:3000" + m[1], r2 => {
        let j = "";
        r2.on("data", c => j += c);
        r2.on("end", () => {
          console.log("JS length:", j.length);
          console.log("Contains React:", j.includes("jsx") || j.includes("createElement"));
          console.log("Contains Navbar:", j.includes("Navbar"));
          console.log("Contains Hero:", j.includes("Hero"));
        });
      });
    }
  });
});