import fs from 'fs-extra';

export type Author = {
  login: string,
  avatar_url: string,
}

export class File {
  content!: string;
  contributors!: Author[];

  constructor(public path: string, public name: string) {
    this.refresh();
  }

  refresh() {
    this.content = fs.readFileSync(this.path, 'utf-8');
    this.contributors = [];
  }

  toJSON() {
    const {name, content, contributors} = this;
    return {name, content, contributors};
  }
}
