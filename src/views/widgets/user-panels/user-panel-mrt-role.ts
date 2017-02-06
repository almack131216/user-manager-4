import { autoinject, bindable } from 'aurelia-framework';
import { Lookups } from '../../../resources/lookups';

@autoinject
export class UserPanelMrtRole {
    @bindable user;
    lkp_mrt_1_ics;
    lkp_mrt_2_ics;

    constructor(lookups:Lookups) {
        this.lkp_mrt_1_ics = lookups.lkp_mrt_1_ics

        this.lkp_mrt_2_ics = lookups.lkp_mrt_2_ics;
    }

}