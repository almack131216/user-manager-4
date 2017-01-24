import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPIUsers } from '../../api/web-api-users';
import { UserUpdated, UserViewed } from '../../resources/messages';
import { areEqual } from '../../api/utility';
import 'bootstrap';
import * as $ from 'bootstrap';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

@inject(Element)
export class UserAdd {
  
  user: User;
  originalUser: User;
  title = 'Add User'
  newUser = [];

  constructor(private api: WebAPIUsers, private ea: EventAggregator) {
    this.newUser.push({name:'firstName', val:'user.firstName', label: 'First Nameee'});
    this.newUser.push({name:'latName', val:'latName', label: 'Las Nameee'});
    this.newUser.push({name:'email', val:'email', label: 'Emaileee'});
    this.newUser.push({name:'phoneNumber', val:'phoneNumber', label: 'Phoneee'});
  }

  xc_all(getState){
    console.log(getState);
    if(getState=='expand') $('.collapse').addClass('in');
    if(getState=='collapse') $('.collapse').removeClass('in');
  }

}