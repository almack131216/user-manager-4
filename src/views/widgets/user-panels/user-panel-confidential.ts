import { bindable } from 'aurelia-framework';

export class UserPanelConfidential {
    @bindable user;
    @bindable profile;
    @bindable isReadOnly;
    @bindable myLookups;
    
    // lkp_employmentStatuses;
    lkp_credentialLevels;
    tmpField2;
    tmpField3;

}