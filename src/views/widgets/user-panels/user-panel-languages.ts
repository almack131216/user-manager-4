import { bindable } from 'aurelia-framework';

export class UserPanelLanguages {
    @bindable user;
    @bindable profile;
    @bindable isReadOnly;
<<<<<<< HEAD
    @bindable myLookups;
    lkp_languages_limitTo = 5;
=======
    
    public lkp_languages;
    public lkp_languageLevel;
    public lkp_languages_limitTo = 5;


    constructor(lookups:Lookups) {

        this.lkp_languages = lookups.lkp_languages

        this.lkp_languageLevel = lookups.lkp_languageLevel
    }

>>>>>>> 5adbb3d24b54c25f384a3239d8f94bb42af2727a
}