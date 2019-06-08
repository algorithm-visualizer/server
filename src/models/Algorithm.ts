import path from 'path';
import { createKey, listFiles } from 'utils/hierarchy';
import { File } from 'models';
import { getDescription } from 'utils/misc';

export class Algorithm {
  key: string;
  files!: File[];
  description!: string;

  constructor(private path: string, public name: string) {
    this.key = createKey(name);
    this.refresh();
  }

  refresh() {
    this.files = listFiles(this.path)
      .map(fileName => new File(path.resolve(this.path, fileName), fileName));
    this.description = getDescription(this.files);
  }

  toJSON() {
    const {key, name} = this;
    return {key, name};
  }
}
