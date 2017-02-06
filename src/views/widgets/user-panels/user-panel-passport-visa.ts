
import { autoinject, bindable } from 'aurelia-framework';
import { Lookups } from '../../../resources/lookups';

@autoinject

export class UserPanelPassportVisa {
    @bindable user;
    lkp_passport_type;
    lkp_passport_nationality;
    lkp_visa_country;
    lkp_visa_type;

    constructor(private lookups: Lookups) {

        this.lkp_passport_type = lookups.lkp_passport_type;

        this.lkp_passport_nationality = lookups.lkp_passport_nationality

        this.lkp_visa_country = lookups.lkp_visa_country

        this.lkp_visa_type = lookups.lkp_visa_type

    }

}