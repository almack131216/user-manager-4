import { inject, bindable } from 'aurelia-framework';
import { MyGlobals } from '../../my-globals'
import { MyNav } from '../../my-nav';
import * as Constants from '../../resources/constants';
const CV = Constants

@inject(MyGlobals,MyNav)
export class UiHeader {
    public CV = CV
    //@bindable currentUser = null;

    imgSrc_logo;
    imgSrc_strapline;

    myGlobals
    myNav

    constructor(myGlobals: MyGlobals, myNav: MyNav) {
        this.myGlobals = MyGlobals;
        this.myNav = myNav;
    }

    created() {
        this.imgSrc_logo = 'src/css/bp-logo.jpg';
        this.imgSrc_strapline = 'src/img/MRT_Identifier_V1b.png';
    }

}