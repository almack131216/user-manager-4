
import { autoinject, bindable } from 'aurelia-framework';
import { Lookups } from '../../../resources/lookups';

@autoinject

export class UserPanelVisa {
    @bindable user;
    lkp_visaCountry;
    lkp_visaTypes;

    constructor(private lookups: Lookups) {

        this.lkp_visaCountry = lookups.lkp_visaCountry

        this.lkp_visaTypes = lookups.lkp_visaTypes

    }

}