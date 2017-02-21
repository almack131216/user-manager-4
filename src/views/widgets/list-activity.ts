import { inject, bindable } from 'aurelia-framework';
import { WebAPIUsers } from '../../api/web-api-users';

@inject(WebAPIUsers)
export class listActivity {
    @bindable title

    @bindable custXc = true
    @bindable custXcId = 'activityList'
    @bindable custXcExpanded = false

    @bindable apiData

    constructor(private api: WebAPIUsers) {

    }

}