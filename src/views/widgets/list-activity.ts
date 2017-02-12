import { bindable } from 'aurelia-framework';

export class listActivity {
    @bindable title;

    @bindable custXc = true;
    @bindable custXcId = 'activityList';
    @bindable custXcExpanded = false;

    @bindable apiData;
}