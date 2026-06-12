const API = "";
let data = {};
let token = localStorage.getItem("jpeng-cms-token") || "";
function setToken(t) { token = t; localStorage.setItem("jpeng-cms-token", t); }
function clearToken() { token = ""; localStorage.removeItem("jpeng-cms-token"); }

async function checkAuth() {
  if (!token) return false;
  try {
    const r = await fetch("/api/check-auth", { headers: { Authorization: "Bearer " + token } });
    if (r.ok) { const d = await r.json(); return d.authenticated; }
  } catch(e) {}
  return false;
}

document.addEventListener("DOMContentLoaded", async function() {
  const a = await checkAuth();
  if (a) { document.getElementById("loginOverlay").classList.add("hidden"); await loadData(); renderSite(); }
});
// ── Password toggle ──
document.addEventListener("DOMContentLoaded", function() {
  const toggleBtn = document.getElementById("pwdToggle");
  const pwdInput = document.getElementById("login-pass");
  if (toggleBtn && pwdInput) {
    toggleBtn.addEventListener("click", function() {
      const type = pwdInput.getAttribute("type") === "password" ? "text" : "password";
      pwdInput.setAttribute("type", type);
      toggleBtn.textContent = type === "password" ? "👁" : "👁‍🗨";
    });
  }
});

function doLogin() {
  const u = document.getElementById("login-user").value;
  const p = document.getElementById("login-pass").value;
  document.getElementById("loginError").classList.remove("show");
  fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: u, password: p })
  }).then(function(r) {
    if (!r.ok) { document.getElementById("loginError").classList.add("show"); return null; }
    return r.json();
  }).then(function(d) {
    if (!d) return;
    setToken(d.token);
    document.getElementById("loginOverlay").classList.add("hidden");
    loadData().then(function() { renderSite(); });
  }).catch(function() { document.getElementById("loginError").classList.add("show"); });
}

document.getElementById("loginBtn").addEventListener("click", doLogin);
document.getElementById("login-pass").addEventListener("keydown", function(e) {
  if (e.key === "Enter") doLogin();
});

function doLogout() { clearToken(); document.getElementById("loginOverlay").classList.remove("hidden"); }
function toast(m) { const e = document.getElementById("toast"); e.textContent = m; e.classList.add("show"); setTimeout(function() { e.classList.remove("show"); }, 2000); }

async function fetchAPI(url, o) {
  o = o || {}; o.headers = o.headers || {}; o.headers["Content-Type"] = "application/json";
  if (token) o.headers["Authorization"] = "Bearer " + token;
  const r = await fetch(url, o); if (!r.ok) throw new Error(await r.text()); return r.json();
}

async function loadData() { data = await fetchAPI("/api/data"); }

function openModal(h) { document.getElementById("modal-content").innerHTML = h; document.getElementById("modal").classList.add("open"); }
function closeModal() { document.getElementById("modal").classList.remove("open"); }
document.getElementById("modal").addEventListener("click", function(e) { if (e.target === e.currentTarget) closeModal(); });

var sections = { site: renderSite, nav: renderNav, hero: renderHero, projects: renderProjects, strengths: renderStrengths, inspirations: renderInspirations, contact: renderContact };

