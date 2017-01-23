import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPIUsers } from '../../api/web-api-users';
import { UserUpdated, UserViewed } from '../../resources/messages';
import { areEqual } from '../../api/utility';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

@inject(WebAPIUsers, EventAggregator)
export class UserSelected {
  routeConfig;
  user: User;
  originalUser: User;
  title = ''

  constructor(private api: WebAPIUsers, private ea: EventAggregator) {

  }

  activate(params, routeConfig) {
    this.routeConfig = routeConfig;
    console.log('activate: ' + params.id);
    return this.api.getUserDetails(params.id).then(user => {
      this.user = <User>user;
      this.routeConfig.navModel.setTitle(this.user.firstName);
      this.originalUser = JSON.parse(JSON.stringify(this.user));
      this.ea.publish(new UserViewed(this.user));
    });
  }

  get canSave() {
    return this.user.firstName && this.user.lastName && !this.api.isRequesting;
  }

  save() {
    this.api.saveUser(this.user).then(user => {
      this.user = <User>user;
      this.routeConfig.navModel.setTitle(this.user.firstName);
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