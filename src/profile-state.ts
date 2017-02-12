import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import { inject, autoinject } from 'aurelia-framework';
import { WebAPIUsers } from './api/web-api-users';
import * as Constants from './resources/constants';
const CV = Constants
import {HttpClient} from 'aurelia-http-client'; 
const profileUrl = 'src/api/api-global.json';

@inject(HttpClient,WebAPIUsers)
export class ProfileState {
  public CV = CV;
  public loggedInUser = null;
  myProfile;
  isMember;
  router;
  tmp;
   http;
   repos;

  constructor(http,public api: WebAPIUsers, router: Router) {
    this.http = http;

    

    // this.api.getGlobal().then(myProfile => {
    //   this.myProfile = myProfile;
    //   if (CV.debugConsoleLog) console.log('application-status.ts | constructor : ' + JSON.stringify(myProfile) );
    //   //this.isMember = myProfile['currentUser'].isMember;

    //   if(this.isMember){
    //         if (CV.debugConsoleLog) console.log('application-status.ts | isMember | yup!');
    //     }else{
    //         if (CV.debugConsoleLog) console.log('application-status.ts | isMember | naaaaaaah!');
    //     }

    // });

    //alert('attct');
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

}