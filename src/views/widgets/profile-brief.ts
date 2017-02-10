import { bindable } from 'aurelia-framework';

export class ProfileBrief {
    title = 'My Profile';

    @bindable custXc = false;
    @bindable custXcId = 'profileBriefList';
    @bindable custXcExpanded = true;

    @bindable memberArr;
}