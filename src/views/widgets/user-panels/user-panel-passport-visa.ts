
import { autoinject, bindable } from 'aurelia-framework';
import { Lookups } from '../../../resources/lookups';

@autoinject

export class UserPanelPassportVisa {
    @bindable user;
    lkp_passport_types;
    lkp_passport_nationalities;
    lkp_visa_countries;
    lkp_visa_types;

    constructor(private lookups: Lookups) {

        this.lkp_passport_types = lookups.lkp_passport_types;

        this.lkp_passport_nationalities = lookups.lkp_passport_nationalities

        this.lkp_visa_countries = lookups.lkp_visa_countries

        this.lkp_visa_types = lookups.lkp_visa_types

    }

}