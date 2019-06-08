import path from 'path';

export const rootDir = path.resolve(__dirname, '..', '..');
export const publicDir = path.resolve(rootDir, 'public');
export const algorithmsDir = path.resolve(publicDir, 'algorithms');
export const codesDir = path.resolve(publicDir, 'codes');
export const visualizationsDir = path.resolve(publicDir, 'visualizations');
export const frontendDir = path.resolve(publicDir, 'frontend');
export const frontendBuildDir = path.resolve(frontendDir, 'build');
export const frontendBuiltDir = path.resolve(publicDir, 'frontend-built');
