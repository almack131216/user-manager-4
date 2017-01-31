import { bindable } from 'aurelia-framework';
import * as Constants from '../../../resources/constants';
const CV = Constants

export class UserPanelDetails {
    public CV = CV;
    @bindable user;    
}