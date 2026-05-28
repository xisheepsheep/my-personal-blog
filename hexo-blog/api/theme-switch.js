const REPO = process.env.GITHUB_REPO?.trim() || "xisheepsheep/my-personal-blog";
const BRANCH = process.env.GITHUB_BRANCH?.trim() || "main";
const HEXO_ROOT = "hexo-blog";

const themes = [
  {
    id: "fluid",
    name: "Fluid",
    packageName: "hexo-theme-fluid",
    version: "^1.9.9",
    themeValue: "fluid",
    officialUrl: "https://hexo.io/themes/#Fluid",
    previewUrl: "https://hexo.fluid-dev.com/",
    description: "现代、简洁、中文文档完整，适合技术博客和个人写作。",
    configPath: `${HEXO_ROOT}/_config.fluid.yml`,
    configContent: null,
  },
  {
    id: "next",
    name: "NexT",
    packageName: "hexo-theme-next",
    version: "^8.27.0",
    themeValue: "next",
    officialUrl: "https://hexo.io/themes/#NexT",
    previewUrl: "https://theme-next.js.org/",
    description: "经典稳定的技术博客主题，排版克制，配置项丰富。",
    configPath: `${HEXO_ROOT}/_config.next.yml`,
    configContent: "scheme: Muse\nmenu:\n  home: / || fa fa-home\n  archives: /archives/ || fa fa-archive\n  categories: /categories/ || fa fa-th\n  tags: /tags/ || fa fa-tags\n  about: /about/ || fa fa-user\n",
  },
  {
    id: "butterfly",
    name: "Butterfly",
    packageName: "hexo-theme-butterfly",
    version: "^5.5.4",
    themeValue: "butterfly",
    officialUrl: "https://hexo.io/themes/#Butterfly",
    previewUrl: "https://butterfly.js.org/",
    description: "功能丰富、视觉更活泼，适合想要更多组件和动效的博客。",
    configPath: `${HEXO_ROOT}/_config.butterfly.yml`,
    configContent: "menu:\n  首页: / || fas fa-home\n  归档: /archives/ || fas fa-archive\n  分类: /categories/ || fas fa-folder-open\n  标签: /tags/ || fas fa-tags\n  关于: /about/ || fas fa-heart\nhighlight_theme: mac\n",
  },
  {
    id: "icarus",
    name: "Icarus",
    packageName: "hexo-theme-icarus",
    version: "^6.1.1",
    themeValue: "icarus",
    officialUrl: "https://hexo.io/themes/#Icarus",
    previewUrl: "https://ppoffice.github.io/hexo-theme-icarus/",
    description: "卡片式布局，支持侧栏与丰富小组件。",
    configPath: `${HEXO_ROOT}/_config.icarus.yml`,
    configContent: "navbar:\n  menu:\n    Home: /\n    Archives: /archives\n    Categories: /categories\n    Tags: /tags\n    About: /about\n",
  },
  {
    id: "stellar",
    name: "Stellar",
    packageName: "hexo-theme-stellar",
    version: "^1.33.1",
    themeValue: "stellar",
    officialUrl: "https://hexo.io/themes/#Stellar",
    previewUrl: "https://xaoxuu.com/wiki/stellar/",
    description: "适合知识库、项目文档和个人站点的现代主题。",
    configPath: `${HEXO_ROOT}/_config.stellar.yml`,
    configContent: "site_tree:\n  home:\n    leftbar: welcome, recent\n    rightbar: timeline\n",
  },
  {
    id: "yun",
    name: "Yun",
    packageName: "hexo-theme-yun",
    version: "^1.10.11",
    themeValue: "yun",
    officialUrl: "https://hexo.io/themes/#Yun",
    previewUrl: "https://yun.yunyoujun.cn/",
    description: "轻巧、有个性，适合偏个人化的写作站。",
    configPath: `${HEXO_ROOT}/_config.yun.yml`,
    configContent: "mode: light\nmenu:\n  home: /\n  archives: /archives\n  categories: /categories\n  tags: /tags\n  about: /about\n",
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

function decode(content) {
  return Buffer.from(content, "base64").toString("utf8");
}

function encode(content) {
  return Buffer.from(content, "utf8").toString("base64");
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
  return { ok: true, provider: "github-actions", workflow: "deploy-hexo.yml" };
}

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    return json(res, 200, { themes: themes.map(({ configContent, ...theme }) => theme) });
  }

  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed." });

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");

  const adminPassword = process.env.THEME_ADMIN_PASSWORD?.trim();
  if (!adminPassword || body.password !== adminPassword) {
    return json(res, 401, { error: "管理员密码不正确。" });
  }

  const theme = themes.find((item) => item.id === body.theme);
  if (!theme) return json(res, 400, { error: "未知模板。" });

  try {
    const packagePath = `${HEXO_ROOT}/package.json`;
    const packageFile = await getFile(packagePath);
    const packageJson = JSON.parse(packageFile.content);
    packageJson.dependencies = packageJson.dependencies || {};
    packageJson.dependencies[theme.packageName] = theme.version;
    const packageResult = await putFileIfChanged(
      packagePath,
      `${JSON.stringify(packageJson, null, 2)}\n`,
      `Install ${theme.name} Hexo theme`,
    );

    const configPath = `${HEXO_ROOT}/_config.yml`;
    const configFile = await getFile(configPath);
    const configResult = await putFileIfChanged(
      configPath,
      updateSiteConfig(configFile.content, theme.themeValue),
      `Switch Hexo theme to ${theme.name}`,
    );

    if (theme.configContent) {
      const themeConfig = await getFile(theme.configPath);
      if (!themeConfig) {
        await putFile(theme.configPath, theme.configContent, `Add ${theme.name} theme config`);
      }
    }

    const sha = configResult.sha || packageResult.sha || (await getBranchSha());
    const deployment = await triggerDeployment();
    return json(res, 200, { ok: true, theme: theme.name, commit: sha, deployment });
  } catch (error) {
    return json(res, 500, { error: error.message || "切换失败。" });
  }
};
