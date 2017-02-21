import { Router, RouterConfiguration } from 'aurelia-router';
import { inject, autoinject } from 'aurelia-framework';
import * as Constants from './resources/constants';
const CV = Constants

import { FetchConfig } from 'aurelia-auth';
import { EventAggregator } from 'aurelia-event-aggregator';
import { HttpClient } from 'aurelia-http-client';
import { WebAPIUsers } from './api/web-api-users';

const reposUrl = 'https://api.github.com/orgs/aurelia/repos';
const profileUrl = 'src/api/api-global.json';

import { MyGlobals } from './my-globals';

@autoinject
@inject(HttpClient, Router, FetchConfig, WebAPIUsers)

export class App {
  public CV = CV

  repos = null;
  router: Router
  fetchConfig: FetchConfig

  http;
  currentUser;
  myId
  myDisplayName
  
  isReader
  isEditor

  myGlobals

  constructor(http, private api: WebAPIUsers) {
    this.http = http;
    this.myGlobals = MyGlobals;    
  }


  async activate() {
    // return a Promise that will resolve when the repos have
    // been loaded and sorted by star count.
    this.api.apiCall('global', null, null)
      .then(apiResultData => this.currentUser = apiResultData)
      .then(() => {
        this.currentUser = this.currentUser.currentUser,
          this.myId = this.currentUser.id,
          this.myDisplayName = this.currentUser.displayName,
          this.isReader = this.currentUser.isReader,
          this.isEditor = this.currentUser.isEditor
          this.myGlobals.currentUser = this.currentUser
          console.log('this.myGlobals.currentUser: ' + this.myGlobals.currentUser.id)
      });

  }


  configureRouter(config: RouterConfiguration, router: Router): void {
    config.title = CV.SITE_NAME_ABBR;
    config.map([
      { route: ['', 'welcome'], moduleId: './views/pages/welcome', name: 'welcome', nav: true, title: 'Home' },
      { route: 'users', moduleId: './views/pages/user-no-selection', name: 'user-no-selection', nav: true, title: 'Team', settings: { isReaderOnly: true } },
      { route: 'users/:id', moduleId: './views/pages/user-selected', name: 'users', title: 'Team' },
      { route: 'user/:id/:pageType', moduleId: './views/pages/user-selected', name: 'user-edit', title: 'Edit' },
      { route: 'user/:id/:pageType', moduleId: './views/pages/user-selected', name: 'user-read', title: 'Read' }
      // { route: 'users/add', moduleId: './views/pages/user-add', name: 'user-add', nav: true, title: 'Add User' },
      // { route: 'dialog-demo', name: 'dialog-demo', moduleId: './dialog-demo/dialog-demo', nav: true, title: 'Dialog Demo' }
    ]);

    this.router = router;
  }
}