import { Router, RouterConfiguration } from 'aurelia-router';
import { inject, autoinject } from 'aurelia-framework';
import { Lookups } from './resources/lookups';
import * as Constants from './resources/constants';
const CV = Constants

import { FetchConfig } from 'aurelia-auth';

import { WebAPIUsers } from './api/web-api-users';
import { EventAggregator } from 'aurelia-event-aggregator';

import { HttpClient } from 'aurelia-http-client';


const reposUrl = 'https://api.github.com/orgs/aurelia/repos';
const profileUrl = 'src/api/api-global.json';

@autoinject
@inject(HttpClient, Router, FetchConfig, WebAPIUsers)

export class App {
  public CV = CV

  repos = null;
  router: Router
  fetchConfig: FetchConfig

  http;
  currentUserX;
  currentUser;
  myId
  myDisplayName
  isMemberXXX
  isReader
  isEditor


  constructor(http, private api: WebAPIUsers) {
    this.http = http;
    //alert( 'repos' + JSON.stringify(this.repos))

    
  }

  

  async activate() {
    // return a Promise that will resolve when the repos have
    // been loaded and sorted by star count.
    this.api.getGlobal()
      .then(currentUserX => this.currentUserX = currentUserX)
      .then(() => {
        this.currentUser = this.currentUserX.currentUser,
        this.myId = this.currentUser.id;
        this.myDisplayName = this.currentUser.displayName,
        this.isMemberXXX = this.currentUser.isMember,
        this.isReader = this.currentUser.isReader,
        this.isEditor = this.currentUser.isEditor
      });
  }


  configureRouter(config: RouterConfiguration, router: Router): void {
    config.title = CV.SITE_NAME_ABBR;
    config.map([
      { route: ['', 'welcome'], moduleId: './views/pages/welcome', name: 'welcome', nav: true, title: 'Home', settings: { data: { isMemberOnly: false } } },
      { route: 'users', moduleId: './views/pages/user-no-selection', name: 'user-no-selection', nav: true, title: 'Team', settings: { data: { isMemberOnly: true } }, xxx: true },
      { route: 'users/:id', moduleId: './views/pages/user-selected', name: 'users', title: 'Team' },
      { route: 'users/:id/:editType', moduleId: './views/pages/user-selected', name: 'user-edit', title: 'Edit' }
      // { route: 'users/add', moduleId: './views/pages/user-add', name: 'user-add', nav: true, title: 'Add User' },
      // { route: 'dialog-demo', name: 'dialog-demo', moduleId: './dialog-demo/dialog-demo', nav: true, title: 'Dialog Demo' }
    ]);

    this.router = router;
  }
}