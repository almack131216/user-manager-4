import { noView, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPIUsers } from '../api/web-api-users';
import { UserUpdated, UserViewed } from '../resources/messages';

interface User {
    first_name: string;
    last_name: string;
    email: string;
    cell_number: string;
    lkp_region_selected: number;
}

@inject(WebAPIUsers, EventAggregator)

@noView
export class UserInfoRole {
    userArr = null;
    first_name: string = "";
    last_name: string = "";
    email: string = "";
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
            //this.first_name = this.info.first_name;
            this.first_name = this.info.first_name;
        });
    }

}