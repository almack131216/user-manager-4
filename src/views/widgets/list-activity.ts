import { inject, bindable } from 'aurelia-framework';
import { MyNav } from '../../my-nav';

@inject(MyNav)
export class listActivity {
    @bindable title
    @bindable custXc = true
    @bindable custXcId = 'activityList'
    @bindable custXcExpanded = false

    @bindable currentUser
    @bindable apiData;//receive data to populate table

    myNav

    constructor(myNav: MyNav) {
        this.myNav = myNav;
    }

    filters = [
        { value: '', keys: ['displayName', 'emailAddress'] },
        { value: 'true', keys: ['isMember'] },
        { value: '', keys: ['isActive'] }
    ];

}