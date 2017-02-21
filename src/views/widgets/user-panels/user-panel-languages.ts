import { inject,bindable } from 'aurelia-framework';
import {MyGlobals} from '../../../my-globals' 
import * as Constants from '../../../resources/constants';
const CV = Constants

@inject(MyGlobals)
export class UserPanelLanguages {
    public CV = CV;
    @bindable user;
    @bindable profile;
    @bindable isReadOnly;
    //@bindable myLookups;
    lkp_languages_limitTo = 5;

    myGlobals
    myLookups    

    constructor(myGlobals:MyGlobals){
        this.myGlobals = MyGlobals
        this.myLookups = this.myGlobals.myLookups
    }
}