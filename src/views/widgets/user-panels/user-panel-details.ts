import { inject,autoinject, bindable } from 'aurelia-framework';
import {MyGlobals} from '../../../my-globals' 
import * as Constants from '../../../resources/constants';
const CV = Constants

@autoinject
@inject(MyGlobals)
export class UserPanelDetails {
    //@bindable user;
    profile;
    @bindable isReadOnly;
    //@bindable myLookups;

    selectedFiles;

    public CV = CV;

    tmpShowLookupsDebug = false;

    myGlobals
    myLookups    

    constructor(myGlobals:MyGlobals){
        this.myGlobals = MyGlobals
        this.profile = this.myGlobals.profileSelected
        this.myLookups = this.myGlobals.myLookups
    }
    
}