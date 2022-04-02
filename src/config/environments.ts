require('dotenv-flow').config();

const {
  NODE_ENV,

  HTTP_PORT,

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

export const webhookOptions = isEnabled(WEBHOOK_ENABLED) ? {
  path: '/webhook',
  secret: WEBHOOK_SECRET,
} : undefined;

export const githubClientId = GITHUB_CLIENT_ID;
export const githubClientSecret = GITHUB_CLIENT_SECRET;

export const awsAccessKeyId = AWS_ACCESS_KEY_ID;
export const awsSecretAccessKey = AWS_SECRET_ACCESS_KEY;
