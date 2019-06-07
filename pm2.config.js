const env = {
  NODE_ENV: 'production',
  HTTP_PORT: '80',
  HTTPS_PORT: '443',
  GITHUB_CLIENT_ID: '4ca41e5d1e4ae21b6f75',
  GITHUB_CLIENT_SECRET: '72fb530eb676b89a1a77e5371f8e21c5965f56ea',
  GITHUB_WEBHOOK_SECRET: 'flapdoodle_blandiloquence',
  CREDENTIALS_ENABLED: '1',
  CREDENTIALS_PATH: '/etc/letsencrypt/live/algorithm-visualizer.org',
  CREDENTIALS_CA: 'chain.pem',
  CREDENTIALS_KEY: 'privkey.pem',
  CREDENTIALS_CERT: 'cert.pem',
};

module.exports = {
  apps: [
    {
      name: 'algorithm-visualizer',
      script: 'npm run pm2',
      env,
    },
  ],
};
