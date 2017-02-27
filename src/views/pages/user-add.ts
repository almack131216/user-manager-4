import { bindable, autoinject, inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPIUsers } from '../../api/web-api-users';
import { areEqual } from '../../api/utility';
import { Router } from 'aurelia-router';

import * as Constants from '../../resources/constants';
const CV = Constants

import { MyGlobals } from '../../my-globals'
import { MyNav } from '../../my-nav';

@autoinject
export class UserAdd {
  public CV = CV;

  @bindable isReadOnly = null

  routeConfig;
  savedData;
  isSavingData;

  http: HttpClient
  myNav: MyNav
  router: Router

  title = CV.myTitles.EditUser
  title_isReadOnly = CV.myTitles.ViewUser

  myGlobals  
  currentUser

  constructor(private api: WebAPIUsers, private ea: EventAggregator, http: HttpClient, myGlobals: MyGlobals, myNav: MyNav, router: Router) {
    this.api = api;
    this.myGlobals = MyGlobals;

    this.myNav = myNav;
    this.currentUser = this.myGlobals.currentUser;
    this.router = router
    //this.taskQueue = taskQueue;
  }

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
    console.log('SAVE... user (' + this.myGlobals.userSelected.id + ')...' + this.api + ' hubId  ' + this.myGlobals.profileSelected);
    this.isSavingData = true;

    return this.api.apiCall('save-user', this.myGlobals.userSelected.id, this.myGlobals.profileSelected)
      .then(savedData => this.savedData = savedData)
      .then(profile => {
        console.log('SUCCESSFULLY saved user: ' + JSON.stringify(this.myGlobals.profileSelected));
        this.isSavingData = false;
        if(this.currentUser.isEditor || this.currentUser.isReader) this.router.navigate('users');
      });

  }

}