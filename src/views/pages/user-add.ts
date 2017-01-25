import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPIUsers } from '../../api/web-api-users';
import { UserUpdated, UserViewed } from '../../resources/messages';
import { areEqual } from '../../api/utility';
import {bindable,autoinject} from 'aurelia-framework';


@inject(Element)
export class UserAdd {  
  @bindable user;
  title = 'Add User'
  newUser = [];

  constructor(private api: WebAPIUsers, private ea: EventAggregator) {
    this.newUser.push({name:'first_name', val:'user.first_name', label: 'First Nameee'});
    this.newUser.push({name:'last_name', val:'user.last_name', label: 'Las Nameee'});
    this.newUser.push({name:'email', val:'user.email', label: 'Emaileee'});
    this.newUser.push({name:'cell_number', val:'user.cell_number', label: 'Phoneee'});
  }

}