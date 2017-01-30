import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPIUsers } from '../../api/web-api-users';
import { UserUpdated, UserViewed } from '../../resources/messages';
import { areEqual } from '../../api/utility';
import {bindable,autoinject} from 'aurelia-framework';

interface User {
  first_name: string;
  last_name: string;
  email: string;
  cell_number: string;
  sel_region_selected: number;
}


@inject(Element)
export class UserAdd {
  @bindable user = null;
  routeConfig;
  originalUser;

  title = 'Add User'
  newUser = [];

  constructor(private api: WebAPIUsers, private ea: EventAggregator) {
    this.newUser.push({name:'first_name', val:'user.first_name', label: 'First Nameee'});
    this.newUser.push({name:'last_name', val:'user.last_name', label: 'Las Nameee'});
    this.newUser.push({name:'email', val:'user.email', label: 'Emaileee'});
    this.newUser.push({name:'cell_number', val:'user.cell_number', label: 'Phoneee'});
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