function esc(s) { if (!s) return ""; return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

// 鈹€鈹€ Site 鈹€鈹€
function renderSite() {
  document.getElementById("section-title").textContent = "缃戠珯璁剧疆";
  document.getElementById("content").innerHTML = '<div class="row"><div class="form-group"><label>Logo 鏂囧瓧</label><input id="site-logo" value="' + esc(data.site.logo) + '" /></div><div class="form-group"><label>搴曢儴鐗堟潈鏂囧瓧</label><input id="site-footer" value="' + esc(data.site.footer) + '" /></div></div><button class="btn" onclick="saveSite()">淇濆瓨璁剧疆</button><button class="btn btn-danger" style="margin-left:10px" onclick="doLogout()">閫€鍑虹櫥褰?/button>';
}
async function saveSite() { await fetchAPI("/api/site", { method: "PUT", body: JSON.stringify({ logo: document.getElementById("site-logo").value, footer: document.getElementById("site-footer").value }) }); toast("宸蹭繚瀛?); }

// 鈹€鈹€ Nav 鈹€鈹€
function renderNav() {
  document.getElementById("section-title").textContent = "瀵艰埅鑿滃崟";
  var h = '<div class="card-list">';
  data.nav.forEach(function(item, i) { h += '<div class="card-item"><div class="info"><h4>' + esc(item.label) + '</h4><p>' + esc(item.href) + '</p></div><div class="actions"><button class="btn btn-sm btn-outline" onclick="editNav(' + i + ')">缂栬緫</button></div></div>'; });
  h += '</div><button class="btn" style="margin-top:12px" onclick="addNav()">+ 娣诲姞瀵艰埅</button><button class="btn" style="margin-top:12px;margin-left:10px" onclick="saveNavData()">淇濆瓨瀵艰埅</button>';
  document.getElementById("content").innerHTML = h;
}
function editNav(i) { var item = data.nav[i]; openModal('<h3>缂栬緫瀵艰埅</h3><div class="form-group"><label>鍚嶇О</label><input id="edit-nav-label" value="' + esc(item.label) + '" /></div><div class="form-group"><label>閾炬帴</label><input id="edit-nav-href" value="' + esc(item.href) + '" /></div><div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">鍙栨秷</button><button class="btn" onclick="saveNav(' + i + ')">淇濆瓨</button></div>'); }
function saveNav(i) { data.nav[i] = { label: document.getElementById("edit-nav-label").value, href: document.getElementById("edit-nav-href").value }; closeModal(); renderNav(); }
function addNav() { data.nav.push({ label: "鏂拌彍鍗?, href: "/#new" }); renderNav(); }
async function saveNavData() { await fetchAPI("/api/nav", { method: "PUT", body: JSON.stringify(data.nav) }); toast("瀵艰埅宸蹭繚瀛?); }

// 鈹€鈹€ Hero 鈹€鈹€
function renderHero() {
  document.getElementById("section-title").textContent = "Banner 璁剧疆";
  var h = data.hero;
  document.getElementById("content").innerHTML = '<div class="row"><div class="form-group"><label>鏍囪锛堣嫳鏂囷級</label><input id="hero-tagline" value="' + esc(h.tagline) + '" /></div><div class="form-group"><label>鍓爣棰橈紙涓枃锛?/label><input id="hero-subtitle" value="' + esc(h.subtitle) + '" /></div></div><div class="row"><div class="form-group"><label>涓绘寜閽枃瀛?/label><input id="hero-btn-primary" value="' + esc(h.btnPrimary) + '" /></div><div class="form-group"><label>娆℃寜閽枃瀛?/label><input id="hero-btn-secondary" value="' + esc(h.btnSecondary) + '" /></div></div><div class="row"><div class="form-group"><label>鍩庡競锛圔ased in锛?/label><input id="hero-basedin" value="' + esc(h.basedIn) + '" /></div></div><button class="btn" onclick="saveHero()">淇濆瓨璁剧疆</button>';
}
async function saveHero() { await fetchAPI("/api/hero", { method: "PUT", body: JSON.stringify({ tagline: document.getElementById("hero-tagline").value, subtitle: document.getElementById("hero-subtitle").value, btnPrimary: document.getElementById("hero-btn-primary").value, btnSecondary: document.getElementById("hero-btn-secondary").value, basedIn: document.getElementById("hero-basedin").value }) }); toast("Banner 宸蹭繚瀛?); }

// 鈹€鈹€ Projects 鈹€鈹€
function renderProjects() {
  document.getElementById("section-title").textContent = "绮鹃€変綔鍝?;
  var h = '<div class="card-list">';
  data.projects.forEach(function(p) {
    h += '<div class="card-item"><div class="info"><h4>' + esc(p.title) + '</h4><p>' + esc(p.subtitle || "") + " " + (p.tags || []).join(", ") + '</p></div><div class="actions"><button class="btn btn-sm btn-outline" onclick="editProject(\'' + p.id + '\')">缂栬緫</button><button class="btn btn-sm btn-danger" onclick="deleteProject(\'' + p.id + '\')">鍒犻櫎</button></div></div>';
  });
  h += '</div><button class="btn" style="margin-top:16px" onclick="addProject()">+ 娣诲姞浣滃搧</button>';
  document.getElementById("content").innerHTML = h;
}

function editProject(id) {
  var p = data.projects.find(function(x) { return x.id === id; });
  if (!p) return;
  openModal(
    '<h3>缂栬緫浣滃搧</h3>' +
    '<div class="row"><div class="form-group"><label>鏍囬</label><input id="ep-title" value="' + esc(p.title) + '" /></div><div class="form-group"><label>鑻辨枃鍓爣棰?/label><input id="ep-subtitle" value="' + esc(p.subtitle || "") + '" /></div></div>' +
    '<div class="row"><div class="form-group"><label>骞翠唤</label><input id="ep-year" value="' + esc(p.year || "") + '" /></div><div class="form-group"><label>瑙掕壊</label><input id="ep-role" value="' + esc(p.role || "") + '" /></div></div>' +
    '<div class="form-group"><label>鏍囩锛堥€楀彿鍒嗛殧锛?/label><input id="ep-tags" value="' + esc((p.tags || []).join(", ")) + '" /></div>' +
    '<div class="form-group"><label>姒傝堪</label><textarea id="ep-overview">' + esc(p.overview || "") + '</textarea></div>' +
    '<div class="form-group"><label>绔犺妭锛圝SON鏍煎紡锛?/label><textarea id="ep-sections" style="min-height:100px">' + esc(JSON.stringify(p.sections || [], null, 2)) + '</textarea></div>' +
    '<div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">鍙栨秷</button><button class="btn" onclick="saveProject(\'' + id + '\')">淇濆瓨</button></div>'
  );
}

async function saveProject(id) {
  var idx = data.projects.findIndex(function(x) { return x.id === id; });
  if (idx === -1) return;
  var sections = [];
  try { sections = JSON.parse(document.getElementById("ep-sections").value); } catch(e) {}
  data.projects[idx] = {
    ...data.projects[idx],
    title: document.getElementById("ep-title").value,
    subtitle: document.getElementById("ep-subtitle").value,
    year: document.getElementById("ep-year").value,
    role: document.getElementById("ep-role").value,
    tags: document.getElementById("ep-tags").value.split(",").map(function(t) { return t.trim(); }).filter(function(t) { return t; }),
    overview: document.getElementById("ep-overview").value,
    sections: sections,
  };
  await fetchAPI("/api/projects/" + id, { method: "PUT", body: JSON.stringify(data.projects[idx]) });
  closeModal();
  renderProjects();
  toast("宸叉洿鏂?);
}

async function deleteProject(id) {
  if (!confirm("纭畾鍒犻櫎锛?)) return;
  await fetchAPI("/api/projects/" + id, { method: "DELETE" });
  data.projects = data.projects.filter(function(p) { return p.id !== id; });
  renderProjects();
  toast("宸插垹闄?);
}

function addProject() {
  var id = crypto.randomUUID();
  data.projects.push({ id: id, title: "鏂颁綔鍝?, subtitle: "New Project", year: "2026", tags: [], sections: [] });
  renderProjects();
}

// 鈹€鈹€ Strengths 鈹€鈹€
function renderStrengths() {
  document.getElementById("section-title").textContent = "涓汉浼樺娍";
  var h = '<div class="card-list">';
  data.strengths.forEach(function(s) {
    h += '<div class="card-item"><div class="info"><h4>' + esc(s.title) + '</h4><p>' + esc(s.titleCN) + " " + esc(s.desc) + '</p></div><div class="actions"><button class="btn btn-sm btn-outline" onclick="editStrength(\'' + s.id + '\')">缂栬緫</button><button class="btn btn-sm btn-danger" onclick="deleteStrength(\'' + s.id + '\')">鍒犻櫎</button></div></div>';
  });
  h += '</div><button class="btn" style="margin-top:16px" onclick="addStrength()">+ 娣诲姞浼樺娍</button>';
  document.getElementById("content").innerHTML = h;
}

function editStrength(id) {
  var s = data.strengths.find(function(x) { return x.id === id; });
  if (!s) return;
  openModal(
    '<h3>缂栬緫浼樺娍</h3>' +
    '<div class="row"><div class="form-group"><label>缂栧彿</label><input id="es-num" value="' + esc(s.num) + '" /></div><div class="form-group"><label>鑻辨枃鏍囬</label><input id="es-title" value="' + esc(s.title) + '" /></div></div>' +
    '<div class="row"><div class="form-group"><label>涓枃鏍囬</label><input id="es-titlecn" value="' + esc(s.titleCN) + '" /></div><div class="form-group"><label>鏍囩锛堥€楀彿鍒嗛殧锛?/label><input id="es-tags" value="' + esc((s.tags || []).join(", ")) + '" /></div></div>' +
    '<div class="form-group"><label>鎻忚堪</label><textarea id="es-desc">' + esc(s.desc) + '</textarea></div>' +
    '<div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">鍙栨秷</button><button class="btn" onclick="saveStrength(\'' + id + '\')">淇濆瓨</button></div>'
  );
}

async function saveStrength(id) {
  var idx = data.strengths.findIndex(function(x) { return x.id === id; });
  if (idx === -1) return;
  data.strengths[idx] = {
    ...data.strengths[idx],
    num: document.getElementById("es-num").value,
    title: document.getElementById("es-title").value,
    titleCN: document.getElementById("es-titlecn").value,
    desc: document.getElementById("es-desc").value,
    tags: document.getElementById("es-tags").value.split(",").map(function(t) { return t.trim(); }).filter(function(t) { return t; }),
  };
  await fetchAPI("/api/strengths/" + id, { method: "PUT", body: JSON.stringify(data.strengths[idx]) });
  closeModal();
  renderStrengths();
  toast("宸叉洿鏂?);
}

async function deleteStrength(id) {
  if (!confirm("纭畾鍒犻櫎锛?)) return;
  await fetchAPI("/api/strengths/" + id, { method: "DELETE" });
  data.strengths = data.strengths.filter(function(s) { return s.id !== id; });
  renderStrengths();
  toast("宸插垹闄?);
}

function addStrength() {
  var id = crypto.randomUUID();
  data.strengths.push({ id: id, num: "05", title: "New", titleCN: "鏂颁紭鍔?, desc: "鎻忚堪", tags: [] });
  renderStrengths();
}

// 鈹€鈹€ Inspirations 鈹€鈹€
function renderInspirations() {
  document.getElementById("section-title").textContent = "鐏垫劅鏀惰棌";
  var h = '<div class="card-list">';
  data.inspirations.forEach(function(item) {
    h += '<div class="card-item"><div class="info"><h4>' + esc(item.title) + '</h4><p>' + esc(item.category) + " " + esc(item.subtitle || "") + '</p></div><div class="actions"><button class="btn btn-sm btn-outline" onclick="editInspiration(\'' + item.id + '\')">缂栬緫</button><button class="btn btn-sm btn-danger" onclick="deleteInspiration(\'' + item.id + '\')">鍒犻櫎</button></div></div>';
  });
  h += '</div><button class="btn" style="margin-top:16px" onclick="addInspiration()">+ 娣诲姞鐏垫劅</button>';
  document.getElementById("content").innerHTML = h;
}

function editInspiration(id) {
  var item = data.inspirations.find(function(x) { return x.id === id; });
  if (!item) return;
  openModal(
    '<h3>缂栬緫鐏垫劅</h3>' +
    '<div class="row"><div class="form-group"><label>鏍囬</label><input id="ei-title" value="' + esc(item.title) + '" /></div><div class="form-group"><label>鑻辨枃鍓爣棰?/label><input id="ei-subtitle" value="' + esc(item.subtitle || "") + '" /></div></div>' +
    '<div class="row"><div class="form-group"><label>鍒嗙被</label><input id="ei-category" value="' + esc(item.category) + '" /></div><div class="form-group"><label>鏉ユ簮閾炬帴</label><input id="ei-link" value="' + esc(item.link || "") + '" /></div></div>' +
    '<div class="form-group"><label>姝ｆ枃鍐呭</label><textarea id="ei-content" style="min-height:150px">' + esc(item.content || "") + '</textarea></div>' +
    '<div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">鍙栨秷</button><button class="btn" onclick="saveInspiration(\'' + id + '\')">淇濆瓨</button></div>'
  );
}

async function saveInspiration(id) {
  var idx = data.inspirations.findIndex(function(x) { return x.id === id; });
  if (idx === -1) return;
  data.inspirations[idx] = {
    ...data.inspirations[idx],
    title: document.getElementById("ei-title").value,
    subtitle: document.getElementById("ei-subtitle").value,
    category: document.getElementById("ei-category").value,
    link: document.getElementById("ei-link").value,
    content: document.getElementById("ei-content").value,
  };
  await fetchAPI("/api/inspirations/" + id, { method: "PUT", body: JSON.stringify(data.inspirations[idx]) });
  closeModal();
  renderInspirations();
  toast("宸叉洿鏂?);
}

async function deleteInspiration(id) {
  if (!confirm("纭畾鍒犻櫎锛?)) return;
  await fetchAPI("/api/inspirations/" + id, { method: "DELETE" });
  data.inspirations = data.inspirations.filter(function(i) { return i.id !== id; });
  renderInspirations();
  toast("宸插垹闄?);
}

function addInspiration() {
  var id = crypto.randomUUID();
  data.inspirations.push({ id: id, title: "鏂扮伒鎰?, subtitle: "New Idea", category: "璁捐", content: "" });
  renderInspirations();
}

// 鈹€鈹€ Contact 鈹€鈹€
function renderContact() {
  document.getElementById("section-title").textContent = "鑱旂郴鏂瑰紡";
  var c = data.contact;
  document.getElementById("content").innerHTML =
    '<div class="row"><div class="form-group"><label>Email</label><input id="c-email" value="' + esc(c.email) + '" /></div><div class="form-group"><label>寰俊</label><input id="c-wechat" value="' + esc(c.wechat) + '" /></div></div>' +
    '<div class="row"><div class="form-group"><label>鐢佃瘽</label><input id="c-phone" value="' + esc(c.phone) + '" /></div><div class="form-group"><label>鏍囬</label><input id="c-headline" value="' + esc(c.headline) + '" /></div></div>' +
    '<div class="form-group"><label>鎻忚堪鏂囧瓧</label><textarea id="c-blurb">' + esc(c.blurb) + '</textarea></div>' +
    '<button class="btn" onclick="saveContact()">淇濆瓨璁剧疆</button>';
}
async function saveContact() { await fetchAPI("/api/contact", { method: "PUT", body: JSON.stringify({ email: document.getElementById("c-email").value, wechat: document.getElementById("c-wechat").value, phone: document.getElementById("c-phone").value, headline: document.getElementById("c-headline").value, blurb: document.getElementById("c-blurb").value }) }); toast("鑱旂郴鏂瑰紡宸叉洿鏂?); }

// 鈹€鈹€ Sidebar nav 鈹€鈹€
document.querySelectorAll(".sidebar a").forEach(function(a) {
  a.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelectorAll(".sidebar a").forEach(function(x) { x.classList.remove("active"); });
    a.classList.add("active");
    var s = a.dataset.section;
    if (sections[s]) sections[s]();
  });
});
