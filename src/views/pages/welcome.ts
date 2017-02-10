import { autoinject, bindable } from 'aurelia-framework';
import * as Constants from '../../resources/constants';
const CV = Constants
import { Lookups } from '../../resources/lookups';
@autoinject

export class Welcome {
    title = 'Welcome'

    @bindable user;
    public CV = CV;

    isMember = false;
    lkp_coatSizes;
    memberPreview;

    constructor(lookups:Lookups) {
        this.lkp_coatSizes = lookups.lkp_coatSizes
        this.memberPreview = lookups.memberPreview;
    }
}