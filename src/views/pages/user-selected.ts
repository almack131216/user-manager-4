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
  lkp_regions_selected: number;
}

@inject(WebAPIUsers, EventAggregator)
export class UserSelected {
  routeConfig;
  user: User;
  editType = null;
  originalUser: User;
  title = ''

  constructor(private api: WebAPIUsers, private ea: EventAggregator) {

  }

  activate(params, routeConfig) {
    this.routeConfig = routeConfig;
    console.log('activate: ' + params.id + ' (' + params.editType + ')');
    return this.api.getUserDetails(params.id).then(user => {
      if(params.editType) this.editType = params.editType;
      this.user = <User>user;
      this.routeConfig.navModel.setTitle(this.user.firstName);
      this.originalUser = JSON.parse(JSON.stringify(this.user));
      this.ea.publish(new UserViewed(this.user));
    });
  }

  canDeactivate() {
    // if (!areEqual(this.originalUser, this.user)) {
    //   let result = confirm('You have unsaved changes. Are you sure you wish to leave?');

    //   if (!result) {
    //     this.ea.publish(new UserViewed(this.user));
    //   }

    //   return result;
    // }
    // return true;
  }

}