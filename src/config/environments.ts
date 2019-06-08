import fs from 'fs';
import { ServerOptions } from 'https';
import path from 'path';

require('dotenv-flow').config();

declare var process: {
  env: {
    [key: string]: string,
  }
};

const {
  NODE_ENV,

  HTTP_PORT,
  HTTPS_PORT,

  CREDENTIALS_ENABLED,
  CREDENTIALS_PATH,
  CREDENTIALS_CA,
  CREDENTIALS_KEY,
  CREDENTIALS_CERT,

  WEBHOOK_ENABLED,
  WEBHOOK_SECRET,

  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
} = process.env;

const isEnabled = (v: string) => v === '1';

const missingVars = [
  'NODE_ENV',
  'HTTP_PORT',
  'HTTPS_PORT',
  'CREDENTIALS_ENABLED',
  ...(isEnabled(CREDENTIALS_ENABLED) ? [
    'CREDENTIALS_PATH',
    'CREDENTIALS_CA',
    'CREDENTIALS_KEY',
    'CREDENTIALS_CERT',
  ] : []),
  'WEBHOOK_ENABLED',
  ...(isEnabled(WEBHOOK_ENABLED) ? [
    'WEBHOOK_SECRET',
  ] : []),
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
].filter(variable => process.env[variable] === undefined);
if (missingVars.length) throw new Error(`The following environment variables are missing: ${missingVars.join(', ')}`);

export const __PROD__ = NODE_ENV === 'production';
export const __DEV__ = NODE_ENV === 'development';

export const httpPort = parseInt(HTTP_PORT);
export const httpsPort = parseInt(HTTPS_PORT);

export const webhookOptions = isEnabled(WEBHOOK_ENABLED) ? {
  path: '/webhook',
  secret: WEBHOOK_SECRET,
} : undefined;

const readCredentials = (file: string) => fs.readFileSync(path.resolve(CREDENTIALS_PATH, file));
export const credentials: ServerOptions | undefined = isEnabled(CREDENTIALS_ENABLED) ? {
  ca: readCredentials(CREDENTIALS_CA),
  key: readCredentials(CREDENTIALS_KEY),
  cert: readCredentials(CREDENTIALS_CERT),
} : undefined;

export const githubClientId = GITHUB_CLIENT_ID;
export const githubClientSecret = GITHUB_CLIENT_SECRET;
