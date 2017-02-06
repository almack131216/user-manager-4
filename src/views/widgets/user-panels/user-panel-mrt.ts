import { autoinject,bindable } from 'aurelia-framework';
import { Lookups } from '../../../resources/lookups';
@autoinject

export class UserPanelMrt {
    @bindable user;
    public lkp_member_status;
    public lkp_vest_colour;
    public lkp_languages;
    public lkp_languageLevel;
    public lkp_languages_limitTo = 5;


    constructor(lookups:Lookups) {
        this.lkp_member_status = lookups.lkp_member_status

        this.lkp_vest_colour = lookups.lkp_vest_colour

        this.lkp_languages = lookups.lkp_languages

        this.lkp_languageLevel = lookups.lkp_languageLevel
    }

}