import { noView } from 'aurelia-framework';

import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPIUsers } from '../api/web-api-users';
import { UserUpdated, UserViewed } from '../resources/messages';

interface User {
    firstName: string;
    lastName: string;
    emailAddress: string;
    personalNumber: string;
    lkp_regions_selected: number;
}

@inject(WebAPIUsers, EventAggregator)

@noView
export class UserInfo {

    firstName: string = "";
    lastName: string = "";
    emailAddress: string = "";
    city: string = "";
    country: string = "";

    routeConfig;
    user = null;
    info = null;
    editType = null;
    originalUser = null;


    constructor(private api: WebAPIUsers, private ea: EventAggregator) {

    }

    created(params, routeConfig) {
    console.log('activateeeeeeeeeee: ' + params.id + ' (' + params.editType + ')');
  }

}