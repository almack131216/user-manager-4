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
    editType = null;
    originalUser = null;


    constructor(private api: WebAPIUsers, private ea: EventAggregator) {

        this.api.getUserRole(6).then(user => {
            //alert('? 2' + JSON.stringify(user));
            this.info = <User>user;
            this.userArr = user;
            //this.firstName = this.info.firstName;
            this.firstName = this.info.firstName;
        });
    }

}