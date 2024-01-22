const fs = require('fs/promises');
const path = require('path');

async function copyDir() {
  const origPath = path.join(__dirname, 'files');
  const copyPath = path.join(__dirname, 'files-copy');

  const files = await fs.readdir(origPath);

  fs.mkdir(copyPath, { recursive: true }, (err) => {
    if (err) return console.error(err);
  });

  files.forEach((file) => {
    const pathToFile = path.join(origPath, file);
    const pathToCopiedFile = path.join(copyPath, file);
    fs.copyFile(pathToFile, pathToCopiedFile);
  });

  const copiedFiles = await fs.readdir(copyPath);
  const delFiles = copiedFiles.filter((file) => !files.includes(file));

  delFiles.forEach((file) => {
    fs.unlink(path.join(copyPath, file), (err) => {
      if (err) return console.error(err);
    });
  });
}

copyDir();
