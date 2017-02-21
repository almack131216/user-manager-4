import { inject,autoinject, bindable } from 'aurelia-framework';
import { MyGlobals } from '../../my-globals';
import { MyNav } from '../../my-nav';


@autoinject
@inject(MyGlobals,MyNav)

export class ProfileBrief {
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