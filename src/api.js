const API_BASE = ""

async function api(path, opts = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { "Content-Type": "application/json", ...opts.headers },
    ...opts,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function fetchAllData() {
  return api("/api/data")
}

export async function fetchProjects() {
  return api("/api/projects")
}

export async function fetchStrengths() {
  return api("/api/strengths")
}

export async function fetchInspirations() {
  return api("/api/inspirations")
}
