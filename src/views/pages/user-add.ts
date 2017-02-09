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


@inject(Element)
export class UserAdd {
  @bindable user = null;
  routeConfig;
  originalUser;
  
  title = 'Edit User'

  constructor(private api: WebAPIUsers, private ea: EventAggregator) {

  }

  get canSave() {
    return this.user.firstName && this.user.lastName && !this.api.isRequesting;
  }

  save() {
    this.api.saveUser(this.user).then(user => {
      console.log('save this.user: ' + JSON.stringify(this.originalUser));
      console.log('save user: ' + JSON.stringify(user));
      this.user = <User>user;
      //this.routeConfig.navModel.setTitle(this.user.firstName);
      this.originalUser = JSON.parse(JSON.stringify(this.user));
      this.ea.publish(new UserUpdated(this.user));
    });
  }

}