export const IGNORE_FILES = new Set([
  // macOS
  ".DS_Store",
  ".AppleDouble",
  ".LSOverride",
  "Icon\r", // Finder custom folder icon
  "._.DS_Store", // resource fork files

  // Windows
  "Thumbs.db",
  "ehthumbs.db",
  "desktop.ini",

  // Linux / Unix
  ".directory",

  // General hidden/system
  ".Spotlight-V100",
  ".Trashes",
  ".fseventsd",

  // Version control
  ".git",
  ".gitignore",
  ".gitattributes",

  // Node / tooling (if user opens project folders)
  "node_modules",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",

  // Python
  "__pycache__",
  ".pytest_cache",

  // IDEs
  ".vscode",
  ".idea",

  // Logs / temp
  ".cache",
  "tmp",
  "temp",
]);
