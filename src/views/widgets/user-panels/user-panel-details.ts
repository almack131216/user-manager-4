import { autoinject, bindable } from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants
@autoinject

export class UserPanelDetails {
    @bindable user;
    @bindable profile;
    @bindable isReadOnly;
<<<<<<< HEAD
    @bindable myLookups;

    public CV = CV;

    tmpShowLookupsDebug = false;
    
=======
    public CV = CV;

    tmpShowLookupsDebug = false;

    public lkp_regions;
    lkp_hub;
    lkp_segment;
    lkp_entity;
    lkp_primaryPositions;
    lkp_secondaryPositions;
    lkp_bp_office_address;
    lkp_coatSizes;    

    constructor(private lookups:Lookups) {
        this.lkp_regions = lookups.lkp_regions

        this.lkp_hub = lookups.lkp_hub

        this.lkp_segment = lookups.lkp_segment

        this.lkp_entity = lookups.lkp_entity        

        this.lkp_primaryPositions = lookups.lkp_primaryPositions

        this.lkp_secondaryPositions = lookups.lkp_secondaryPositions        

        this.lkp_bp_office_address = lookups.lkp_bp_office_address

        this.lkp_coatSizes = lookups.lkp_coatSizes
    }

    activate(lookups){
        
    }
>>>>>>> 5adbb3d24b54c25f384a3239d8f94bb42af2727a
}