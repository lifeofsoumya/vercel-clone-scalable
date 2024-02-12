const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

async function init() {
  const distDirComponents = fs.readdirSync(
    path.join(__dirname, "home", "app", "output", "dist"), // for docker do /output/dist but for now /home/app/output/dist
    { recursive: true }
  );

  console.log("distDirComponents", distDirComponents);
}
init()