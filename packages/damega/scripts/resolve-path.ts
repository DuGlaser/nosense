import fs from 'fs';
import path from 'path';

function resolvePath(dir: string) {
  const p = path.resolve(__dirname, dir);

  fs.readdir(p, {}, (_, files) => {
    files.forEach((file: string | Buffer) => {
      const filePath = path.resolve(p, file.toString());

      if (fs.statSync(filePath).isDirectory()) {
        return resolvePath(filePath);
      }

      const content = fs.readFileSync(filePath);

      const regex = new RegExp(/@(\/[a-zA-Z\d]+)+/g);

      const matchs = content.toString().match(regex);
      if (!matchs) {
        return;
      }

      const newContent = content.toString().replace(regex, (m) => {
        const from = p;
        const to = path.resolve(__dirname, '../dist', m.replace(/@/g, '.'));

        return path.relative(from, to);
      });

      const fd = fs.openSync(filePath, 'r+');
      fs.writeSync(fd, newContent);
    });
  });
}

resolvePath('../dist');
