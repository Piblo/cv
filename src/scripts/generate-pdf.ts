import { chromium } from "@playwright/test";
import assert from "node:assert";
import { spawnSync, spawn } from "node:child_process";
import kill from "tree-kill";

spawnSync("npm", ["run", "build"], { stdio: "inherit" });
const previewProcess = spawn("npm", ["run", "preview"]);

await new Promise((resolve) => {
  assert(previewProcess.stdout);
  previewProcess.stdout.on("data", (data) => {
    if (data.toString().includes("localhost:4321")) {
      resolve(true);
    }
  });
});

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:4321");

const pdfPath = "public/Pablo Guerrero.pdf";
await page.pdf({
  path: pdfPath,
  format: "A4",
  margin: { top: "20px", bottom: "20px" },
});

console.log("PDF generated:", pdfPath);

kill(previewProcess.pid!);
await browser.close();
