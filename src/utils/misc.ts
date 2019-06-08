import axios from 'axios';
import fs from 'fs-extra';
import execa from 'execa';
import { File } from 'models';
import removeMarkdown from 'remove-markdown';

export function download(url: string, localPath: string) {
  return axios({url, method: 'GET', responseType: 'stream'})
    .then(response => new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(localPath);
      writer.on('finish', resolve);
      writer.on('error', reject);
      response.data.pipe(writer);
    }));
}

export async function pull(dir: string, repo: string, commit = 'origin/master') {
  if (fs.pathExistsSync(dir)) {
    await execa.shell(`git fetch`, {cwd: dir});
  } else {
    await execa.shell(`git clone https://github.com/algorithm-visualizer/${repo}.git ${dir}`);
  }
  await execa.shell(`git reset --hard ${commit}`, {cwd: dir});
}

export function getDescription(files: File[]) {
  const readmeFile = files.find(file => file.name === 'README.md');
  if (!readmeFile) return '';
  const lines = readmeFile.content.split('\n');
  lines.shift();
  while (lines.length && !lines[0].trim()) lines.shift();
  let descriptionLines = [];
  while (lines.length && lines[0].trim()) descriptionLines.push(lines.shift());
  return removeMarkdown(descriptionLines.join(' '));
}

export function rethrow(err: any) {
  throw err;
}
