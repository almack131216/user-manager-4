import { Router, RouterConfiguration } from 'aurelia-router';
import { inject, autoinject } from 'aurelia-framework';
import { WebAPI } from './api/web-api';
import * as Constants from './resources/constants';
const CV = Constants

@inject(WebAPI)

export class App {
  router: Router;
  public CV = CV  

  constructor(public api: WebAPI) {

  }

  configureRouter(config: RouterConfiguration, router: Router): void {
    config.title = CV.SITE_NAME_ABBR;
    config.map([
      { route: ['','welcome'], moduleId: './views/pages/welcome', name: 'welcome', nav: true, title: 'Welcome' },
      { route: 'users', moduleId: './views/pages/user-no-selection', name: 'user-no-selection', nav: true, title: 'Users' },
      { route: 'users/:id', moduleId: './views/pages/user-selected', name: 'users', title: 'User' },
      { route: 'users/add', moduleId: './views/pages/user-add', name: 'user-add', nav: true, title: 'Add User' }
    ]);

    this.router = router;
  }
}