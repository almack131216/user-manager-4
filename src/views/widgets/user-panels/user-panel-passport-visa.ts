
import { autoinject, bindable } from 'aurelia-framework';
import { Lookups } from '../../../resources/lookups';

@autoinject

export class UserPanelPassportVisa {
    @bindable user;
    lkp_passportTypes;
    lkp_passportNationality;
    lkp_visaCountry;
    lkp_visaTypes;

    constructor(private lookups: Lookups) {

        this.lkp_passportTypes = lookups.lkp_passportTypes;

        this.lkp_passportNationality = lookups.lkp_passportNationality

        this.lkp_visaCountry = lookups.lkp_visaCountry

        this.lkp_visaTypes = lookups.lkp_visaTypes

    }

}