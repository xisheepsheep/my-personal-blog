const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const sourcePath = path.join(root, "theme-source.json");

if (!fs.existsSync(sourcePath)) process.exit(0);

const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
if (!source.theme || !source.git) process.exit(0);

const themeDir = path.join(root, "themes", source.theme);
if (fs.existsSync(themeDir)) process.exit(0);

const npmThemeDir = path.join(root, "node_modules", `hexo-theme-${source.theme}`);
if (fs.existsSync(npmThemeDir)) process.exit(0);

const gitCandidates = process.platform === "win32"
  ? ["git", "C:\\Program Files\\Git\\cmd\\git.exe", "C:\\Program Files\\Git\\bin\\git.exe"]
  : ["git"];

let lastError;
for (const git of gitCandidates) {
  try {
    console.log(`Cloning Hexo theme ${source.theme} from ${source.git}`);
    execFileSync(git, ["clone", "--depth", "1", source.git, themeDir], {
      cwd: root,
      stdio: "inherit",
    });
    process.exit(0);
  } catch (error) {
    lastError = error;
  }
}

throw lastError;
