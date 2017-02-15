import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPIUsers } from '../../api/web-api-users';
import { UserUpdated, UserViewed } from '../../resources/messages';
import { areEqual } from '../../api/utility';
import {bindable,autoinject} from 'aurelia-framework';

interface User {
  firstName: string;
  lastName: string;
  emailAddress: string;
  personalNumber: string;
  lkp_regions_selected: number;
}

@inject(WebAPIUsers)
export class UserAdd {
  @bindable user = null;
  @bindable profile = null;
  routeConfig;
  originalUser;
  savedData;
  
  title = 'Edit User'

  constructor(private api: WebAPIUsers, private ea: EventAggregator) {
    this.api = api;
  }

  get canSave() {
    return this.profile.regionId && this.profile.hubId && !this.api.isRequesting;
  }

  save() {
    console.log('SAVE... ' + this.api + ' > ' + this.user + ' / ' + this.profile);

    return this.api.saveUserProfile(this.user.user.id, this.profile)
      .then(savedData => this.savedData = savedData)
      .then(profile => {
        console.log('save this.user: ' + JSON.stringify(this.originalUser));
        console.log('save user: ' + JSON.stringify(this.savedData));
        //this.profile = <User>profile;
        //this.routeConfig.navModel.setTitle(this.user.firstName);
        
        // this.originalUser = JSON.parse(JSON.stringify(this.profile));
        // this.ea.publish(new UserUpdated(this.profile));
      });
  }

}