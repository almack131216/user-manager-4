
import { autoinject, bindable } from 'aurelia-framework';
import { Lookups } from '../../../resources/lookups';

@autoinject

export class UserPanelPassport {
    @bindable user;
    lkp_passportTypes;
    lkp_passportNationality;

    constructor(private lookups: Lookups) {

        this.lkp_passportTypes = lookups.lkp_passportTypes;

        this.lkp_passportNationality = lookups.lkp_passportNationality

    }

}