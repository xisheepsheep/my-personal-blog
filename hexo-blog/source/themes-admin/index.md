---
title: 模板后台
date: 2026-05-28 21:00:00
---

<div class="theme-admin">
  <p class="theme-admin__lead">输入管理员密码后，可以从 Hexo 官方主题生态里选择模板，并一键提交到 GitHub、触发 Vercel 部署。</p>

  <div class="theme-admin__bar">
    <input id="theme-password" type="password" placeholder="管理员密码" />
    <button id="refresh-themes" type="button">加载模板</button>
  </div>

  <p id="theme-message" class="theme-admin__message"></p>
  <div id="theme-grid" class="theme-admin__grid"></div>
</div>

<style>
.theme-admin__lead { color: var(--text-color, #475569); }
.theme-admin__bar { display: flex; gap: 12px; flex-wrap: wrap; margin: 24px 0; }
.theme-admin__bar input { min-width: 260px; flex: 1; padding: 12px 14px; border: 1px solid #cbd5e1; border-radius: 8px; }
.theme-admin__bar button,
.theme-card button,
.theme-card a { border: 0; border-radius: 8px; padding: 10px 14px; background: #0f172a; color: #fff; cursor: pointer; text-decoration: none; display: inline-flex; }
.theme-card a { background: #e2e8f0; color: #0f172a; }
.theme-admin__message { min-height: 24px; color: #0891b2; }
.theme-admin__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-top: 20px; }
.theme-card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; background: rgba(255,255,255,.76); }
.theme-card h3 { margin-top: 0; }
.theme-card p { min-height: 72px; color: #64748b; }
.theme-card__actions { display: flex; gap: 10px; flex-wrap: wrap; }
</style>

<script>
(function () {
  const grid = document.getElementById("theme-grid");
  const message = document.getElementById("theme-message");
  const password = document.getElementById("theme-password");

  function setMessage(text, isError) {
    message.textContent = text;
    message.style.color = isError ? "#dc2626" : "#0891b2";
  }

  async function loadThemes() {
    setMessage("正在加载模板...");
    const response = await fetch("/api/theme-switch");
    const data = await response.json();
    grid.innerHTML = data.themes.map((theme) => `
      <article class="theme-card">
        <h3>${theme.name}</h3>
        <p>${theme.description}</p>
        <div class="theme-card__actions">
          <a href="${theme.previewUrl}" target="_blank" rel="noreferrer">预览</a>
          <a href="${theme.officialUrl}" target="_blank" rel="noreferrer">官方市场</a>
          <button type="button" data-theme="${theme.id}">应用模板</button>
        </div>
      </article>
    `).join("");
    setMessage("请选择一个模板。");
  }

  async function applyTheme(theme) {
    if (!password.value) {
      setMessage("请先输入管理员密码。", true);
      return;
    }
    setMessage("正在切换模板、提交 GitHub 并触发部署，请稍等...");
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
      ? `部署已触发：https://${data.deployment.url}`
      : "代码已切换，部署触发结果请查看 Vercel。";
    setMessage(`已切换到 ${data.theme}。${deployText}`);
  }

  document.getElementById("refresh-themes").addEventListener("click", loadThemes);
  grid.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-theme]");
    if (button) applyTheme(button.dataset.theme);
  });
  loadThemes();
})();
</script>
