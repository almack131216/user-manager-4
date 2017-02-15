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

  

}