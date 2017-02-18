
import { bindable } from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants

export class UserPanelPassport {
    public CV = CV;
    @bindable user;
    @bindable profile;
    @bindable isReadOnly = null;
    @bindable myLookups;
}