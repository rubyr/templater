const fs = require("fs");

const directory = process.argv[2];
const outputName = process.argv[3];

if (!directory || !outputName) {
  for (const [key, value] of Object.entries({ directory, outputName })) {
    if (!value) console.log(key + " was not specified");
  }
  process.exit(1);
}

const template = {
  name: outputName,
};

const makeDirObject = (absoluteDirPath) => {
  const dir = {};

  const items = fs.readdirSync(absoluteDirPath);
  console.log(items);
  for (const item of items) {
    const itemAbsDir = absoluteDirPath + "/" + item;

    if (fs.lstatSync(itemAbsDir).isDirectory()) {
      dir[item] = makeDirObject(itemAbsDir);
    } else {
      dir[item] = fs.readFileSync(itemAbsDir, { encoding: "utf-8" });
    }
  }

  return dir;
};

template.contents = makeDirObject(directory);

console.log(template);

fs.writeFileSync("./" + outputName + ".json", JSON.stringify(template));
