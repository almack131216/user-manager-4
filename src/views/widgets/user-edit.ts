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
  phone_number: string;
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
    // this.editUser.push({name:'first_name', model:'user.first_name', label: 'First Nameee'});
    // this.editUser.push({name:'last_name', model:'user.last_name', label: 'Las Nameee'});
    // this.editUser.push({name:'email', model:'email', label: 'Emaileee'});
    // this.editUser.push({name:'phone_number', model:'phone_number', label: 'Phoneee'});
  }

  activate(params, routeConfig) {
    //this.routeConfig = routeConfig;
    // console.log('activate: ' + params.id);
    // return this.api.getUserDetails(params.id).then(user => {
    //   this.user = <User>user;
    //   this.routeConfig.navModel.setTitle(this.user.first_name);
    //   this.originalUser = JSON.parse(JSON.stringify(this.user));
    //   this.ea.publish(new UserViewed(this.user));
    // });
  }

  // constructor() {
  //   this.editUser.push({name:'first_name', model:'user.first_name', label: 'First Nameee'});
  //   this.editUser.push({name:'last_name', model:'user.last_name', label: 'Las Nameee'});
  //   this.editUser.push({name:'email', model:'email', label: 'Emaileee'});
  //   this.editUser.push({name:'phone_number', model:'phone_number', label: 'Phoneee'});
  // }

  get canSave() {
    return this.user.first_name && this.user.last_name && !this.api.isRequesting;
  }

  save() {
    this.api.saveUser(this.user).then(user => {
      console.log('save this.user: ' + JSON.stringify(this.user));
      console.log('save user: ' + JSON.stringify(user));
      this.user = <User>user;
      //this.routeConfig.navModel.setTitle(this.user.first_name);
      this.originalUser = JSON.parse(JSON.stringify(this.user));
      this.ea.publish(new UserUpdated(this.user));
    });
  }

  canDeactivate() {
    if (!areEqual(this.originalUser, this.user)) {
      let result = confirm('You have unsaved changes. Are you sure you wish to leave?');

      if (!result) {
        this.ea.publish(new UserViewed(this.user));
      }

      return result;
    }

    return true;
  }
}