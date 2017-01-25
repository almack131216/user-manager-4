import {bindable,autoinject} from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPIUsers } from '../../api/web-api-users';
import { UserUpdated, UserViewed } from '../../resources/messages';
import { areEqual } from '../../api/utility';

interface User {
  first_name: string;
  last_name: string;
  email: string;
  cell_number: string;
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
    return this.user.first_name && this.user.last_name && !this.api.isRequesting;
  }

  save() {
    this.api.saveUser(this.user).then(user => {
      console.log('save this.user: ' + JSON.stringify(this.originalUser));
      console.log('save user: ' + JSON.stringify(user));
      this.user = <User>user;
      //this.routeConfig.navModel.setTitle(this.user.first_name);
      this.originalUser = JSON.parse(JSON.stringify(this.user));
      this.ea.publish(new UserUpdated(this.user));
    });
  }

}