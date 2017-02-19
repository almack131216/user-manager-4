import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPIUsers } from '../../api/web-api-users';
import { UserUpdated, UserViewed } from '../../resources/messages';
import { areEqual } from '../../api/utility';
import {bindable,autoinject} from 'aurelia-framework';
import { Router } from 'aurelia-router';

import * as Constants from '../../resources/constants';
const CV = Constants

interface User {
  firstName: string;
  lastName: string;
  emailAddress: string;
  personalNumber: string;
  lkp_regions_selected: number;
}

@inject(WebAPIUsers)
export class UserAdd {
  public CV = CV;
  @bindable user = null;
  @bindable profile = null;
  @bindable currentUser = null;
  @bindable isReadOnly = null;
  @bindable myLookups;

  routeConfig;
  originalUser;
  savedData;
  isSavingData;
  
  http: HttpClient
  router: Router;

  title = 'Edit User'
  title_isReadOnly = 'View User';

  constructor(private api: WebAPIUsers, private ea: EventAggregator, http: HttpClient, router: Router) {
    this.api = api;
    this.router = router;
  }

  get canSave() {
    return true;// this.profile.regionId && this.profile.hubId && !this.api.isRequesting;
  }

  save() {
    console.log('SAVE... user (' + this.user.user.id + ')...' + this.api + ' hubId  ' + this.profile.hubId);
    this.isSavingData = true;
    return this.api.saveUserProfile(this.user.user.id, this.profile)
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

  navigateToEditThisPage(getId){    
    var getUrl = 'users/' + getId + '/edit';
    this.isReadOnly = false;
    //alert( getUrl );
    //user-edit; params.bind: {id:user.id, editType:'edit'}
    //this.router.navigateToRoute('user-edit', {id: getId, editType:'edit'} );//"users/5/edit"
    //this.router.navigate( 'users/' + getId + '/edit' );//"users/5/edit"
    //this.router.navigate('user-edit', {id: getId, editType:'edit', replace: true, force: true} );
    //this.router.refreshNavigation()
  }
}