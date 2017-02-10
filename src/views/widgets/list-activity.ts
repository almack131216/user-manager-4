import { bindable } from 'aurelia-framework';

export class listActivity {
    title = 'Recent Changes';
    title2 = 'History';

    @bindable custXc = true;
    @bindable custXcId = 'activityList';
    @bindable custXcExpanded = true;
}