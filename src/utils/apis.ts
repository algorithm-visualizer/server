import axios, { AxiosResponse } from 'axios';
import { githubClientId, githubClientSecret } from 'config/environments';

const instance = axios.create();

instance.interceptors.request.use(request => {
  request.params = {client_id: githubClientId, client_secret: githubClientSecret, ...request.params};
  return request;
});

const request = (url: string, process: (mappedUrl: string, args: any[]) => Promise<AxiosResponse<any>>) => {
  const tokens = url.split('/');
  const baseURL = /^https?:\/\//i.test(url) ? '' : 'https://api.github.com';
  return (...args: any[]) => {
    const mappedUrl = baseURL + tokens.map(token => token.startsWith(':') ? args.shift() : token).join('/');
    return process(mappedUrl, args);
  };
};

const GET = (url: string) => {
  return request(url, (mappedUrl: string, args: any[]) => {
    const [params] = args;
    return instance.get(mappedUrl, {params});
  });
};

const DELETE = (url: string) => {
  return request(url, (mappedUrl: string, args: any[]) => {
    const [params] = args;
    return instance.delete(mappedUrl, {params});
  });
};

const POST = (url: string) => {
  return request(url, (mappedUrl: string, args: any[]) => {
    const [body, params] = args;
    return instance.post(mappedUrl, body, {params});
  });
};

const PUT = (url: string) => {
  return request(url, (mappedUrl: string, args: any[]) => {
    const [body, params] = args;
    return instance.put(mappedUrl, body, {params});
  });
};

const PATCH = (url: string) => {
  return request(url, (mappedUrl: string, args: any[]) => {
    const [body, params] = args;
    return instance.patch(mappedUrl, body, {params});
  });
};

export const GitHubApi = {
  listCommits: GET('/repos/:owner/:repo/commits'),

  getAccessToken: (code: string) => instance.post('https://github.com/login/oauth/access_token', {code}, {headers: {Accept: 'application/json'}}),

  getLatestRelease: GET('/repos/:owner/:repo/releases/latest'),
};
