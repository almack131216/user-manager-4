import { inject, bindable } from 'aurelia-framework';
import { MyGlobals } from '../../../my-globals'
import * as Constants from '../../../resources/constants';
const CV = Constants

import toastr = require('toastr');

@inject(MyGlobals)
export class UserPanelLanguages {
    public CV = CV;

    @bindable isReadOnly;

    myGlobals
    myLookups

    constructor(myGlobals: MyGlobals) {
        this.myGlobals = MyGlobals
        this.myLookups = this.myGlobals.myLookups
    }

    add() {
        this.myGlobals.profileSelected.languages.push({ languageId: null, proficiencyValue: null });
    }

    remove(getPos) {
        this.myGlobals.profileSelected.languages.splice(getPos, 1);
        toastr.success(CV.myApiMsg.LanguageRemoved);
    }
}