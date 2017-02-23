import { inject, bindable } from 'aurelia-framework';
import { MyGlobals } from '../../../my-globals'
import * as Constants from '../../../resources/constants';
const CV = Constants

@inject(MyGlobals)
export class UserPanelLanguages {
    public CV = CV;

    profile;
    @bindable isReadOnly;
    //@bindable myLookups;
    lkp_languages_limitTo = 5;

    myGlobals
    myLookups

    constructor(myGlobals: MyGlobals) {
        this.myGlobals = MyGlobals
        this.profile = this.myGlobals.profileSelected
        this.myLookups = this.myGlobals.myLookups
    }

    add() {
        this.myGlobals.profileSelected.languages.push({ languageId: null, proficiencyValue: null });
    }

    remove(getPos) {
        this.myGlobals.profileSelected.languages.splice(getPos, 1);
    }
}