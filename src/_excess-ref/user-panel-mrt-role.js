import { autoinject, bindable } from 'aurelia-framework';
import { Lookups } from '../../../resources/lookups';

@autoinject
export class UserPanelMrtRole {
    @bindable user;
    lkp_coatSizes;
    lkp_primaryPositions;
    lkp_secondaryPositions;

    constructor(lookups:Lookups) {
        this.lkp_coatSizes = lookups.lkp_coatSizes

        this.lkp_primaryPositions = lookups.lkp_primaryPositions

        this.lkp_secondaryPositions = lookups.lkp_secondaryPositions;
    }

}