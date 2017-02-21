
import { inject,bindable } from 'aurelia-framework';
import {MyGlobals} from '../../../my-globals' 

import * as Constants from '../../../resources/constants';
const CV = Constants

@inject(MyGlobals)
export class UserPanelPassport {
    public CV = CV;
    
    profile;
    @bindable isReadOnly = null;

    myGlobals
    myLookups    

    constructor(myGlobals:MyGlobals){
        this.myGlobals = MyGlobals
        this.profile = this.myGlobals.profileSelected
        this.myLookups = this.myGlobals.myLookups
    }
}