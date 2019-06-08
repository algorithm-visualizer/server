import express from 'express';
import { githubClientId } from 'config/environments';
import { GitHubApi } from 'utils/apis';
import { Controller } from 'controllers/Controller';
import Server from 'Server';

export class AuthController extends Controller {
  constructor(server: Server) {
    super(server);
    this.router
      .get('/request', this.request)
      .get('/response', this.response)
      .get('/destroy', this.destroy);
  }

  route = (router: express.Router): void => {
    router.use('/auth', this.router);
  };

  request = (req: express.Request, res: express.Response) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${githubClientId}&scope=user,gist`);
  };

  response = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const {code} = req.query;

    GitHubApi.getAccessToken(code).then(({data}) => {
      const {access_token} = data;
      res.send(`<script>window.opener.signIn('${access_token}');window.close();</script>`);
    }).catch(next);
  };

  destroy = (req: express.Request, res: express.Response) => {
    res.send(`<script>window.opener.signOut();window.close();</script>`);
  };
}
