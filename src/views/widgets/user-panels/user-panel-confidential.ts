import { inject,bindable } from 'aurelia-framework';
import {MyGlobals} from '../../../my-globals' 

@inject(MyGlobals)
export class UserPanelConfidential {
    
    @bindable isReadOnly;

    myGlobals
    myLookups    

    constructor(myGlobals:MyGlobals){
        this.myGlobals = MyGlobals
        this.myLookups = this.myGlobals.myLookups
    }

}