import { Router, RouterConfiguration } from 'aurelia-router';
import { inject, autoinject } from 'aurelia-framework';
import * as Constants from './resources/constants';
const CV = Constants

import {FetchConfig} from 'aurelia-auth';

import {ProfileState} from './profile-state';
import { WebAPIUsers } from './api/web-api-users';
import { EventAggregator } from 'aurelia-event-aggregator';

import {HttpClient} from 'aurelia-http-client';  

const reposUrl = 'https://api.github.com/orgs/aurelia/repos';
const profileUrl = 'src/api/api-global.json';

@inject(HttpClient,Router,FetchConfig,ProfileState)

export class App {
  repos = null;
  router: Router
  fetchConfig: FetchConfig
  public CV = CV  
  http;
  isMember = false;
  myProfile;

  constructor(http) {
    this.http = http;
    //alert( 'repos' + JSON.stringify(this.repos))
    //alert(http);
  }

  activate() {
    // return a Promise that will resolve when the repos have
    // been loaded and sorted by star count.
    return this.http.get(profileUrl)
      .then(response => {
        this.repos = response.content,
        this.myProfile = response.content[0].currentUser,
        this.isMember = response.content[0].currentUser.isMember;
        /*
        this.repos = response.content
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        */
      });
  }

  // constructor(private api: WebAPIUsers, private ea: EventAggregator, private appState: ProfileState) {
  //   this.appState = appState;
  //   if (CV.debugConsoleLog) console.log('app.ts | const ' + JSON.stringify(appState) );
  // }

  // async attached(appState){
  //   //alert('app.ts | created');
  //   alert('app.ts | created: ' + JSON.stringify(this.appState) );
  //   if(this.appState.myProfile) this.isMember = this.appState.myProfile.currentUser.isMember;
  // }

  //activate(){
    //this.fetchConfig.configure();
  //}

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