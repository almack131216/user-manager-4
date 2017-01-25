import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPIUsers } from '../../api/web-api-users';
import { UserUpdated, UserViewed } from '../../resources/messages';
import { areEqual } from '../../api/utility';

interface User {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

@inject(Element)
export class UserAdd {
  
  user: User;
  originalUser: User;
  title = 'Add User'
  newUser = [];

  constructor(private api: WebAPIUsers, private ea: EventAggregator) {
    this.newUser.push({name:'first_name', val:'user.first_name', label: 'First Nameee'});
    this.newUser.push({name:'last_name', val:'user.last_name', label: 'Las Nameee'});
    this.newUser.push({name:'email', val:'user.email', label: 'Emaileee'});
    this.newUser.push({name:'phone_number', val:'user.phone_number', label: 'Phoneee'});
  }

}