import { noView, inject } from 'aurelia-framework';
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
export class UserInfoRole {
    userArr = null;
    firstName: string = "";
    lastName: string = "";
    emailAddress: string = "";
    city: string = "";
    country: string = "";

    routeConfig;
    user = null;
    info = null;
    pageType = null;
    originalUser = null;


    constructor(private api: WebAPIUsers, private ea: EventAggregator) {

    }

}