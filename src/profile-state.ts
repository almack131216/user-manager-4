import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import { inject, autoinject } from 'aurelia-framework';
import { WebAPIUsers } from './api/web-api-users';
// import * as Constants from './resources/constants';
// const CV = Constants
import {HttpClient} from 'aurelia-http-client'; 
const profileUrl = 'src/api/api-global.json';

@inject(HttpClient,WebAPIUsers)
export class ProfileState {
  //public CV = CV;
  public loggedInUser = null;
  currentUser2;
  myId2;
  myDisplayName2;
  isReader2;
  isMember2;
  isEditor2;
  router;
  tmp;
   http;
   repos2;

  constructor(http,api: WebAPIUsers, router: Router) {
    this.http = http;
    //this.api = api;

    return this.http.get(profileUrl)
      .then(response => {
        this.repos2 = response.content,
        this.currentUser2 = response.content.currentUser,
              this.myId2 = this.currentUser2.id;
              this.myDisplayName2 = this.currentUser2.displayName,
              this.isMember2 = this.currentUser2.isMember,
              this.isReader2 = this.currentUser2.isReader,        
              this.isEditor2 = this.currentUser2.isEditor
        /*
        this.repos = response.content
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        */
      });
  }

}