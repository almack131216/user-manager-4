import { bindable } from 'aurelia-framework';

export class UserPanelLanguages {
    @bindable user;
    @bindable profile;
    @bindable isReadOnly;
    @bindable myLookups;
    lkp_languages_limitTo = 5;
}