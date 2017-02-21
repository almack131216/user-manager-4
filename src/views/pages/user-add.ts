import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPIUsers } from '../../api/web-api-users';
import { UserUpdated, UserViewed } from '../../resources/messages';
import { areEqual } from '../../api/utility';
import {bindable,autoinject} from 'aurelia-framework';
import { Router } from 'aurelia-router';
//import {TaskQueue} from 'aurelia-task-queue';

import * as Constants from '../../resources/constants';
const CV = Constants

import {MyGlobals } from '../../my-globals'

interface User {
  firstName: string;
  lastName: string;
  emailAddress: string;
  personalNumber: string;
  lkp_regions_selected: number;
}

@inject(WebAPIUsers,MyGlobals)//TaskQueue
export class UserAdd {
  public CV = CV;
  @bindable user = null;
  @bindable profile = null;
  //@bindable currentUser = null;
  @bindable isReadOnly = null;
  //@bindable myLookups;

  routeConfig;
  originalUser;
  savedData;
  isSavingData;
  
  http: HttpClient
  router: Router
  //taskQueue

  title = 'Edit User'
  title_isReadOnly = 'View User';

  myGlobals
  currentUser

  constructor(private api: WebAPIUsers, private ea: EventAggregator, http: HttpClient, router: Router, myGlobals: MyGlobals) {
    this.api = api;
    this.router = router;
    this.myGlobals = MyGlobals;
    this.currentUser = this.myGlobals.currentUser;
    //this.taskQueue = taskQueue;
  }

  get canSave() {
    return true;// this.profile.regionId && this.profile.hubId && !this.api.isRequesting;
  }

  save() {
    console.log('SAVE... user (' + this.myGlobals.userSelected.id + ')...' + this.api + ' hubId  ' + this.profile.hubId);
    this.isSavingData = true;
    return this.api.saveUserProfile(this.myGlobals.userSelected.id, this.profile)
      .then(savedData => this.savedData = savedData)
      .then(profile => {
        console.log('save this.user: ' + JSON.stringify(this.originalUser));
        console.log('save user: ' + JSON.stringify(this.savedData));
        //this.profile = <User>profile;
        //this.routeConfig.navModel.setTitle(this.user.firstName);
        
        // this.originalUser = JSON.parse(JSON.stringify(this.profile));
        // this.ea.publish(new UserUpdated(this.profile));
        this.isSavingData = false;
      });
      
  }

}