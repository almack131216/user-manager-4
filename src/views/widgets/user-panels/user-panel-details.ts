import { autoinject, bindable } from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants
@autoinject

export class UserPanelDetails {
    @bindable user;
    @bindable profile;
    @bindable isReadOnly;
    //@bindable myLookups;

    selectedFiles;

    public CV = CV;

    tmpShowLookupsDebug = false;
    
}