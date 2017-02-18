import { bindable } from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants

export class UserPanelLanguages {
    public CV = CV;
    @bindable user;
    @bindable profile;
    @bindable isReadOnly;
    @bindable myLookups;
    lkp_languages_limitTo = 5;
}