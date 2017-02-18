
import { bindable } from 'aurelia-framework';

export class UserPanelVisa {
    @bindable user;
    @bindable profile;
    @bindable isReadOnly = null;
<<<<<<< HEAD
    @bindable myLookups;
=======
    
    lkp_passportNationality;
    lkp_visaCountry;
    lkp_visaTypes;

    constructor(private lookups: Lookups) {

        this.lkp_passportNationality = lookups.lkp_passportNationality

        this.lkp_visaCountry = lookups.lkp_visaCountry

        this.lkp_visaTypes = lookups.lkp_visaTypes

    }

>>>>>>> 5adbb3d24b54c25f384a3239d8f94bb42af2727a
}