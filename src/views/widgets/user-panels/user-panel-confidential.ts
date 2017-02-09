import { autoinject, bindable } from 'aurelia-framework';
import { Lookups } from '../../../resources/lookups';

@autoinject

export class UserPanelConfidential {
    @bindable user;
    lkp_userProfiles;
    lkp_credentialLevels;

    constructor(private lookups: Lookups) {

        this.lkp_userProfiles = lookups.lkp_userProfiles;
        this.lkp_credentialLevels = lookups.lkp_credentialLevels;

    }

}