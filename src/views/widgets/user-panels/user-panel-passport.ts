
import { bindable } from 'aurelia-framework';

export class UserPanelPassport {
    @bindable user;
    @bindable profile;
    @bindable isReadOnly = null;
<<<<<<< HEAD
    @bindable myLookups;
=======
    
    lkp_passportTypes;
    lkp_passportNationality;

    constructor(private lookups: Lookups) {

        this.lkp_passportTypes = lookups.lkp_passportTypes;

        this.lkp_passportNationality = lookups.lkp_passportNationality

    }

>>>>>>> 5adbb3d24b54c25f384a3239d8f94bb42af2727a
}