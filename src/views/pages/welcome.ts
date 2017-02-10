import { autoinject, bindable } from 'aurelia-framework';
import * as Constants from '../../resources/constants';
const CV = Constants
import { Lookups } from '../../resources/lookups';
@autoinject

export class Welcome {
    title = 'Welcome'

    @bindable user;
    public CV = CV;

    lkp_coatSizes;

    constructor(lookups:Lookups) {
        this.lkp_coatSizes = lookups.lkp_coatSizes
    }
}