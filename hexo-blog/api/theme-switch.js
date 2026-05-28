const yaml = require("js-yaml");

const REPO = process.env.GITHUB_REPO?.trim() || "xisheepsheep/my-personal-blog";
const BRANCH = process.env.GITHUB_BRANCH?.trim() || "main";
const HEXO_ROOT = "hexo-blog";
const OFFICIAL_THEME_API = "https://api.github.com/repos/hexojs/site/contents/source/_data/themes";
const OFFICIAL_RAW_BASE = "https://raw.githubusercontent.com/hexojs/site/master/source/_data/themes";

let themeCache = null;
let themeCacheAt = 0;
const CACHE_TTL = 1000 * 60 * 30;

const fallbackThemes = [
  {
    id: "fluid",
    name: "Fluid",
    description: "现代、简洁、中文文档完整，适合技术博客和个人写作。",
    link: "https://github.com/fluid-dev/hexo-theme-fluid",
    preview: "https://hexo.fluid-dev.com/",
    tags: ["responsive", "dark"],
  },
  {
    id: "butterfly",
    name: "Butterfly",
    description: "功能丰富、视觉更活泼，适合想要更多组件和动效的博客。",
    link: "https://github.com/jerryc127/hexo-theme-butterfly",
    preview: "https://butterfly.js.org/",
    tags: ["responsive", "dark"],
  },
  {
    id: "next",
    name: "NexT",
    description: "经典稳定的技术博客主题，排版克制，配置项丰富。",
    link: "https://github.com/next-theme/hexo-theme-next",
    preview: "https://theme-next.js.org/",
    tags: ["classic"],
  },
];

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

async function github(path, options = {}) {
  const token = process.env.GITHUB_TOKEN?.trim();
  if (!token) throw new Error("GITHUB_TOKEN is not configured.");
  const response = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    ...options,
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${token}`,
      "x-github-api-version": "2022-11-28",
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(data?.message || `GitHub request failed: ${response.status}`);
  return data;
}

async function githubPublic(url, options = {}) {
  const token = process.env.GITHUB_TOKEN?.trim();
  const response = await fetch(url, {
    ...options,
    headers: {
      accept: "application/vnd.github+json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!response.ok) throw new Error(`Failed to fetch official Hexo themes: ${response.status}`);
  return response;
}

function decode(content) {
  return Buffer.from(content, "base64").toString("utf8");
}

function encode(content) {
  return Buffer.from(content, "utf8").toString("base64");
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/^hexo-theme-/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeGithubUrl(link) {
  if (!link || !/^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/.test(link)) return null;
  return `${link.replace(/\/$/, "")}.git`;
}

function normalizeTheme(raw, fallbackName) {
  const name = raw.name || fallbackName;
  const link = raw.link || raw.repo || raw.repository || "";
  const repoName = link ? link.replace(/\/$/, "").split("/").pop() : "";
  const theme = slugify(repoName || name);
  return {
    id: slugify(name || repoName),
    name,
    description: raw.description || raw.desc || "Hexo 官方主题市场收录的主题。",
    link,
    preview: raw.preview || raw.demo || raw.screenshot || link,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    theme,
    git: normalizeGithubUrl(link),
    applyable: Boolean(normalizeGithubUrl(link)),
  };
}

async function fetchOfficialThemes() {
  if (themeCache && Date.now() - themeCacheAt < CACHE_TTL) return themeCache;

  try {
    const listResponse = await githubPublic(OFFICIAL_THEME_API);
    const files = (await listResponse.json()).filter((item) => item.name.endsWith(".yml") || item.name.endsWith(".yaml"));
    const themes = await Promise.all(
      files.map(async (file) => {
        const rawResponse = await githubPublic(`${OFFICIAL_RAW_BASE}/${file.name}`, { headers: { accept: "text/plain" } });
        const rawText = await rawResponse.text();
        const parsed = yaml.load(rawText) || {};
        return normalizeTheme(parsed, file.name.replace(/\.(ya?ml)$/i, ""));
      }),
    );
    themeCache = themes.sort((a, b) => a.name.localeCompare(b.name));
    themeCacheAt = Date.now();
    return themeCache;
  } catch {
    themeCache = fallbackThemes.map((theme) => normalizeTheme(theme, theme.name));
    themeCacheAt = Date.now();
    return themeCache;
  }
}

async function getFile(path) {
  try {
    const file = await github(`/contents/${path}?ref=${BRANCH}`);
    return { sha: file.sha, content: decode(file.content) };
  } catch (error) {
    if (String(error.message).includes("Not Found")) return null;
    throw error;
  }
}

async function putFile(path, content, message, sha) {
  return github(`/contents/${path}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      branch: BRANCH,
      message,
      content: encode(content),
      ...(sha ? { sha } : {}),
    }),
  });
}

