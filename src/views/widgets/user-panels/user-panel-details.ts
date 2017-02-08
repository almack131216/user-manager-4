import { autoinject, bindable } from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants
import { Lookups } from '../../../resources/lookups';
@autoinject

export class UserPanelDetails {
    @bindable user;
    public CV = CV;

    public lkp_region;
    public lkp_hub;
    public lkp_segment;
    public lkp_entity;
    public lkp_bp_office_address;

    public regionId;

    constructor(lookups:Lookups) {
        this.lkp_region = lookups.lkp_region

        this.lkp_hub = lookups.lkp_hub

        this.lkp_segment = lookups.lkp_segment

        this.lkp_entity = lookups.lkp_entity

        this.lkp_bp_office_address = lookups.lkp_bp_office_address

        this.regionId = 'regionId'
    }
}