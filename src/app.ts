import { Router, RouterConfiguration } from 'aurelia-router';
import { inject, autoinject } from 'aurelia-framework';
import { WebAPI } from './api/web-api';
import * as Constants from './resources/constants';
const CV = Constants

import {FetchConfig} from 'aurelia-auth';
@inject(WebAPI,Router,FetchConfig)

export class App {
  api: WebAPI
  router: Router
  fetchConfig: FetchConfig
  public CV = CV  

  constructor() {
    // this.router = router;
    // this.fetchConfig = fetchConfig;
  }

  activate(){
    //this.fetchConfig.configure();
  }

  configureRouter(config: RouterConfiguration, router: Router): void {
    config.title = CV.SITE_NAME_ABBR;
    config.map([
      { route: ['','welcome'], moduleId: './views/pages/welcome', name: 'welcome', nav: true, title: 'Welcome' },
      { route: 'users', moduleId: './views/pages/user-no-selection', name: 'user-no-selection', nav: true, title: 'Users' },
      { route: 'users/:id', moduleId: './views/pages/user-selected', name: 'users', title: 'User' },
      { route: 'users/:id/:editType', moduleId: './views/pages/user-selected', name: 'user-edit', title: 'Edit User' }
      // { route: 'users/add', moduleId: './views/pages/user-add', name: 'user-add', nav: true, title: 'Add User' },
      // { route: 'dialog-demo', name: 'dialog-demo', moduleId: './dialog-demo/dialog-demo', nav: true, title: 'Dialog Demo' }
    ]);

    this.router = router;
  }
}