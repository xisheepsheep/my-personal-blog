---
title: 模板后台
date: 2026-05-28 21:00:00
---

<div class="theme-admin">
  <p class="theme-admin__lead">
    这里会从 Hexo 官方主题市场读取模板列表。输入管理员密码后，点击“应用模板”会自动提交 GitHub，并触发 GitHub Actions 部署到 Vercel。
  </p>

  <div id="theme-current" class="theme-admin__current">正在读取当前模板...</div>

  <div class="theme-admin__bar">
    <input id="theme-password" type="password" placeholder="管理员密码" />
    <input id="theme-search" type="search" placeholder="搜索模板名称、描述、标签" />
    <button id="refresh-themes" type="button">刷新模板</button>
  </div>

  <p id="theme-message" class="theme-admin__message"></p>
  <div id="theme-grid" class="theme-admin__grid"></div>
</div>

<style>
.theme-admin__lead { color: var(--text-color, #475569); }
.theme-admin__bar { display: grid; grid-template-columns: minmax(180px, 260px) minmax(220px, 1fr) auto; gap: 12px; margin: 24px 0; }
.theme-admin__bar input { padding: 12px 14px; border: 1px solid #cbd5e1; border-radius: 8px; min-width: 0; }
.theme-admin__bar button,
.theme-card button,
.theme-card a { border: 0; border-radius: 8px; padding: 10px 14px; background: #0f172a; color: #fff; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; }
.theme-card a { background: #e2e8f0; color: #0f172a; }
.theme-card button[disabled] { opacity: .5; cursor: not-allowed; }
.theme-admin__message { min-height: 24px; color: #0891b2; }
.theme-admin__current { border: 1px solid #bae6fd; background: #f0f9ff; color: #075985; border-radius: 10px; padding: 14px 16px; margin: 18px 0; }
.theme-admin__current a { color: #0369a1; font-weight: 700; }
.theme-admin__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-top: 20px; }
.theme-card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; background: rgba(255,255,255,.78); }
.theme-card h3 { margin: 0 0 8px; }
.theme-card p { min-height: 72px; color: #64748b; }
.theme-card__meta { margin: 0 0 12px; color: #64748b; font-size: 13px; }
.theme-card__tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
.theme-card__tags span { border-radius: 999px; padding: 3px 8px; background: #f1f5f9; color: #475569; font-size: 12px; }
.theme-card__actions { display: flex; gap: 10px; flex-wrap: wrap; }
@media (max-width: 720px) {
  .theme-admin__bar { grid-template-columns: 1fr; }
}
</style>

<script>
(function () {
  const grid = document.getElementById("theme-grid");
  const message = document.getElementById("theme-message");
  const current = document.getElementById("theme-current");
  const password = document.getElementById("theme-password");
  const search = document.getElementById("theme-search");
  let themes = [];

  function setMessage(text, isError) {
    message.textContent = text;
    message.style.color = isError ? "#dc2626" : "#0891b2";
  }

  function renderThemes() {
    const keyword = search.value.trim().toLowerCase();
    const visible = themes.filter((theme) => {
      const haystack = [theme.name, theme.description, theme.link, theme.preview, ...(theme.tags || [])].join(" ").toLowerCase();
      return !keyword || haystack.includes(keyword);
    });

    grid.innerHTML = visible.map((theme) => `
      <article class="theme-card">
        <h3>${theme.name}</h3>
        <div class="theme-card__meta">${theme.applyable ? "可一键应用" : "仅展示，缺少 GitHub 安装地址"}</div>
        <p>${theme.description || "Hexo 官方主题市场收录的主题。"}</p>
        <div class="theme-card__tags">
          ${(theme.tags || []).slice(0, 5).map((tag) => `<span>${tag}</span>`).join("")}
        </div>
        <div class="theme-card__actions">
          ${theme.preview ? `<a href="${theme.preview}" target="_blank" rel="noreferrer">预览</a>` : ""}
          ${theme.link ? `<a href="${theme.link}" target="_blank" rel="noreferrer">源码</a>` : ""}
          <button type="button" data-theme="${theme.id}" ${theme.applyable ? "" : "disabled"}>应用模板</button>
        </div>
      </article>
    `).join("");

    setMessage(`已加载 ${themes.length} 个 Hexo 官方主题，当前显示 ${visible.length} 个。`);
  }

  async function loadThemes() {
    setMessage("正在从 Hexo 官方主题市场加载模板...");
    const response = await fetch("/api/theme-switch");
    const data = await response.json();
    themes = data.themes || [];
    const previewUrl = `/?theme-preview=${Date.now()}`;
    current.innerHTML = `
      当前线上模板：<strong>${data.current && data.current.name ? data.current.name : "未知"}</strong>
      <span>（theme: ${data.current && data.current.theme ? data.current.theme : "unknown"}）</span>
      · <a href="${previewUrl}" target="_blank" rel="noreferrer">打开无缓存预览</a>
      · <a href="https://github.com/xisheepsheep/my-personal-blog/actions/workflows/deploy-hexo.yml" target="_blank" rel="noreferrer">查看部署状态</a>
    `;
    renderThemes();
  }

  async function applyTheme(theme) {
    if (!password.value) {
      setMessage("请先输入管理员密码。", true);
      return;
    }
    setMessage("正在切换模板、提交 GitHub 并触发 GitHub Actions 部署，请稍等...");
    const response = await fetch("/api/theme-switch", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: password.value, theme }),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "切换失败。", true);
      return;
    }
    const deployText = data.deployment && data.deployment.ok
      ? `部署已通过 GitHub Actions 触发：${data.deployment.url}`
      : "代码已切换，请查看 GitHub Actions / Vercel 部署状态。";
    setMessage(`已切换到 ${data.theme}。${deployText} 部署完成后点“刷新模板”查看当前模板。`);
  }

  document.getElementById("refresh-themes").addEventListener("click", loadThemes);
  search.addEventListener("input", renderThemes);
  grid.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-theme]");
    if (button && !button.disabled) applyTheme(button.dataset.theme);
  });
  loadThemes();
})();
</script>
