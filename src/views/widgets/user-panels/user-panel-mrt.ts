import { autoinject,bindable } from 'aurelia-framework';
import { Lookups } from '../../../resources/lookups';
@autoinject

export class UserPanelMrt {
    @bindable user;
    public lkp_member_status;
    public lkp_coatSizes;
    public lkp_languages;
    public lkp_languageLevel;
    public lkp_languages_limitTo = 5;


    constructor(lookups:Lookups) {
        this.lkp_member_status = lookups.lkp_member_status

        this.lkp_coatSizes = lookups.lkp_coatSizes

        this.lkp_languages = lookups.lkp_languages

        this.lkp_languageLevel = lookups.lkp_languageLevel
    }

}