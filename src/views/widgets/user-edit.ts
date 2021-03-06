import {bindable,autoinject} from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPIUsers } from '../../api/web-api-users';
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

  title = 'Edit'
  editUser = [];
  editUserVals = [];

  constructor(private api: WebAPIUsers, private ea: EventAggregator) {

  }

  created(){
    console.log('created: ' + this.user);
  }

}