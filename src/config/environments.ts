import fs from 'fs';
import { ServerOptions } from 'https';
import path from 'path';
import { spawn } from 'child_process';
import { rootDir } from 'config/paths';

require('dotenv-flow').config();

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

  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} = process.env as {
  [key: string]: string,
};

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
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
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

export let credentials: ServerOptions | undefined;
if (isEnabled(CREDENTIALS_ENABLED)) {
  if (fs.existsSync(CREDENTIALS_PATH)) {
    const readCredentials = (file: string) => fs.readFileSync(path.resolve(CREDENTIALS_PATH, file));
    credentials = {
      ca: readCredentials(CREDENTIALS_CA),
      key: readCredentials(CREDENTIALS_KEY),
      cert: readCredentials(CREDENTIALS_CERT),
    };
  } else {
    const certbotIniPath = path.resolve(rootDir, 'certbot.ini');
    const childProcess = spawn('certbot', ['certonly', '--non-interactive', '--agree-tos', '--config', certbotIniPath]);
    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);
    childProcess.on('error', console.error);
    childProcess.on('exit', code => {
      if (code === 0) {
        process.exit(0);
      } else {
        console.error(new Error(`certbot failed with exit code ${code}.`));
      }
    });
  }
}

export const githubClientId = GITHUB_CLIENT_ID;
export const githubClientSecret = GITHUB_CLIENT_SECRET;

export const awsAccessKeyId = AWS_ACCESS_KEY_ID;
export const awsSecretAccessKey = AWS_SECRET_ACCESS_KEY;
