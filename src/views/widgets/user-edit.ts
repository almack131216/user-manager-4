import {bindable,autoinject} from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPIUsers } from '../../api/web-api-users';
import { UserUpdated, UserViewed } from '../../resources/messages';
import { areEqual } from '../../api/utility';

interface User {
  firstName: string;
  lastName: string;
  emailAddress: string;
  personalNumber: string;
}

@inject(WebAPIUsers, EventAggregator)
export class UserEdit {
  @bindable user = null;
  routeConfig;
  originalUser: User;

  title = 'Edit'
  editUser = [];
  editUserVals = [];

  constructor(private api: WebAPIUsers, private ea: EventAggregator) {

  }

  created(){
    console.log('created: ' + this.user);
    this.originalUser = JSON.parse(JSON.stringify(this.user));
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