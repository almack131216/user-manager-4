import { autoinject, bindable } from 'aurelia-framework';
import { Lookups } from '../../../resources/lookups';

@autoinject

export class UserPanelConfidential {
    @bindable user;
    @bindable profile;
    @bindable isReadOnly;
    
    lkp_employmentStatuses;
    lkp_credentialLevels;
    tmpField2;
    tmpField3;

    constructor(private lookups: Lookups) {

        this.lkp_employmentStatuses = lookups.lkp_employmentStatuses;
        this.lkp_credentialLevels = lookups.lkp_credentialLevels;

    }

}