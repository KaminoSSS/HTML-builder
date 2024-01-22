const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'project-dist');

async function cleaner(folder) {
  let files = [];
  try {
    files = await fs.promises.readdir(folder, { withFileTypes: true });
  } catch (error) {
    return;
  }

  for (const file of files) {
    if (file.isFile()) {
      await fs.promises.unlink(path.join(folder, file.name));
    }
    if (file.isDirectory()) {
      await cleaner(path.join(folder, file.name));
    }
  }

  await fs.promises.rmdir(folder);
}

const copyFolder = (input, output) => {
  fs.mkdir(path.join(output), { recursive: true }, () => {
    fs.promises
      .readdir(path.join(input), { withFileTypes: true })
      .then((files) =>
        files.forEach((elem) => {
          if (elem.isFile()) {
            fs.promises.copyFile(
              path.join(input, elem.name),
              path.join(output, elem.name),
            );
          } else if (elem.isDirectory()) {
            copyFolder(
              path.join(input, elem.name),
              path.join(output, elem.name),
            );
          }
        }),
      );
  });
};

const mergestyles = (source, result) => {
  const stylesWriteStream = fs.createWriteStream(result);

  fs.readdir(source, { withFileTypes: true }, (error, elements) => {
    if (error) {
      throw error;
    }

    elements.forEach((elem) => {
      if (path.extname(elem.name) === '.css') {
        const stylesreadStream = fs.createReadStream(
          path.resolve(source, elem.name),
        );
        stylesreadStream.pipe(stylesWriteStream, { end: false });
      }
    });
  });
};

async function createhtml(source, destination, templates) {
  const writeStream = fs.createWriteStream(destination, 'utf-8');
  const files = await fs.promises.readdir(source, { withFileTypes: true });
  const params = {};
  for (const element of files) {
    if (path.extname(element.name) === '.html') {
      const paramName = path.parse(element.name).name;
      const paramValue = (
        await fs.promises.readFile(path.join(source, element.name))
      ).toString();
      params[paramName] = paramValue;
    }
  }

  const template = (await fs.promises.readFile(templates)).toString();
  let result = template;

  Object.keys(params).forEach((key) => {
    result = result.replaceAll(`{{${key}}}`, params[key]);
  });
  writeStream.write(result, 'utf-8');
}

(async function mergeHTML() {
  await cleaner(distPath);
  await fs.promises.mkdir(distPath, { recursive: true });
  copyFolder(path.join(__dirname, 'assets'), path.join(distPath, 'assets'));
  mergestyles(path.join(__dirname, 'styles'), path.join(distPath, 'style.css'));
  await createhtml(
    path.join(__dirname, 'components'),
    path.join(distPath, 'index.html'),
    path.join(__dirname, 'template.html'),
  );
})();