async function putFileIfChanged(path, content, message) {
  const file = await getFile(path);
  if (file && file.content === content) return { changed: false, sha: file.sha };
  const result = await putFile(path, content, message, file?.sha);
  return { changed: true, sha: result.commit?.sha };
}

async function getBranchSha() {
  const branch = await github(`/branches/${BRANCH}`);
  return branch.commit?.sha;
}

async function commitFiles(files, message) {
  const parentSha = await getBranchSha();
  const tree = await github("/git/trees", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      base_tree: parentSha,
      tree: files.map((file) => ({
        path: file.path,
        mode: "100644",
        type: "blob",
        content: file.content,
      })),
    }),
  });
  const commit = await github("/git/commits", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      message,
      tree: tree.sha,
      parents: [parentSha],
    }),
  });
  await github(`/git/refs/heads/${BRANCH}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      sha: commit.sha,
      force: false,
    }),
  });
  return commit.sha;
}

async function getCurrentTheme() {
  const configFile = await getFile(`${HEXO_ROOT}/_config.yml`);
  const themeMatch = configFile?.content.match(/^theme:\s*(.+)$/m);
  const sourceFile = await getFile(`${HEXO_ROOT}/theme-source.json`);
  let source = null;
  try {
    source = sourceFile ? JSON.parse(sourceFile.content) : null;
  } catch {
    source = null;
  }
  return {
    theme: themeMatch?.[1]?.trim() || "",
    name: source?.name || themeMatch?.[1]?.trim() || "",
    git: source?.git || "",
  };
}

function updateSiteConfig(source, themeValue) {
  if (/^theme:\s*.+$/m.test(source)) return source.replace(/^theme:\s*.+$/m, `theme: ${themeValue}`);
  return `${source.trimEnd()}\n\ntheme: ${themeValue}\n`;
}

async function triggerDeployment() {
  await github("/actions/workflows/deploy-hexo.yml/dispatches", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ref: BRANCH }),
  });
  return {
    ok: true,
    provider: "github-actions",
    workflow: "deploy-hexo.yml",
    url: `https://github.com/${REPO}/actions/workflows/deploy-hexo.yml`,
  };
}

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    const themes = await fetchOfficialThemes();
    const current = await getCurrentTheme();
    return json(res, 200, {
      count: themes.length,
      source: "hexojs/site",
      current,
      themes,
    });
  }

  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed." });

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");

  const adminPassword = process.env.THEME_ADMIN_PASSWORD?.trim();
  if (!adminPassword || body.password !== adminPassword) {
    return json(res, 401, { error: "管理员密码不正确。" });
  }

  const themes = await fetchOfficialThemes();
  const theme = themes.find((item) => item.id === body.theme || item.theme === body.theme);
  if (!theme) return json(res, 400, { error: "未知模板。" });
  if (!theme.applyable) return json(res, 400, { error: "这个主题没有可自动安装的 GitHub 地址。" });

  try {
    const configPath = `${HEXO_ROOT}/_config.yml`;
    const configFile = await getFile(configPath);
    const sourcePath = `${HEXO_ROOT}/theme-source.json`;
    const configContent = updateSiteConfig(configFile.content, theme.theme);
    const sourceContent = `${JSON.stringify({ theme: theme.theme, git: theme.git, name: theme.name }, null, 2)}\n`;
    const sourceFile = await getFile(sourcePath);
    const changed = configFile.content !== configContent || sourceFile?.content !== sourceContent;
    const sha = changed
      ? await commitFiles(
          [
            { path: configPath, content: configContent },
            { path: sourcePath, content: sourceContent },
          ],
          `Switch Hexo theme to ${theme.name}`,
        )
      : await getBranchSha();
    const deployment = await triggerDeployment();
    return json(res, 200, { ok: true, theme: theme.name, commit: sha, deployment });
  } catch (error) {
    return json(res, 500, { error: error.message || "切换失败。" });
  }
};
