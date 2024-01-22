const fs = require('fs/promises');
const path = require('path');

const stylePath = path.join(__dirname, 'styles');
const distPath = path.join(__dirname, 'project-dist');

fs.readdir(stylePath, { withFileTypes: true })
  .then((files) => {
    const stylesArr = [];
    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        fs.readFile(path.join(stylePath, file.name))
          .then((chunk) => {
            stylesArr.push(chunk);
            fs.writeFile(
              path.join(distPath, 'bundle.css'),
              stylesArr.join('\n'),
            );
          })
          .catch((err) => console.log(err.message));
      }
    });
  })
  .catch((err) => console.log(err.message));
