import path from 'path';
import fs from 'fs-extra';

export function createKey(name: string) {
  return name.toLowerCase().trim().replace(/[^\w \-]/g, '').replace(/ /g, '-');
}

export function isDirectory(dirPath: string) {
  return fs.lstatSync(dirPath).isDirectory();
}

export function listFiles(dirPath: string) {
  return fs.pathExistsSync(dirPath) ? fs.readdirSync(dirPath).filter(fileName => !fileName.startsWith('.')) : [];
}

export function listDirectories(dirPath: string) {
  return listFiles(dirPath).filter(fileName => isDirectory(path.resolve(dirPath, fileName)));
}
