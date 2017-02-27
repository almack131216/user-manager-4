import { inject,autoinject, bindable } from 'aurelia-framework';
import { MyGlobals } from '../../my-globals';
import { MyNav } from '../../my-nav';
import * as Constants from '../../resources/constants';
const CV = Constants

@autoinject
@inject(MyGlobals,MyNav)

export class ProfileBrief {
    public CV = CV
    title = 'My Profile'

    @bindable custXc = false
    @bindable custXcId = 'profileBriefList'
    @bindable custXcExpanded = true

    @bindable currentUser
    @bindable memberArr

    myGlobals
    myNav

    constructor(myGlobals: MyGlobals, myNav: MyNav) {
        this.myGlobals = myGlobals;
        this.myNav = myNav;        
    }

    created(){
        // alert('currentUser: ' + JSON.stringify(this.currentUser))
        // alert('currentUser 2: ' + JSON.stringify(this.myGlobals.currentUser));
    }
}