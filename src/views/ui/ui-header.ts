import {bindable} from 'aurelia-framework';
import * as Constants from '../../resources/constants';
const CV = Constants

export class UiHeader {
    public CV = CV
    @bindable currentUser = null;
}