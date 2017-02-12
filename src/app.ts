import { Router, RouterConfiguration } from 'aurelia-router';
import { inject, autoinject } from 'aurelia-framework';
import { WebAPI } from './api/web-api';
import * as Constants from './resources/constants';
const CV = Constants

import {FetchConfig} from 'aurelia-auth';

import {ApplicationState} from './application-state';
import { WebAPIUsers } from './api/web-api-users';

@inject(WebAPI,Router,FetchConfig,ApplicationState)

export class App {
  api: WebAPI
  router: Router
  fetchConfig: FetchConfig
  isMember;
  public CV = CV  

  constructor(private appState: ApplicationState) {
    this.appState = appState;
    //this.isMember = this.appState.isMember;
    //this.isMember = this.appState.myProfile.currentUser.isMember;
    alert('app.ts | const: ' + JSON.stringify(this.appState) );
    // this.router = router;
    // this.fetchConfig = fetchConfig;
  }

   created(appState){
    alert('app.ts | created -> appState: ' + JSON.stringify(this.appState) );
    //this.isMember = this.appState.myProfile.currentUser.isMember;
    //alert('isMember: ' + this.isMember );
  }

  activate(){
    //this.fetchConfig.configure();
  }

  configureRouter(config: RouterConfiguration, router: Router): void {
    config.title = CV.SITE_NAME_ABBR;
    config.map([
      { route: ['','welcome'], moduleId: './views/pages/welcome', name: 'welcome', nav: true, title: 'Home' },
      { route: 'users', moduleId: './views/pages/user-no-selection', name: 'user-no-selection', nav: true, title: 'Team' },
      { route: 'users/:id', moduleId: './views/pages/user-selected', name: 'users', title: 'Team' },
      { route: 'users/:id/:editType', moduleId: './views/pages/user-selected', name: 'user-edit', title: 'Edit' }
      // { route: 'users/add', moduleId: './views/pages/user-add', name: 'user-add', nav: true, title: 'Add User' },
      // { route: 'dialog-demo', name: 'dialog-demo', moduleId: './dialog-demo/dialog-demo', nav: true, title: 'Dialog Demo' }
    ]);

    this.router = router;
  }
}