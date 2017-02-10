import { autoinject, bindable } from 'aurelia-framework';
import { Lookups } from '../../../resources/lookups';

@autoinject

export class UserPanelConfidential {
    @bindable user;
    lkp_memberStatus;
    lkp_userProfiles;
    lkp_credentialLevels;
    tmpMemberStatus = 1;
    tmpField2;
    tmpField3;

    constructor(private lookups: Lookups) {

        this.lkp_memberStatus = lookups.lkp_memberStatus;
        this.lkp_userProfiles = lookups.lkp_userProfiles;
        this.lkp_credentialLevels = lookups.lkp_credentialLevels;

    }

}