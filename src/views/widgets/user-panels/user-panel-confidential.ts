import { inject,bindable } from 'aurelia-framework';
import {MyGlobals} from '../../../my-globals' 

@inject(MyGlobals)
export class UserPanelConfidential {
    
    profile;
    @bindable isReadOnly;
    //@bindable myLookups;
    
    // lkp_employmentStatuses;
    lkp_credentialLevels;
    tmpField2;
    tmpField3;

    myGlobals
    myLookups    

    constructor(myGlobals:MyGlobals){
        this.myGlobals = MyGlobals
        this.profile = this.myGlobals.profileSelected
        this.myLookups = this.myGlobals.myLookups
    }

}