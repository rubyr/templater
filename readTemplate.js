const fs = require("fs");
const { exec, spawn } = require("child_process");

const templateFile = process.argv[2];
const outputDirectory = process.argv[3];

if (!templateFile || !outputDirectory) {
  for (const [key, value] of Object.entries({
    templateFile,
    outputDirectory,
  })) {
    if (!value) console.log(key + " was not specified");
  }
  process.exit(1);
}

const template = JSON.parse(fs.readFileSync(templateFile, "utf-8"));

console.log(
  'attempting to clone template "' + template.name + '" into ' + outputDirectory
);

if (typeof template.contents !== "object") {
  console.error("invalid template");
  process.exit(1);
}

fs.mkdirSync(outputDirectory);
console.log("");

const makeDir = (dirObject, fullPath) => {
  for (const [name, value] of Object.entries(dirObject)) {
    const itemAbsDir = fullPath + "/" + name;
    if (typeof value === "object") {
      fs.mkdirSync(itemAbsDir);
      makeDir(value, itemAbsDir);
    } else {
      console.log("writing " + itemAbsDir);
      fs.writeFileSync(itemAbsDir, value);
    }
  }
};

makeDir(template.contents, "./" + outputDirectory);
if (template.postinstall) {
  console.log();
  exec(
    template.postinstall,
    { cwd: outputDirectory },
    (err, stdout, stderr) => {
      if (stderr) console.error("postinstall error: " + stderr);
      if (stdout) console.log("postinstall: " + stdout);
    }
  );
}
