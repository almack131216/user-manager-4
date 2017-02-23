import { bindable, autoinject, inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPIUsers } from '../../api/web-api-users';
import { UserUpdated, UserViewed } from '../../resources/messages';
import { areEqual } from '../../api/utility';

import * as Constants from '../../resources/constants';
const CV = Constants

import { MyGlobals } from '../../my-globals'
import { MyNav } from '../../my-nav';

import toastr = require('toastr');

@autoinject
// @inject(WebAPIUsers, MyGlobals)//TaskQueue
export class UserAdd {
  public CV = CV;
  //@bindable user = null;
  //@bindable profile = null;
  //@bindable currentUser = null;
  @bindable isReadOnly = null;
  //@bindable myLookups;

  routeConfig;
  originalUser;
  savedData;
  isSavingData;

  http: HttpClient
  myNav: MyNav
  //taskQueue

  title = 'Edit User'
  title_isReadOnly = 'View User';

  myGlobals  
  currentUser

  constructor(private api: WebAPIUsers, private ea: EventAggregator, http: HttpClient, myGlobals: MyGlobals, myNav: MyNav) {
    this.api = api;
    this.myGlobals = MyGlobals;

    this.myNav = myNav;
    this.currentUser = this.myGlobals.currentUser;
    //this.taskQueue = taskQueue;
  }

  // testToastr(){
  //   console.log('TOASTR created');
  //   toastr.info('blah 2');
  // }

  attached(){

  }

  get canSave() {
    return true;// this.profile.regionId && this.profile.hubId && !this.api.isRequesting;
  }

  // canDeactivate() {
  //     if(!this.isPristine()) {
  //         var result = confirm('Do you really want to discard your changes?');
  //         return result;
  //     }
  //   };

  save() {
    console.log('SAVE... user (' + this.myGlobals.userSelected.id + ')...' + this.api + ' hubId  ' + this.myGlobals.profileSelected.hubId);
    this.isSavingData = true;
    return this.api.apiCall('save-user', this.myGlobals.userSelected.id, this.myGlobals.profileSelected)
      .then(savedData => this.savedData = savedData)
      .then(profile => {
        console.log('SUCCESSFULLY saved user: ' + JSON.stringify(this.myGlobals.profileSelected));
        //this.profile = <User>profile;
        //this.routeConfig.navModel.setTitle(this.user.firstName);

        // this.originalUser = JSON.parse(JSON.stringify(this.profile));
        // this.ea.publish(new UserUpdated(this.profile));
        this.isSavingData = false;
      });

  }

}