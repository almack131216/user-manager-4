import { inject, bindable } from 'aurelia-framework';
import { WebAPIUsers } from '../../api/web-api-users';//maybeExcess
import { MyNav } from '../../my-nav';

@inject(WebAPIUsers,MyNav)
export class listActivity {
    @bindable title
    @bindable custXc = true
    @bindable custXcId = 'activityList'
    @bindable custXcExpanded = false

    @bindable apiData;//receive data to populate table

    myNav

    constructor(private api: WebAPIUsers, myNav: MyNav) {
        this.myNav = myNav;
    }

}